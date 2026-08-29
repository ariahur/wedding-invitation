/**
 * Google Apps Script for RSVP Form to Google Sheets
 *
 * 사용 방법:
 * 1. Google Sheets를 새로 만들거나 기존 시트를 엽니다
 * 2. 확장 프로그램 > Apps Script를 클릭합니다
 * 3. 아래 코드를 붙여넣고 저장합니다
 * 4. 배포 > 새 배포 > 유형 선택: 웹 앱
 * 5. 다음 사용자로 실행: 나
 * 6. 액세스 권한: 모든 사용자
 * 7. 배포를 클릭하고 웹 앱 URL을 복사합니다
 * 8. .env 파일에 REACT_APP_GOOGLE_SHEETS_WEB_APP_URL=복사한URL 을 추가합니다
 *
 * ※ 코드를 수정한 뒤에는 반드시 "배포 관리 > 새 버전"으로 다시 배포해야 반영됩니다.
 *
 * 지원하는 요청 (POST, Content-Type: text/plain, body는 JSON 문자열):
 *   { action: 'submit', language, name, phone, email, attendance, guestCount, hasChildren, childrenAges, note }
 *     → 동일한 성함 + 연락처가 이미 있으면 해당 행을 갱신하고, 없으면 새 행을 추가합니다.
 *       email 이 비어 있지 않으면 그 주소로 탑승권 확인 메일을 보냅니다 (language 기준 ko/en).
 *   { action: 'lookup', name, phoneTail, digits }
 *     → 성함과 연락처 뒷자리가 일치하는 최신 신청 내역을 반환합니다.
 *       (한국어 화면은 뒤 4자리, 영어 화면은 호주 번호에 맞춰 뒤 3자리)
 *   { action: 'photo', name, phoneTail, message, batchId, tagNo, fileName, mimeType, data, index, total }
 *     → 게스트가 부친 사진 한 장을 Drive 폴더에 저장하고 PHOTOS 시트에 기록합니다.
 *       data는 base64 문자열이며, 사진은 한 장씩 순차로 전송됩니다.
 *
 * ※ 사진 접수를 쓰려면 Drive 권한 승인이 새로 필요합니다.
 *   코드를 붙여넣고 재배포한 뒤 권한 승인 창이 다시 뜨면 허용해주세요.
 *
 * ※ 확인 메일을 쓰려면 Gmail 전송 권한 승인도 새로 필요합니다. 재배포한 뒤 setupEmail() 을
 *   한 번 실행해 권한을 승인하고 남은 발송 할당량을 확인하세요.
 *   보내는 주소는 이 스크립트를 소유한 Google 계정입니다.
 *   일반 Gmail 계정은 하루 100통, Workspace 계정은 하루 1,500통까지 보낼 수 있습니다.
 */

// 시트 이름을 설정하세요 (기본값: 'RSVP')
const SHEET_NAME = 'RSVP';

// 게스트 사진 기록용 시트 이름
const PHOTO_SHEET_NAME = 'PHOTOS';

// 사진을 저장할 Drive 폴더 이름. 없으면 내 드라이브 루트에 자동으로 만들어집니다.
const PHOTO_FOLDER_NAME = '결혼식 게스트 사진';

// 특정 폴더에 저장하고 싶으면 폴더 ID를 넣으세요 (비워두면 위 이름으로 찾거나 새로 만듭니다)
const PHOTO_FOLDER_ID = '';

// 사진 한 장의 최대 크기 (디코딩 후 기준)
const PHOTO_MAX_BYTES = 12 * 1024 * 1024;

// ===== 확인 메일 =====

// 이메일을 남긴 게스트에게 탑승권 확인 메일을 보냅니다.
// false 로 바꾸면 시트 기록은 그대로 두고 발송만 끕니다.
const SEND_CONFIRMATION_EMAIL = true;

// 받는 사람에게 보이는 발신자 이름 (주소는 스크립트를 소유한 계정으로 고정된다)
const EMAIL_SENDER_NAME = '준용 ♥ 다영';

// 메일 하단 버튼이 가리키는 청첩장 주소
const INVITATION_URL = 'https://wedding-invitation-sigma-ivory.vercel.app';

// 메일에 찍힐 예식 정보. src/data/translations.ts 의 hero / rsvp.ticket 값과 맞춰 둔다.
const WEDDING_INFO = {
  flight: 'DA206',
  origin: 'SYD',
  destination: 'ICN',
  boarding: '15:00',
  gate: '1F',
  seatClass: 'GUEST',
  dateCode: '20 FEB 2027',
  ko: {
    couple: '조준용 ♥ 허다영',
    date: '2027년 2월 20일 토요일 오후 3시',
    venue: '그랜드힐컨벤션 1층 플로리아',
    address: '서울시 강남구 역삼로 607 (대치동)',
  },
  en: {
    couple: 'Daniel ♥ Aria',
    date: 'Saturday, 20 February 2027, 3:00 PM',
    venue: 'Grand Hill Convention, 1F Floria',
    address: '607 Yeoksam-ro, Gangnam-gu, Seoul',
  },
};

// 테마 색 (THEME_COLORS.md 코어 팔레트)
const EMAIL_COLORS = {
  navy: '#1A2F4A',
  gold: '#C9A77C',
  ivory: '#FAF8F3',
  white: '#FFFFFF',
  beige: '#E6D8C3',
  line: '#e0e0e0',
  label: '#9CA3AF',
  text: '#333333',
  subText: '#666666',
};

const COL = {
  TIMESTAMP: 1,
  NAME: 2,
  PHONE: 3,
  EMAIL: 4,
  ATTENDANCE: 5,
  GUEST_COUNT: 6,
  HAS_CHILDREN: 7,
  CHILDREN_AGES: 8,
  NOTE: 9,
  UPDATED_AT: 10,
};

const COLUMN_COUNT = 10;

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'submit';

    if (action === 'lookup') {
      return handleLookup(data);
    }

    if (action === 'photo') {
      return handlePhoto(data);
    }

    return handleSubmit(data);
  } catch (error) {
    return createResponse({
      success: false,
      error: error.toString(),
    });
  }
}

/** 신규 신청 또는 기존 신청 수정 */
function handleSubmit(data) {
  const sheet = getOrCreateSheet();
  const row = buildRow(data);
  // 재작성(수정) 여부는 연락처 뒤 4자리로 판별한다
  const existingRowIndex = findRowIndex(sheet, data.name, lastFourDigits(data.phone), 4);

  const updated = existingRowIndex > 0;

  if (updated) {
    // 최초 제출 시간은 유지하고 나머지 값만 갱신
    const originalTimestamp = sheet.getRange(existingRowIndex, COL.TIMESTAMP).getValue();
    row[COL.TIMESTAMP - 1] = originalTimestamp || row[COL.TIMESTAMP - 1];
    sheet.getRange(existingRowIndex, 1, 1, COLUMN_COUNT).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  const mailed = sendConfirmationEmail(data, updated);

  return createResponse({
    success: true,
    message: updated ? 'Data updated successfully' : 'Data added successfully',
    updated: updated,
    mailed: mailed,
  });
}

/** 성함 + 연락처 뒷자리로 신청 내역 조회 (한국 번호 4자리 / 호주 번호 3자리) */
function handleLookup(data) {
  const sheet = getOrCreateSheet();
  const name = normalizeName(data.name);
  const digits = Number(data.digits) > 0 ? Number(data.digits) : 4;
  const tail = onlyDigits(data.phoneTail || data.phoneLast4).slice(-digits);

  if (!name || tail.length !== digits) {
    return createResponse({ success: true, found: false });
  }

  const rowIndex = findRowIndex(sheet, data.name, tail, digits);
  if (rowIndex < 0) {
    return createResponse({ success: true, found: false });
  }

  const values = sheet.getRange(rowIndex, 1, 1, COLUMN_COUNT).getValues()[0];

  return createResponse({
    success: true,
    found: true,
    data: {
      name: String(values[COL.NAME - 1] || ''),
      phone: String(values[COL.PHONE - 1] || ''),
      email: String(values[COL.EMAIL - 1] || ''),
      attendance: values[COL.ATTENDANCE - 1] === '참석' ? 'attending' : 'not_attending',
      guestCount: values[COL.GUEST_COUNT - 1] ? Number(values[COL.GUEST_COUNT - 1]) : null,
      hasChildren: values[COL.HAS_CHILDREN - 1] === '예' ? 'yes' : 'no',
      childrenAges: String(values[COL.CHILDREN_AGES - 1] || ''),
      note: String(values[COL.NOTE - 1] || ''),
      submittedAt: toIsoString(values[COL.TIMESTAMP - 1]),
    },
  });
}

/** 게스트가 부친 사진 한 장을 Drive에 저장하고 PHOTOS 시트에 기록한다 */
function handlePhoto(data) {
  const name = String(data.name || '').trim();
  const base64 = String(data.data || '');

  if (!name || !base64) {
    return createResponse({ success: false, error: 'Missing name or photo data' });
  }

  const bytes = Utilities.base64Decode(base64);
  if (bytes.length > PHOTO_MAX_BYTES) {
    return createResponse({ success: false, error: 'Photo is too large' });
  }

  const tagNo = String(data.tagNo || '');
  const index = Number(data.index) > 0 ? Number(data.index) : 1;
  const safeName = normalizeName(name) || 'guest';
  const originalName = String(data.fileName || 'photo.jpg');
  const extension = (originalName.match(/\.[^.]+$/) || ['.jpg'])[0];
  // 정렬하기 좋도록 접수 시각 + 성함 + 순번으로 파일명을 다시 짓는다
  const storedName =
    Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd-HHmmss') +
    '_' + safeName + '_' + index + extension;

  const blob = Utilities.newBlob(bytes, String(data.mimeType || 'image/jpeg'), storedName);
  const file = getPhotoFolder().createFile(blob);

  const sheet = getOrCreatePhotoSheet();
  sheet.appendRow([
    new Date(),
    name,
    String(data.phoneTail || ''),
    tagNo,
    String(data.batchId || ''),
    index + ' / ' + (Number(data.total) || 1),
    storedName,
    file.getUrl(),
    String(data.message || ''),
  ]);

  return createResponse({
    success: true,
    message: 'Photo saved successfully',
    data: { fileId: file.getId() },
  });
}

/** 사진을 저장할 Drive 폴더 (ID가 지정되어 있으면 그 폴더, 아니면 이름으로 찾거나 생성) */
function getPhotoFolder() {
  if (PHOTO_FOLDER_ID) {
    return DriveApp.getFolderById(PHOTO_FOLDER_ID);
  }

  const existing = DriveApp.getFoldersByName(PHOTO_FOLDER_NAME);
  if (existing.hasNext()) {
    return existing.next();
  }

  return DriveApp.createFolder(PHOTO_FOLDER_NAME);
}

function getOrCreatePhotoSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(PHOTO_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(PHOTO_SHEET_NAME);
    setupPhotoHeaders(sheet);
  } else if (sheet.getLastRow() === 0) {
    setupPhotoHeaders(sheet);
  }

  return sheet;
}

function setupPhotoHeaders(sheet) {
  const headers = [
    '접수 시간',
    '성함',
    '연락처 뒷자리',
    '태그 번호',
    '접수 묶음',
    '순번',
    '파일명',
    '파일 링크',
    '한마디'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f0f0f0');
  headerRange.setBorder(true, true, true, true, true, true);

  sheet.autoResizeColumns(1, headers.length);
}

/** 성함이 같고 연락처 뒷자리가 같은 마지막(가장 최근) 행 번호. 없으면 -1 */
function findRowIndex(sheet, name, tail, digits) {
  const tailLength = Number(digits) > 0 ? Number(digits) : 4;
  const targetName = normalizeName(name);
  const targetTail = onlyDigits(tail).slice(-tailLength);

  if (!targetName || targetTail.length !== tailLength || sheet.getLastRow() < 2) {
    return -1;
  }

  const rowCount = sheet.getLastRow() - 1;
  const names = sheet.getRange(2, COL.NAME, rowCount, 1).getValues();
  const phones = sheet.getRange(2, COL.PHONE, rowCount, 1).getValues();

  for (let i = rowCount - 1; i >= 0; i--) {
    const rowName = normalizeName(names[i][0]);
    const rowTail = onlyDigits(phones[i][0]).slice(-tailLength);
    if (rowName && rowName === targetName && rowTail === targetTail) {
      return i + 2; // 헤더(1행) 보정
    }
  }

  return -1;
}

function buildRow(data) {
  return [
    new Date(),
    data.name || '',
    data.phone || '',
    data.email || '',
    data.attendance === 'attending' ? '참석' : '불참',
    data.guestCount || '',
    data.hasChildren === 'yes' ? '예' : '아니오',
    data.childrenAges || '',
    data.note || '',
    new Date(),
  ];
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    setupHeaders(sheet);
  } else if (sheet.getLastRow() === 0) {
    setupHeaders(sheet);
  }

  return sheet;
}

function normalizeName(value) {
  return String(value == null ? '' : value).replace(/\s+/g, '').toLowerCase();
}

function onlyDigits(value) {
  return String(value == null ? '' : value).replace(/[^0-9]/g, '');
}

function lastFourDigits(value) {
  return onlyDigits(value).slice(-4);
}

function toIsoString(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value ? String(value) : '';
}

// CORS 헤더를 포함한 응답 생성
function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupHeaders(sheet) {
  const headers = [
    '제출 시간',
    '성함',
    '연락처',
    '이메일',
    '참석 여부',
    '동행 인원',
    '아이 동반',
    '아이 나이',
    '특이사항',
    '최종 수정 시간'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // 헤더 스타일링
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f0f0f0');
  headerRange.setBorder(true, true, true, true, true, true);

  // 열 너비 자동 조정
  sheet.autoResizeColumns(1, headers.length);
}

// ===================================================================
// 확인 메일
// ===================================================================

const EMAIL_TEXT = {
  ko: {
    subjectIssued: '[{flight}] {origin} → {destination} 탑승권 발급 완료',
    subjectUpdated: '[{flight}] {origin} → {destination} 탑승권 변경 완료',
    subjectAbsent: '[{flight}] 다음 비행을 기약할게요',

    greeting: '{name}님, 참석 여부를 알려주셔서 감사합니다.',
    greetingAbsent: '{name}님, 마음 전해주셔서 감사합니다.',
    leadIssued: '아래 내용으로 접수되었습니다.',
    leadUpdated: '아래 내용으로 수정되었습니다.',

    detailsTitle: '신청해주신 내용',
    labelName: '성함',
    labelPhone: '연락처',
    labelEmail: '이메일',
    labelAttendance: '참석 여부',
    labelGuestCount: '동행 인원',
    labelChildren: '아이 동반',
    labelNote: '전달사항',

    valueAttending: '참석합니다',
    valueNotAttending: '참석이 어렵습니다',
    valueGuestCount: '{count}명 (본인 포함)',
    valueChildrenNo: '아니오',
    valueChildrenYes: '예',

    closingTitleAttending: '그날 뵙겠습니다',
    closingBodyAttending: '{date}\n{venue}\n\n오시는 길 조심히 오시고,\n게이트에서 반갑게 맞이하겠습니다.',
    closingTitleAbsent: '다음 비행을 기약할게요',
    closingBodyAbsent: '함께하지 못해 아쉽지만\n보내주신 마음 감사히 받겠습니다.\n다음에 좋은 자리에서 꼭 뵙기를 바랍니다.',

    button: '청첩장 다시 보기',
    editNote: '신청 내용은 청첩장의 “탑승권 신청”에서 언제든 다시 수정하실 수 있습니다.',
    footer: '이 메일은 발신 전용입니다.',
  },
  en: {
    subjectIssued: '[{flight}] {origin} → {destination} boarding pass issued',
    subjectUpdated: '[{flight}] {origin} → {destination} boarding pass updated',
    subjectAbsent: '[{flight}] We hope to see you on the next flight',

    greeting: '{name}, thank you for letting us know.',
    greetingAbsent: '{name}, thank you for your kind reply.',
    leadIssued: 'We have received your RSVP as below.',
    leadUpdated: 'Your RSVP has been updated as below.',

    detailsTitle: 'Your RSVP',
    labelName: 'Full Name',
    labelPhone: 'Phone',
    labelEmail: 'Email',
    labelAttendance: 'Attendance',
    labelGuestCount: 'Number of Guests',
    labelChildren: 'Children',
    labelNote: 'Special Requests',

    valueAttending: 'I will attend',
    valueNotAttending: 'I cannot attend',
    valueGuestCount: '{count} (including yourself)',
    valueChildrenNo: 'No',
    valueChildrenYes: 'Yes',

    closingTitleAttending: 'See you on the day',
    closingBodyAttending: '{date}\n{venue}\n\nTravel safe — we will be waiting\nto greet you at the gate.',
    closingTitleAbsent: 'Until the next flight',
    closingBodyAbsent: 'We are sorry you cannot join us,\nbut we are grateful for your warm wishes.\nWe hope to see you again before long.',

    button: 'Open the invitation',
    editNote: 'You can update your RSVP anytime from the “RSVP” section of the invitation.',
    footer: 'This mailbox is not monitored.',
  },
};

/**
 * 이메일을 남긴 게스트에게 확인 메일을 보낸다.
 * 메일 발송이 실패해도 신청 자체는 성공으로 남겨야 하므로 예외를 삼키고 false 를 돌려준다.
 */
function sendConfirmationEmail(data, updated) {
  if (!SEND_CONFIRMATION_EMAIL) {
    return false;
  }

  const to = String(data.email || '').trim();
  if (!isValidEmail(to)) {
    return false;
  }

  const language = data.language === 'en' ? 'en' : 'ko';
  const t = EMAIL_TEXT[language];
  const attending = data.attendance === 'attending';

  const subjectTemplate = attending
    ? (updated ? t.subjectUpdated : t.subjectIssued)
    : t.subjectAbsent;

  try {
    MailApp.sendEmail({
      to: to,
      name: EMAIL_SENDER_NAME,
      subject: fillTemplate(subjectTemplate, {
        flight: WEDDING_INFO.flight,
        origin: WEDDING_INFO.origin,
        destination: WEDDING_INFO.destination,
      }),
      body: buildConfirmationText(data, updated, language),
      htmlBody: buildConfirmationHtml(data, updated, language),
    });
    return true;
  } catch (error) {
    Logger.log('확인 메일 발송 실패 (' + String(data.name || '') + '): ' + error);
    return false;
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

/** '{key}' 자리를 values 의 값으로 바꾼다 */
function fillTemplate(template, values) {
  let result = String(template || '');
  for (const key in values) {
    result = result.split('{' + key + '}').join(String(values[key]));
  }
  return result;
}

/**
 * 폼에 작성된 내용을 [라벨, 값] 목록으로 정리한다.
 * 메일 본문(HTML)과 대체 텍스트가 같은 목록을 공유한다.
 */
function confirmationDetails(data, language) {
  const t = EMAIL_TEXT[language];
  const attending = data.attendance === 'attending';
  const rows = [];

  rows.push([t.labelName, String(data.name || '').trim()]);
  rows.push([t.labelPhone, String(data.phone || '').trim()]);
  rows.push([t.labelEmail, String(data.email || '').trim()]);
  rows.push([t.labelAttendance, attending ? t.valueAttending : t.valueNotAttending]);

  if (attending) {
    rows.push([
      t.labelGuestCount,
      fillTemplate(t.valueGuestCount, { count: Number(data.guestCount) || 1 }),
    ]);

    const ages = String(data.childrenAges || '').trim();
    if (data.hasChildren === 'yes') {
      rows.push([t.labelChildren, ages ? t.valueChildrenYes + ' · ' + ages : t.valueChildrenYes]);
    } else {
      rows.push([t.labelChildren, t.valueChildrenNo]);
    }
  }

  const note = String(data.note || '').trim();
  if (note) {
    rows.push([t.labelNote, note]);
  }

  return rows;
}

/** 참석/불참에 따라 달라지는 맺음말 */
function confirmationClosing(data, language) {
  const t = EMAIL_TEXT[language];
  const info = WEDDING_INFO[language];

  if (data.attendance === 'attending') {
    return {
      title: t.closingTitleAttending,
      body: fillTemplate(t.closingBodyAttending, { date: info.date, venue: info.venue }),
    };
  }

  return { title: t.closingTitleAbsent, body: t.closingBodyAbsent };
}

/** HTML을 못 읽는 클라이언트를 위한 대체 본문 */
function buildConfirmationText(data, updated, language) {
  const t = EMAIL_TEXT[language];
  const attending = data.attendance === 'attending';
  const name = String(data.name || '').trim();
  const closing = confirmationClosing(data, language);
  const lines = [];

  lines.push(fillTemplate(attending ? t.greeting : t.greetingAbsent, { name: name }));
  lines.push('');
  lines.push(updated ? t.leadUpdated : t.leadIssued);
  lines.push('');
  lines.push('[' + t.detailsTitle + ']');

  const rows = confirmationDetails(data, language);
  for (let i = 0; i < rows.length; i++) {
    lines.push(rows[i][0] + ': ' + rows[i][1]);
  }

  lines.push('');
  lines.push('[' + closing.title + ']');
  lines.push(closing.body);
  lines.push('');
  lines.push(t.button + ': ' + INVITATION_URL);
  lines.push(t.editNote);
  lines.push(t.footer);

  return lines.join('\n');
}

/** 확인 메일 HTML 본문 */
function buildConfirmationHtml(data, updated, language) {
  const t = EMAIL_TEXT[language];
  const attending = data.attendance === 'attending';
  const name = String(data.name || '').trim();

  const greeting = fillTemplate(attending ? t.greeting : t.greetingAbsent, { name: name });
  const lead = updated ? t.leadUpdated : t.leadIssued;
  const closing = confirmationClosing(data, language);

  const rows = confirmationDetails(data, language);
  let detailRows = '';
  for (let i = 0; i < rows.length; i++) {
    detailRows += emailDetailRow(rows[i][0], rows[i][1], i === rows.length - 1);
  }

  return '' +
  '<!DOCTYPE html>' +
  '<html lang="' + language + '"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>' + escapeHtml(WEDDING_INFO[language].couple) + '</title></head>' +
  '<body style="margin:0;padding:0;background:' + EMAIL_COLORS.ivory + ';">' +

  // 받은편지함 미리보기 줄 (본문에서는 감춘다)
  '<div style="display:none;font-size:1px;color:' + EMAIL_COLORS.ivory + ';max-height:0;overflow:hidden;">' +
    escapeHtml(lead) +
  '</div>' +

  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + EMAIL_COLORS.ivory + ';">' +
    '<tr><td align="center" style="padding:32px 16px;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">' +

        // 레터헤드
        '<tr><td align="center" style="padding-bottom:22px;font-family:Roboto,Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:' + EMAIL_COLORS.gold + ';">' +
          'NO RETURN AIRLINES &#183; ' + escapeHtml(WEDDING_INFO.flight) +
        '</td></tr>' +

        // 감사 인사
        '<tr><td align="center" style="padding-bottom:10px;font-family:Georgia,\'Times New Roman\',serif;font-size:19px;line-height:1.55;color:' + EMAIL_COLORS.navy + ';">' +
          escapeHtml(greeting) +
        '</td></tr>' +
        '<tr><td align="center" style="padding-bottom:24px;font-size:14px;line-height:1.8;color:' + EMAIL_COLORS.subText + ';">' +
          escapeHtml(lead) +
        '</td></tr>' +

        // 폼에 작성된 내용
        '<tr><td>' +
          '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + EMAIL_COLORS.white + ';border:1px solid ' + EMAIL_COLORS.beige + ';">' +
            '<tr><td style="background:' + EMAIL_COLORS.navy + ';border-bottom:4px solid ' + EMAIL_COLORS.gold + ';padding:14px 24px;font-family:Roboto,Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#FFFFFF;">' +
              escapeHtml(t.detailsTitle) +
            '</td></tr>' +
            '<tr><td style="padding:8px 24px 20px 24px;">' +
              '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' + detailRows + '</table>' +
            '</td></tr>' +
          '</table>' +
        '</td></tr>' +

        // 맺음말
        '<tr><td style="padding-top:24px;">' +
          '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + EMAIL_COLORS.white + ';border:1px dashed ' + EMAIL_COLORS.gold + ';">' +
            '<tr><td align="center" style="padding:26px 24px;">' +
              '<div style="font-family:Georgia,\'Times New Roman\',serif;font-size:17px;line-height:1.5;color:' + EMAIL_COLORS.navy + ';">' +
                escapeHtml(closing.title) +
              '</div>' +
              '<div style="padding:14px 0 18px 0;font-size:14px;line-height:1.8;color:' + EMAIL_COLORS.text + ';">' +
                nl2br(escapeHtml(closing.body)) +
              '</div>' +
              '<a href="' + INVITATION_URL + '" style="display:inline-block;padding:13px 30px;background:' + EMAIL_COLORS.navy + ';color:#FFFFFF;text-decoration:none;font-family:Roboto,Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;">' +
                escapeHtml(t.button) +
              '</a>' +
            '</td></tr>' +
          '</table>' +
        '</td></tr>' +

        // 푸터
        '<tr><td align="center" style="padding-top:20px;font-size:12px;line-height:1.7;color:#999999;">' +
          escapeHtml(t.editNote) + '<br>' + escapeHtml(t.footer) +
        '</td></tr>' +

      '</table>' +
    '</td></tr>' +
  '</table>' +
  '</body></html>';
}

/** 신청 내용 한 줄 (마지막 줄은 아래 구분선을 그리지 않는다) */
function emailDetailRow(label, value, isLast) {
  const border = isLast ? 'none' : '1px solid ' + EMAIL_COLORS.line;

  return '<tr>' +
    '<td width="96" valign="top" style="padding:12px 12px 12px 0;border-bottom:' + border + ';font-family:Roboto,Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:' + EMAIL_COLORS.label + ';">' +
      escapeHtml(label) +
    '</td>' +
    '<td valign="top" style="padding:12px 0;border-bottom:' + border + ';font-size:14px;line-height:1.7;color:' + EMAIL_COLORS.text + ';">' +
      nl2br(escapeHtml(value)) +
    '</td>' +
  '</tr>';
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nl2br(value) {
  return String(value == null ? '' : value).replace(/\n/g, '<br>');
}

/**
 * 확인 메일을 처음 설정할 때 Apps Script 편집기에서 한 번 실행하세요.
 * Gmail 전송 권한 승인 창을 띄우고, 오늘 남은 발송 가능 통수를 로그에 찍습니다.
 */
function setupEmail() {
  Logger.log('보내는 주소: ' + Session.getEffectiveUser().getEmail());
  Logger.log('오늘 남은 발송 가능 통수: ' + MailApp.getRemainingDailyQuota());
  Logger.log('발송 스위치(SEND_CONFIRMATION_EMAIL): ' + SEND_CONFIRMATION_EMAIL);
}

/** 확인 메일 미리보기 — 실행하면 스크립트 소유자 주소로 샘플 두 통이 발송됩니다. */
function sendTestConfirmationEmail() {
  const to = Session.getEffectiveUser().getEmail();

  sendConfirmationEmail({
    language: 'ko',
    name: '홍길동',
    phone: '010-1234-5678',
    email: to,
    attendance: 'attending',
    guestCount: 2,
    hasChildren: 'yes',
    childrenAges: '5세, 7세',
    note: '축하드려요! 그날 꼭 갈게요.',
  }, false);

  sendConfirmationEmail({
    language: 'ko',
    name: '김철수',
    phone: '010-9999-1234',
    email: to,
    attendance: 'not_attending',
    note: '멀리서 축하할게요.',
  }, false);

  Logger.log('테스트 메일 2통을 ' + to + ' 로 보냈습니다.');
}


// GET 요청 처리 (테스트용)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    message: 'Google Sheets Web App is running',
    method: 'Use POST to submit RSVP data'
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 사진 접수를 처음 설정할 때 Apps Script 편집기에서 한 번 실행하세요.
 * Drive 권한 승인 창을 띄우고, 사진 폴더와 PHOTOS 시트를 미리 만들어 둡니다.
 * 실행 로그에 폴더 URL이 찍히니 그 폴더를 즐겨찾기 해두면 편합니다.
 */
function setupPhotoDrop() {
  const folder = getPhotoFolder();
  getOrCreatePhotoSheet();

  Logger.log('사진 폴더: ' + folder.getName());
  Logger.log('폴더 URL: ' + folder.getUrl());
  Logger.log('폴더 ID: ' + folder.getId());
  Logger.log('PHOTOS 시트 준비 완료');
}
