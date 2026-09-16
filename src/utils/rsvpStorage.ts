import { RsvpTicket } from '../types/rsvp';

const STORAGE_KEY = 'wedding-rsvp-ticket-v1';

/** 전화번호에서 숫자만 남긴다 (010-1234-5678 → 01012345678) */
export const normalizePhone = (phone: string): string => phone.replace(/\D/g, '');

/** 전화번호 뒤 4자리 */
export const phoneLast4 = (phone: string): string => normalizePhone(phone).slice(-4);

/**
 * 조회에 사용할 연락처 뒷자리 수.
 * 한국 번호(010-1234-5678)는 뒤 4자리, 호주 번호(0430 135 117)는 마지막 묶음이 3자리다.
 */
export const getLookupDigits = (language: 'ko' | 'en'): number => (language === 'ko' ? 4 : 3);

export const loadTicket = (): RsvpTicket | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as RsvpTicket;
    if (!parsed || typeof parsed.name !== 'string' || !parsed.attendance) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const saveTicket = (ticket: RsvpTicket): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ticket));
  } catch {
    // 시크릿 모드 등 저장이 불가능한 환경은 무시 (화면에는 그대로 노출)
  }
};

export const clearTicket = (): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
};
