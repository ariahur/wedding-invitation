/**
 * 갤러리 사진 배치.
 *
 * 사진은 assets/originals/gallery/ 에 넣고 `npm run images` 를 돌리면
 * imageManifest.json 이 다시 만들어진다. 파일명 순서가 곧 배치 순서다.
 * (원본은 저장소에 올라가지 않으니 따로 보관할 것)
 */
import { imageGroup, ResponsiveImage } from './images';

export const galleryImages: ResponsiveImage[] = imageGroup('gallery');

export type GalleryBlockType =
  | 'feature-left'
  | 'feature-right'
  | 'trio'
  | 'pair'
  | 'duo'
  | 'split'
  | 'full';

export interface GalleryBlock {
  type: GalleryBlockType;
  /** galleryImages 기준 인덱스 (라이트박스 순서와 동일) */
  indexes: number[];
}

/**
 * 한 페이지가 차지하는 높이(가로폭 대비 비율)의 목표치.
 * 사진 장수가 아니라 높이로 끊어야 블록 종류가 섞여도 페이지마다 줄 수가 비슷해진다.
 * 한 줄이 대략 0.45~0.63 이므로 1.45 는 "세 줄" 정도다.
 */
export const PAGE_HEIGHT = 1.45;

export const isLandscape = (image: ResponsiveImage): boolean => image.width > image.height;

/**
 * 사진 방향에 맞는 블록을 골라 순서대로 채운다.
 * 한 블록 안의 사진은 같은 비율을 쓰므로 되도록 방향이 섞이지 않게 묶는다.
 *
 *   feature  세로 1장(큰 칸) + 가로 2장(오른쪽 위아래)
 *   trio     세로 3장
 *   duo      가로 2장
 *   pair     세로 2장
 *   split    방향이 다른 2장 — 정사각 칸이라 어느 쪽도 크게 잘리지 않는다
 *   full     남은 1장 — 사진 방향대로 높이가 정해진다
 *
 * split이 없으면 가로 사진이 세로 사진 사이에 하나씩 끼었을 때 full이 줄줄이 생기고,
 * 세로 full 한 장이 4/3을 먹어 페이지 높이가 통째로 늘어난다.
 */
const packBlocks = (images: ResponsiveImage[]): GalleryBlock[] => {
  const shape = images.map((image) => (isLandscape(image) ? 'L' : 'P'));
  const blocks: GalleryBlock[] = [];

  const at = (cursor: number, offset: number) => shape[cursor + offset];
  const span = (cursor: number, count: number) =>
    Array.from({ length: count }, (_, i) => cursor + i);

  let cursor = 0;

  while (cursor < images.length) {
    let block: GalleryBlock;

    if (at(cursor, 0) === 'P' && at(cursor, 1) === 'L' && at(cursor, 2) === 'L') {
      block = { type: 'feature-left', indexes: span(cursor, 3) };
    } else if (at(cursor, 0) === 'P' && at(cursor, 1) === 'P' && at(cursor, 2) === 'P') {
      block = { type: 'trio', indexes: span(cursor, 3) };
    } else if (at(cursor, 0) === 'L' && at(cursor, 1) === 'L') {
      block = { type: 'duo', indexes: span(cursor, 2) };
    } else if (at(cursor, 0) === 'P' && at(cursor, 1) === 'P') {
      block = { type: 'pair', indexes: span(cursor, 2) };
    } else if (at(cursor, 1) && at(cursor, 0) !== at(cursor, 1)) {
      block = { type: 'split', indexes: span(cursor, 2) };
    } else {
      block = { type: 'full', indexes: span(cursor, 1) };
    }

    blocks.push(block);
    cursor += block.indexes.length;
  }

  return blocks;
};

/**
 * 블록을 PAGE_HEIGHT 근처 높이로 끊는다 (블록은 쪼개지 않는다).
 * 넘기든 모자라든 목표에 더 가까워지는 쪽을 고르므로 페이지 높이가 고르게 맞는다.
 */
const paginate = (blocks: GalleryBlock[], images: ResponsiveImage[]): GalleryBlock[][] => {
  const pages: GalleryBlock[][] = [];
  let page: GalleryBlock[] = [];
  let height = 0;

  blocks.forEach((block) => {
    const next = height + blockHeightRatio(block, images);

    // 이 블록을 더 넣으면 목표에서 오히려 멀어지는 순간이 페이지 경계다
    if (page.length > 0 && Math.abs(next - PAGE_HEIGHT) >= Math.abs(height - PAGE_HEIGHT)) {
      pages.push(page);
      page = [];
      height = 0;
    }

    page.push(block);
    height += blockHeightRatio(block, images);
  });

  if (page.length > 0) pages.push(page);

  return pages;
};

/** 페이지마다 큰 사진을 좌우로 번갈아 둬야 넘길 때 리듬이 생긴다 */
const mirrorFeature = (block: GalleryBlock): GalleryBlock =>
  block.type === 'feature-left' ? { ...block, type: 'feature-right' } : block;

export const buildGalleryPages = (images: ResponsiveImage[]): GalleryBlock[][] =>
  paginate(packBlocks(images), images).map((page, pageIndex) =>
    pageIndex % 2 === 0 ? page : page.map(mirrorFeature)
  );

/**
 * 블록이 페이지 너비 대비 차지하는 높이.
 * 페이지 높이를 나눠 갖는 flex 가중치로 그대로 쓴다 — 비율은 유지한 채
 * 페이지 전체가 함께 늘어나므로 페이지마다 높이가 어긋나지 않는다.
 */
export const blockHeightRatio = (block: GalleryBlock, images: ResponsiveImage[]): number => {
  switch (block.type) {
    // 큰 사진이 1.15fr / 2.15fr 를 차지하고 3:4로 선다
    case 'feature-left':
    case 'feature-right':
      return (1.15 / 2.15) * (4 / 3);
    case 'trio':
      return (1 / 3) * (4 / 3);
    case 'pair':
      return (1 / 2) * (5 / 4);
    case 'duo':
      return (1 / 2) * (2 / 3);
    // 방향이 섞여 있어 정사각 칸으로 맞춘다
    case 'split':
      return 1 / 2;
    case 'full':
    default:
      return isLandscape(images[block.indexes[0]]) ? 2 / 3 : 4 / 3;
  }
};

/** 가장 높은 페이지에 나머지 페이지를 맞추기 위한 공통 높이 비율 */
export const pagesHeightRatio = (pages: GalleryBlock[][], images: ResponsiveImage[]): number =>
  Math.max(
    ...pages.map((page) =>
      page.reduce((sum, block) => sum + blockHeightRatio(block, images), 0)
    )
  );
