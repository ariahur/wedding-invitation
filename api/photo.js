/**
 * Vercel 서버리스 함수: 게스트 사진·영상 조각을 받아 네이버 MYBOX 에 이어 올린다.
 *
 * 브라우저 → POST /api/photo?name=…&fileName=…&mimeType=…&fileSize=…&offset=…&index=…[&storedName=…&modifiedTime=…]
 *            본문(Content-Type: application/octet-stream)은 파일의 [offset, offset+len) 구간 바이트 그대로.
 *
 * 응답: { success: true, data: { done: false, nextOffset, storedName, modifiedTime } }  → nextOffset 부터 이어서
 *       { success: true, data: { done: true, fileId, storedName } }                      → 저장 완료
 *       { success: false, error }
 *
 * MYBOX 저장소는 브라우저 직접 업로드(Origin 헤더)를 403 으로 막아 서버가 중계해야 하고,
 * Apps Script 로 중계하면 요청마다 2~3초의 기본 지연이 붙어서 이 함수로 옮겼다.
 * 시트 기록은 파일이 다 올라간 뒤 프론트가 Apps Script 의 action:'photoLog' 로 한 번에 남긴다.
 *
 * 환경 변수 (Vercel 대시보드 / 로컬은 .env):
 *   MYBOX_PAT         필수. MYBOX 개인 액세스 토큰 (mbx_pat_…). REACT_APP_ 접두사가 없으므로 번들에 들어가지 않는다.
 *   MYBOX_FOLDER_ID   선택. 저장 폴더 resourceId. 비우면 MYBOX_FOLDER_NAME 으로 루트에서 찾거나 만든다.
 *   MYBOX_FOLDER_NAME 선택. 기본값 '결혼식 게스트 사진'.
 */

const MYBOX_API = 'https://open-api.mybox.naver.com/v1';
const FOLDER_NAME = process.env.MYBOX_FOLDER_NAME || '결혼식 게스트 사진';

/** 파일 한 개의 최대 크기 (사진 / 영상). 프론트의 제한과 맞춰 둔다. */
const PHOTO_MAX_BYTES = 25 * 1024 * 1024;
const VIDEO_MAX_BYTES = 200 * 1024 * 1024;
/** Vercel 서버리스 함수의 요청 본문 한도가 4.5MB 라 조각도 그 안에서 받는다 */
const CHUNK_MAX_BYTES = 4.5 * 1024 * 1024;

/** 함수 인스턴스가 살아 있는 동안 폴더 ID를 기억한다 (콜드 스타트마다 한 번만 조회) */
let cachedFolderId = process.env.MYBOX_FOLDER_ID || '';

const token = () => {
  const value = process.env.MYBOX_PAT;
  if (!value) throw new Error('MYBOX_PAT is not configured');
  return value;
};

/** MYBOX API 호출. 응답 코드와 JSON 본문을 함께 돌려준다 */
const myBox = async (method, path, body) => {
  const response = await fetch(MYBOX_API + path, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }
  return { code: response.status, json };
};

/** 루트 바로 아래에서 이름이 같은 폴더를 찾는다. 없으면 '' */
const findRootFolder = async (folderName) => {
  let cursor = '';
  for (let page = 0; page < 10; page += 1) {
    const result = await myBox(
      'GET',
      `/drive/resources?count=1000${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
    );
    if (result.code !== 200) {
      throw new Error(`MYBOX list failed (${result.code}): ${JSON.stringify(result.json)}`);
    }
    const hit = (result.json.resources || []).find(
      (item) => item.type === 'folder' && item.name === folderName
    );
    if (hit) return hit.resourceId;

    cursor = (result.json.responseMetaData || {}).nextCursor || '';
    if (!cursor) break;
  }
  return '';
};

const getFolderId = async () => {
  if (cachedFolderId) return cachedFolderId;

  const found = await findRootFolder(FOLDER_NAME);
  if (found) {
    cachedFolderId = found;
    return found;
  }

  const created = await myBox('POST', '/drive/folders', { folderName: FOLDER_NAME });
  if (created.code !== 201 || !created.json.resourceId) {
    throw new Error(`MYBOX folder create failed (${created.code}): ${JSON.stringify(created.json)}`);
  }
  cachedFolderId = created.json.resourceId;
  return cachedFolderId;
};

/**
 * 업로드 URL을 연다. resume 이면 지금까지 받은 위치(offset)를 함께 받는다.
 * 이미 완료된 파일을 이어올리기 하면 MYBOX 가 409 를 돌려주므로 completed 로 표시한다.
 */
const openUpload = async (storedName, modifiedTime, fileSize, folderId, resume) => {
  const body = { fileName: storedName, fileSize, modifiedTime };
  if (folderId) body.parentId = folderId;
  if (resume) body.resume = true;

  const result = await myBox('POST', '/drive/files', body);
  if (resume && result.code === 409) {
    return { completed: true };
  }
  if (result.code !== 201 || !result.json.uploadUrl) {
    throw new Error(`MYBOX upload URL failed (${result.code}): ${JSON.stringify(result.json)}`);
  }
  return {
    completed: false,
    uploadUrl: result.json.uploadUrl,
    offset: Number(result.json.offset) || 0,
  };
};

/** 서울 시각 기준 'yyyyMMdd-HHmmss' 와 ISO(+09:00) 문자열 */
const seoulStamp = (date) => {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  const ymd = `${kst.getUTCFullYear()}${p(kst.getUTCMonth() + 1)}${p(kst.getUTCDate())}`;
  const hms = `${p(kst.getUTCHours())}${p(kst.getUTCMinutes())}${p(kst.getUTCSeconds())}`;
  return {
    compact: `${ymd}-${hms}`,
    iso: `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6)}T${hms.slice(0, 2)}:${hms.slice(2, 4)}:${hms.slice(4)}+09:00`,
  };
};

/** 성함에서 파일명에 쓸 수 없는 문자를 걷어낸다 (Apps Script 의 normalizeName 과 같은 취지) */
const safeName = (name) => name.replace(/[\s\\/:*?"<>|]/g, '').slice(0, 30) || 'guest';

const readQuery = (req) => {
  const q = req.query || {};
  const str = (key) => (Array.isArray(q[key]) ? q[key][0] : q[key]) || '';
  return {
    name: String(str('name')).trim(),
    fileName: String(str('fileName')),
    mimeType: String(str('mimeType') || 'application/octet-stream'),
    fileSize: Number(str('fileSize')) || 0,
    offset: Number(str('offset')) || 0,
    index: Number(str('index')) > 0 ? Number(str('index')) : 1,
    storedName: String(str('storedName')),
    modifiedTime: String(str('modifiedTime')),
  };
};

const bodyBuffer = (req) => {
  const body = req.body;
  if (Buffer.isBuffer(body)) return body;
  if (typeof body === 'string') return Buffer.from(body, 'binary');
  if (body && body.type === 'Buffer' && Array.isArray(body.data)) return Buffer.from(body.data);
  return Buffer.alloc(0);
};

const send = (res, status, payload) => {
  res.status(status).json(payload);
};

module.exports = async (req, res) => {
  // 로컬 개발(다른 포트)에서 호출할 수 있도록 CORS 를 연다. 배포에서는 같은 도메인이라 영향 없다.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    send(res, 405, { success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const q = readQuery(req);
    const bytes = bodyBuffer(req);

    if (!q.name || q.fileSize <= 0 || q.offset < 0) {
      send(res, 400, { success: false, error: 'Missing name or file data' });
      return;
    }
    const isVideo = q.mimeType.startsWith('video/');
    const isImage = q.mimeType.startsWith('image/');
    if (!isVideo && !isImage) {
      send(res, 400, { success: false, error: 'Only image or video files are accepted' });
      return;
    }
    if (q.fileSize > (isVideo ? VIDEO_MAX_BYTES : PHOTO_MAX_BYTES)) {
      send(res, 400, { success: false, error: 'File is too large' });
      return;
    }
    if (bytes.length === 0 || bytes.length > CHUNK_MAX_BYTES || q.offset + bytes.length > q.fileSize) {
      send(res, 400, { success: false, error: 'Invalid chunk' });
      return;
    }

    const folderId = await getFolderId();
    let { storedName, modifiedTime } = q;
    let target;

    if (q.offset === 0 && !storedName) {
      // 정렬하기 좋도록 접수 시각 + 성함 + 순번으로 파일명을 짓고,
      // 같은 이름이 동시에 올라오면 MYBOX 가 423 을 내므로 짧은 난수를 덧붙인다.
      const stamp = seoulStamp(new Date());
      const extension = (q.fileName.match(/\.[^.]+$/) || [isVideo ? '.mp4' : '.jpg'])[0];
      const rand = Math.random().toString(36).slice(2, 6);
      storedName = `${stamp.compact}_${safeName(q.name)}_${q.index}_${rand}${extension}`;
      modifiedTime = stamp.iso;
      target = await openUpload(storedName, modifiedTime, q.fileSize, folderId, false);
    } else {
      if (!storedName || !modifiedTime) {
        send(res, 400, { success: false, error: 'Missing upload key' });
        return;
      }
      target = await openUpload(storedName, modifiedTime, q.fileSize, folderId, true);

      if (target.completed) {
        // 이미 끝난 업로드 (이전 응답이 유실된 경우)
        send(res, 200, { success: true, data: { done: true, fileId: '', storedName } });
        return;
      }
      if (target.offset !== q.offset) {
        // 서버가 받은 위치가 다르면 그 위치부터 다시 보내달라고 알린다
        send(res, 200, {
          success: true,
          data: { done: false, nextOffset: target.offset, storedName, modifiedTime },
        });
        return;
      }
    }

    const end = q.offset + bytes.length;
    const isLast = end === q.fileSize;

    const form = new FormData();
    form.append('Filedata', new Blob([bytes], { type: q.mimeType }), storedName);
    const upload = await fetch(target.uploadUrl, {
      method: 'POST',
      headers: { 'Content-Range': `bytes ${q.offset}-${end - 1}/${q.fileSize}` },
      body: form,
    });
    const uploadText = await upload.text();

    if (!isLast) {
      // 중간 조각은 저장되지만 MYBOX 가 400("Invalid Data Format")을 돌려준다.
      // 실제 저장 위치는 다음 조각의 이어올리기 응답으로 다시 확인된다.
      if (upload.status !== 200 && upload.status !== 400) {
        throw new Error(`MYBOX upload failed (${upload.status}): ${uploadText}`);
      }
      send(res, 200, {
        success: true,
        data: { done: false, nextOffset: end, storedName, modifiedTime },
      });
      return;
    }

    if (upload.status !== 200) {
      throw new Error(`MYBOX upload failed (${upload.status}): ${uploadText}`);
    }

    let saved = {};
    try {
      saved = JSON.parse(uploadText || '{}');
    } catch {
      saved = {};
    }
    send(res, 200, {
      success: true,
      data: { done: true, fileId: String(saved.resourceId || ''), storedName },
    });
  } catch (error) {
    console.error('[api/photo]', error);
    send(res, 500, { success: false, error: error instanceof Error ? error.message : String(error) });
  }
};
