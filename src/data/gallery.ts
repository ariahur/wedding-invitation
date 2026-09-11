/**
 * 갤러리 사진 배치.
 *
 * 사진은 assets/originals/gallery/ 에 넣고 `npm run images` 를 돌리면
 * imageManifest.json 이 다시 만들어진다. 파일명 순서가 곧 배치 순서다.
 * (원본은 저장소에 올라가지 않으니 따로 보관할 것)
 */
import { imageGroup, ResponsiveImage } from './images';

export const galleryImages: ResponsiveImage[] = imageGroup('gallery');

/**
 * 페이지를 강제로 끊는 지점 — 여기 적힌 사진부터 새 페이지가 시작된다.
 * 값은 원본 파일명에서 배치 순서 접두사를 뗀 사진 번호다 ("14-79180.jpg" → "79180").
 * 마지막 지점 이후의 사진은 예전처럼 높이 기준으로 자동으로 나뉜다.
 * 매니페스트에 없는 번호는 무시된다.
 */
export const PAGE_BREAKS = ['78756', '79180', '79959'];

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

/** base "<순번>-<사진번호>-<해시8자>" 에서 사진 번호만 뗀다 ("34-80869-1-f2dfbffa" → "80869-1") */
export const photoNumber = (base: string): string => {
  const stem = base.slice(0, -9);
  return stem.slice(stem.indexOf('-') + 1);
};

type Shape = 'L' | 'P';

/**
 * cursor 위치에서 만들 수 있는 블록을 선호 순서대로 돌려준다.
 * 한 블록 안의 사진은 같은 비율을 쓰므로 되도록 방향이 섞이지 않게 묶는다.
 *
 *   feature  세로 1장(큰 칸) + 가로 2장(오른쪽 위아래)
 *   trio     세로 3장
 *   duo      가로 2장
 *   pair     세로 2장
 *   split    방향이 다른 2장 — 정사각 칸이라 어느 쪽도 크게 잘리지 않는다
 *   full     1장 — 사진 방향대로 높이가 정해진다
 *
 * split이 없으면 가로 사진이 세로 사진 사이에 하나씩 끼었을 때 full이 줄줄이 생기고,
 * 세로 full 한 장이 4/3을 먹어 페이지 높이가 통째로 늘어난다.
 */
const candidateBlocks = (shape: Shape[], cursor: number, end: number): GalleryBlock[] => {
  const at = (offset: number) => (cursor + offset < end ? shape[cursor + offset] : undefined);
  const span = (count: number) => Array.from({ length: count }, (_, i) => cursor + i);
  const blocks: GalleryBlock[] = [];

  if (at(0) === 'P' && at(1) === 'L' && at(2) === 'L') {
    blocks.push({ type: 'feature-left', indexes: span(3) });
  }
  if (at(0) === 'P' && at(1) === 'P' && at(2) === 'P') {
    blocks.push({ type: 'trio', indexes: span(3) });
  }
  if (at(0) === 'L' && at(1) === 'L') {
    blocks.push({ type: 'duo', indexes: span(2) });
  }
  if (at(0) === 'P' && at(1) === 'P') {
    blocks.push({ type: 'pair', indexes: span(2) });
  }
  if (at(1) && at(0) !== at(1)) {
    blocks.push({ type: 'split', indexes: span(2) });
  }
  blocks.push({ type: 'full', indexes: span(1) });

  return blocks;
};

const shapesOf = (images: ResponsiveImage[]): Shape[] =>
  images.map((image) => (isLandscape(image) ? 'L' : 'P'));

/** [start, end) 구간을 앞에서부터 가장 선호하는 블록으로 채운다 */
const packBlocks = (shape: Shape[], start: number, end: number): GalleryBlock[] => {
  const blocks: GalleryBlock[] = [];
  let cursor = start;

  while (cursor < end) {
    const block = candidateBlocks(shape, cursor, end)[0];
    blocks.push(block);
    cursor += block.indexes.length;
  }

  return blocks;
};

const pageHeight = (blocks: GalleryBlock[], images: ResponsiveImage[]): number =>
  blocks.reduce((sum, block) => sum + blockHeightRatio(block, images), 0);

/**
 * 한 페이지에 반드시 들어가야 하는 [start, end) 구간을 채우는 방법 중
 * 높이가 PAGE_HEIGHT 에 가장 가까운 것을 고른다.
 * 앞에서부터 욕심내어 묶으면 끝에 세로 full 이 남아 페이지가 통째로 늘어나기 쉽다.
 * 구간이 열 장 안팎이라 모든 조합을 다 세어도 부담이 없다.
 */
const packPage = (
  shape: Shape[],
  start: number,
  end: number,
  images: ResponsiveImage[]
): GalleryBlock[] => {
  const packings = (cursor: number): GalleryBlock[][] => {
    if (cursor >= end) return [[]];

    return candidateBlocks(shape, cursor, end).flatMap((block) =>
      packings(cursor + block.indexes.length).map((rest) => [block, ...rest])
    );
  };

  return packings(start).reduce((best, blocks) =>
    Math.abs(pageHeight(blocks, images) - PAGE_HEIGHT) <
    Math.abs(pageHeight(best, images) - PAGE_HEIGHT)
      ? blocks
      : best
  );
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

/**
 * PAGE_BREAKS 로 고정된 페이지는 구간 그대로 한 페이지에 담고,
 * 마지막 지점 이후는 높이 기준으로 자동으로 나눈다.
 */
export const buildGalleryPages = (images: ResponsiveImage[]): GalleryBlock[][] => {
  if (images.length === 0) return [];

  const shape = shapesOf(images);
  const starts = PAGE_BREAKS.map((number) =>
    images.findIndex((image) => photoNumber(image.base) === number)
  )
    .filter((index) => index > 0)
    .sort((a, b) => a - b);

  const fixedPages = starts.map((end, i) => packPage(shape, i === 0 ? 0 : starts[i - 1], end, images));
  const tailStart = starts.length > 0 ? starts[starts.length - 1] : 0;
  const tailPages = paginate(packBlocks(shape, tailStart, images.length), images);

  return [...fixedPages, ...tailPages].map((page, pageIndex) =>
    pageIndex % 2 === 0 ? page : page.map(mirrorFeature)
  );
};

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
  Math.max(...pages.map((page) => pageHeight(page, images)));
