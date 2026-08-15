/**
 * 갤러리 사진 목록.
 *
 * 사진은 assets/originals/gallery/ 에 넣고 `npm run images` 를 돌리면
 * imageManifest.json 이 다시 만들어진다. 파일명 순서가 곧 배치 순서다.
 * (원본은 저장소에 올라가지 않으니 따로 보관할 것)
 */
import imageManifest from './imageManifest.json';

export interface ResponsiveImage {
  /** 변환 결과 파일명의 공통 앞부분 (내용 해시 포함) */
  base: string;
  /** 원본 크기 — 자리를 미리 잡아 레이아웃이 밀리지 않게 한다 */
  width: number;
  height: number;
  /** 만들어 둔 webp 너비 목록 */
  widths: number[];
  /** webp를 못 읽는 브라우저용 jpg 너비 */
  fallbackWidth: number;
  /** 로딩 중 자리를 채우는 흐릿한 미리보기 (data URI) */
  placeholder: string;
}

export const galleryImages: ResponsiveImage[] = imageManifest.gallery;
export const heroImage: ResponsiveImage | undefined = imageManifest.hero[0];

const assetUrl = (group: string, file: string): string =>
  `${process.env.PUBLIC_URL}/${group}/${file}`;

/** 브라우저가 화면 크기에 맞는 한 장을 고르도록 후보를 넘긴다 */
export const srcSet = (image: ResponsiveImage, group: string): string =>
  image.widths.map((w) => `${assetUrl(group, `${image.base}-${w}.webp`)} ${w}w`).join(', ');

/** webp 미지원 브라우저가 쓰는 기본 src */
export const fallbackSrc = (image: ResponsiveImage, group: string): string =>
  assetUrl(group, `${image.base}-${image.fallbackWidth}.jpg`);

/** 라이트박스처럼 한 장을 콕 집어 쓸 때 */
export const widthSrc = (image: ResponsiveImage, group: string, width: number): string =>
  assetUrl(group, `${image.base}-${width}.webp`);

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

export const buildGalleryBlocks = (images: ResponsiveImage[]): GalleryBlock[] => {
  const blocks: GalleryBlock[] = [];
  let cursor = 0;
  let step = 0;

  while (cursor < images.length) {
    const { type, size } = BLOCK_PATTERN[step % BLOCK_PATTERN.length];
    const start = cursor;
    const remaining = images.length - start;
    const indexes = Array.from({ length: Math.min(size, remaining) }, (_, i) => start + i);

    blocks.push(indexes.length < size ? tailBlock(indexes) : { type, indexes });

    cursor += indexes.length;
    step += 1;
  }

  return blocks;
};
