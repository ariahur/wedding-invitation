/**
 * 사진을 화면 크기에 맞는 크기로 내려주기 위한 공통 도구.
 *
 * 원본은 assets/originals/<그룹>/ 에 넣고 `npm run images` 를 돌리면
 * public/<그룹>/ 에 여러 크기의 webp(+ 폴백 jpg)가 만들어지고
 * imageManifest.json 이 갱신된다. 코드에서는 "<그룹>/<파일명>" 키로 찾아 쓴다.
 *   예) imageProps('about/groom', '200px')
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

const manifest: Record<string, ResponsiveImage[]> = imageManifest;

export const imageGroup = (group: string): ResponsiveImage[] => manifest[group] ?? [];

/** "about/groom" 처럼 <그룹>/<원본 파일명(확장자 제외)> 으로 찾는다 */
export const findImage = (key: string | undefined): ResponsiveImage | undefined => {
  const slash = key ? key.lastIndexOf('/') : -1;
  if (!key || slash < 0) return undefined;

  const group = key.slice(0, slash);
  const stem = key.slice(slash + 1);

  // base는 "<파일명>-<해시8자>" 형태라 해시를 떼고 비교한다
  return imageGroup(group).find((image) => image.base.slice(0, -9) === stem);
};

const assetUrl = (group: string, file: string): string =>
  `${process.env.PUBLIC_URL}/${group}/${file}`;

/** 브라우저가 화면 크기에 맞는 한 장을 고르도록 후보를 넘긴다 */
export const srcSet = (image: ResponsiveImage, group: string): string =>
  image.widths.map((w) => `${assetUrl(group, `${image.base}-${w}.webp`)} ${w}w`).join(', ');

/** webp 미지원 브라우저가 쓰는 기본 src */
export const fallbackSrc = (image: ResponsiveImage, group: string): string =>
  assetUrl(group, `${image.base}-${image.fallbackWidth}.jpg`);

/** srcset을 쓸 수 없는 곳(CSS background 등)에서 한 장만 콕 집어 쓸 때 */
export const singleSrc = (key: string, width: number): string => {
  const image = findImage(key);
  if (!image) return '';

  const group = key.slice(0, key.lastIndexOf('/'));
  // 원본이 작아 요청한 크기가 없으면 가장 큰 것으로 대신한다
  const available = image.widths.includes(width)
    ? width
    : image.widths[image.widths.length - 1];

  return assetUrl(group, `${image.base}-${available}.webp`);
};

export interface ImageProps {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
}

/**
 * <img>에 그대로 펼쳐 넣는 속성 묶음.
 * sizes는 그 사진이 화면에서 실제로 차지하는 너비다. 레이아웃과 어긋나면
 * 브라우저가 필요 이상으로 큰 사진을 받으니 CSS와 맞춰 적을 것.
 */
export const imageProps = (key: string | undefined, sizes: string): ImageProps | null => {
  const image = findImage(key);
  if (!image || !key) return null;

  const group = key.slice(0, key.lastIndexOf('/'));

  return {
    src: fallbackSrc(image, group),
    srcSet: srcSet(image, group),
    sizes,
    width: image.width,
    height: image.height,
  };
};
