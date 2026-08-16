import { callWebApp } from './appsScript';
import { compressImage } from './imageCompress';

export interface PhotoUploadMeta {
  name: string;
  /** 탑승권이 있는 손님이면 연락처 뒤 4자리 (매칭용, 선택) */
  phoneTail?: string;
  message?: string;
  /** 한 번의 접수를 묶는 식별자 */
  batchId: string;
  tagNo: string;
}

/**
 * 사진 한 장을 Apps Script로 보낸다.
 * 요청 크기 때문에 여러 장을 한 번에 보내지 않고 한 장씩 순차 전송한다.
 */
export const uploadPhoto = async (
  language: 'ko' | 'en',
  file: File,
  meta: PhotoUploadMeta,
  index: number,
  total: number,
  fallbackError: string
): Promise<void> => {
  const image = await compressImage(file);

  await callWebApp(
    language,
    {
      action: 'photo',
      name: meta.name,
      phoneTail: meta.phoneTail || '',
      message: meta.message || '',
      batchId: meta.batchId,
      tagNo: meta.tagNo,
      fileName: image.fileName,
      mimeType: image.mimeType,
      data: image.base64,
      index,
      total,
    },
    fallbackError
  );
};
