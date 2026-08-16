import { BagTag } from '../types/photoDrop';

const STORAGE_KEY = 'wedding-photo-bag-tag-v1';

export const loadBagTag = (): BagTag | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as BagTag;
    if (!parsed || typeof parsed.tagNo !== 'string' || typeof parsed.photoCount !== 'number') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const saveBagTag = (tag: BagTag): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tag));
  } catch {
    // 시크릿 모드 등 저장이 불가능한 환경은 무시 (화면에는 그대로 노출)
  }
};

/** 태그 번호: 편명 + 접수 월일 + 이름/시각 기반 일련번호 (예: DA206-0220-0431) */
export const buildTagNo = (flight: string, name: string, at: Date): string => {
  const seed = `${name}-${at.getTime()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const month = String(at.getMonth() + 1).padStart(2, '0');
  const day = String(at.getDate()).padStart(2, '0');
  const serial = String(hash % 10000).padStart(4, '0');

  return `${flight}-${month}${day}-${serial}`;
};
