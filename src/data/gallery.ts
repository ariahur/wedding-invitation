/**
 * 갤러리 사진 목록.
 * public/gallery 안의 파일명을 순서대로 적으면 그 순서대로 배치된다.
 * (파일을 교체하면 이 목록만 수정하면 된다)
 */
export const galleryImages: string[] = [
  '79660-1.jpg',
  '78807스프레드-1.jpg',
  '80050-1.jpg',
  '79763-1.jpg',
  '80000-1.jpg',
  '80262-1.jpg',
  '80226스프레드-1.jpg',
  '79068마지막페이지-1.jpg',
  '80320-1.jpg',
];

/** 한글 파일명이 섞여 있어 인코딩해서 사용한다 */
export const galleryImageUrl = (file: string): string =>
  `${process.env.PUBLIC_URL}/gallery/${encodeURIComponent(file)}`;

export type GalleryBlockType = 'feature-left' | 'feature-right' | 'trio' | 'full' | 'pair';

export interface GalleryBlock {
  type: GalleryBlockType;
  /** galleryImages 기준 인덱스 (라이트박스 순서와 동일) */
  indexes: number[];
}

/** 반복되는 배치 패턴. 사진 수가 바뀌어도 이 패턴을 돌면서 채운다. */
const BLOCK_PATTERN: { type: GalleryBlockType; size: number }[] = [
  { type: 'feature-left', size: 3 },
  { type: 'trio', size: 3 },
  { type: 'full', size: 1 },
  { type: 'pair', size: 2 },
  { type: 'feature-right', size: 3 },
  { type: 'pair', size: 2 },
];

/** 남은 장수에 맞춰 마지막 블록을 정리한다 */
const tailBlock = (indexes: number[]): GalleryBlock =>
  indexes.length === 1 ? { type: 'full', indexes } : { type: 'pair', indexes };

export const buildGalleryBlocks = (images: string[]): GalleryBlock[] => {
  const blocks: GalleryBlock[] = [];
  let cursor = 0;
  let step = 0;

  while (cursor < images.length) {
    const { type, size } = BLOCK_PATTERN[step % BLOCK_PATTERN.length];
    const remaining = images.length - cursor;
    const indexes = Array.from({ length: Math.min(size, remaining) }, (_, i) => cursor + i);

    blocks.push(indexes.length < size ? tailBlock(indexes) : { type, indexes });

    cursor += indexes.length;
    step += 1;
  }

  return blocks;
};
