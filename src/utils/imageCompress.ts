/** 긴 변 최대 길이 */
const MAX_EDGE = 2048;
/** JPEG 품질 */
const QUALITY = 0.82;
/**
 * 캔버스 디코딩이 실패했을 때(데스크톱 브라우저의 HEIC 등) 원본을 그대로 올릴 수 있는 최대 크기.
 * base64는 약 1.33배로 부풀기 때문에 Apps Script 페이로드 한도를 넘지 않도록 제한한다.
 */
const RAW_FALLBACK_LIMIT = 6 * 1024 * 1024;

export interface CompressedImage {
  /** data: 접두사를 제거한 base64 문자열 */
  base64: string;
  mimeType: string;
  fileName: string;
  /** 전송되는 바이너리 크기 (bytes) */
  size: number;
}

/** EXIF 회전을 반영해 비트맵으로 디코딩한다. 실패하면 null */
const loadBitmap = async (file: File): Promise<ImageBitmap | null> => {
  if (typeof createImageBitmap !== 'function') return null;

  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // imageOrientation 옵션을 모르는 구형 브라우저
    try {
      return await createImageBitmap(file);
    } catch {
      return null;
    }
  }
};

/** createImageBitmap을 쓸 수 없을 때의 폴백 디코딩 */
const loadImageElement = (file: File): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', QUALITY);
  });

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      // "data:image/jpeg;base64,AAAA..." → "AAAA..."
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error('read failed'));
    reader.readAsDataURL(blob);
  });

/** Drive에 그대로 쓸 수 있도록 파일명을 정리한다 */
const sanitizeFileName = (name: string): string =>
  name.replace(/[\\/:*?"<>|]/g, '_').slice(-80) || 'photo';

const withJpegExtension = (name: string): string =>
  `${sanitizeFileName(name).replace(/\.[^.]+$/, '')}.jpg`;

/**
 * 업로드 전에 사진을 줄인다.
 * 긴 변을 MAX_EDGE로 맞추고 JPEG로 다시 인코딩해 Apps Script로 보낼 수 있는 크기로 만든다.
 * 브라우저가 디코딩하지 못하는 형식(데스크톱의 HEIC 등)은 원본을 그대로 올린다.
 */
export const compressImage = async (file: File): Promise<CompressedImage> => {
  const source: ImageBitmap | HTMLImageElement | null =
    (await loadBitmap(file)) || (await loadImageElement(file));

  const sourceWidth = source ? source.width : 0;
  const sourceHeight = source ? source.height : 0;

  if (!source || !sourceWidth || !sourceHeight) {
    if (file.size > RAW_FALLBACK_LIMIT) {
      throw new Error('unsupported');
    }
    return {
      base64: await blobToBase64(file),
      mimeType: file.type || 'application/octet-stream',
      fileName: sanitizeFileName(file.name),
      size: file.size,
    };
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(sourceWidth, sourceHeight));
  const width = Math.round(sourceWidth * scale);
  const height = Math.round(sourceHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  let blob: Blob | null = null;

  if (ctx) {
    ctx.drawImage(source, 0, 0, width, height);
    blob = await canvasToBlob(canvas);
  }

  if ('close' in source && typeof source.close === 'function') {
    source.close();
  }

  // 캔버스 인코딩이 실패하면 원본으로 되돌린다
  if (!blob) {
    if (file.size > RAW_FALLBACK_LIMIT) {
      throw new Error('unsupported');
    }
    return {
      base64: await blobToBase64(file),
      mimeType: file.type || 'application/octet-stream',
      fileName: sanitizeFileName(file.name),
      size: file.size,
    };
  }

  return {
    base64: await blobToBase64(blob),
    mimeType: 'image/jpeg',
    fileName: withJpegExtension(file.name),
    size: blob.size,
  };
};
