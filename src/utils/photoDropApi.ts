import { callWebApp } from './appsScript';
import { compressImage, prepareVideo } from './imageCompress';
import { PhotoKind } from '../types/photoDrop';

export interface PhotoUploadMeta {
  name: string;
  /** 탑승권이 있는 손님이면 연락처 뒤 4자리 (매칭용, 선택) */
  phoneTail?: string;
  message?: string;
  /** 한 번의 접수를 묶는 식별자 */
  batchId: string;
  tagNo: string;
}

/** MYBOX 에 저장이 끝난 파일. 접수가 끝나면 묶어서 시트에 기록한다 */
export interface UploadedFile {
  index: number;
  storedName: string;
  fileId: string;
}

interface UploadChunkResult {
  success: boolean;
  error?: string;
  data?: {
    done: boolean;
    nextOffset?: number;
    storedName?: string;
    modifiedTime?: string;
    fileId?: string;
  };
}

/**
 * 파일 조각을 받아 MYBOX 로 중계하는 Vercel 함수 (api/photo.js).
 * 배포에서는 같은 도메인의 /api/photo 를 쓰고, 로컬 개발은 REACT_APP_PHOTO_UPLOAD_URL 로 바꿔 끼운다.
 */
const UPLOAD_URL = process.env.REACT_APP_PHOTO_UPLOAD_URL || '/api/photo';

/** Vercel 함수의 요청 본문 한도(4.5MB) 안에서 한 번에 보내는 조각 크기 */
const CHUNK_SIZE = 4 * 1024 * 1024;

/** 서버가 같은 위치를 계속 요구하면 무한 반복을 막기 위해 포기한다 */
const MAX_STALLS = 3;

/**
 * 사진·영상 한 파일을 MYBOX 에 올린다.
 * 파일을 CHUNK_SIZE 로 잘라 바이너리 그대로 보내고, 서버가 알려주는 nextOffset 부터 이어 보낸다.
 */
export const uploadPhoto = async (
  file: File,
  kind: PhotoKind,
  meta: PhotoUploadMeta,
  index: number,
  fallbackError: string,
  onProgress?: (fraction: number) => void
): Promise<UploadedFile> => {
  const prepared = kind === 'video' ? prepareVideo(file) : await compressImage(file);
  if (prepared.size <= 0) {
    throw new Error(fallbackError);
  }

  let offset = 0;
  let storedName = '';
  let modifiedTime = '';
  let stalls = 0;

  while (true) {
    const end = Math.min(offset + CHUNK_SIZE, prepared.size);
    const params = new URLSearchParams({
      name: meta.name,
      fileName: prepared.fileName,
      mimeType: prepared.mimeType,
      fileSize: String(prepared.size),
      offset: String(offset),
      index: String(index),
    });
    if (storedName) {
      params.set('storedName', storedName);
      params.set('modifiedTime', modifiedTime);
    }

    const response = await fetch(`${UPLOAD_URL}?${params.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: prepared.blob.slice(offset, end),
    });
    const result = (await response.json().catch(() => ({}))) as UploadChunkResult;
    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || fallbackError);
    }

    const chunk = result.data;
    if (chunk.done) {
      onProgress?.(1);
      return {
        index,
        storedName: chunk.storedName || storedName,
        fileId: chunk.fileId || '',
      };
    }

    const nextOffset = Number(chunk.nextOffset);
    if (!Number.isFinite(nextOffset) || nextOffset < 0 || nextOffset > prepared.size) {
      throw new Error(fallbackError);
    }
    if (nextOffset <= offset) {
      stalls += 1;
      if (stalls >= MAX_STALLS) {
        throw new Error(fallbackError);
      }
    } else {
      stalls = 0;
    }

    storedName = chunk.storedName || storedName;
    modifiedTime = chunk.modifiedTime || modifiedTime;
    offset = nextOffset;
    onProgress?.(offset / prepared.size);
  }
};

/**
 * 접수 한 번에 올라간 파일들을 Apps Script 의 PHOTOS 시트에 한 번에 기록한다.
 * Apps Script 는 요청마다 2~3초가 걸리므로 파일마다 부르지 않고 묶어서 부른다.
 */
export const logPhotoBatch = async (
  language: 'ko' | 'en',
  meta: PhotoUploadMeta,
  files: UploadedFile[],
  total: number,
  fallbackError: string
): Promise<void> => {
  if (files.length === 0) return;

  await callWebApp(
    language,
    {
      action: 'photoLog',
      name: meta.name,
      phoneTail: meta.phoneTail || '',
      message: meta.message || '',
      batchId: meta.batchId,
      tagNo: meta.tagNo,
      total,
      files,
    },
    fallbackError
  );
};
