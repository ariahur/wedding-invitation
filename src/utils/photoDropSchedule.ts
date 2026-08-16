import { CounterStatus } from '../types/photoDrop';

/**
 * 사진 수하물 카운터 운영 기간.
 * 예식 당일 새벽부터 열리고, 2주 뒤 자정에 닫힌다. (한국 시간 기준)
 */
export const COUNTER_OPENS_AT = new Date('2027-02-20T00:00:00+09:00');
export const COUNTER_CLOSES_AT = new Date('2027-03-06T23:59:59+09:00');

/**
 * 개발 중 각 상태를 미리 확인하기 위한 오버라이드.
 * .env에 REACT_APP_PHOTO_DROP_STATUS=open 처럼 넣으면 해당 상태로 고정된다.
 */
const getForcedStatus = (): CounterStatus | null => {
  // react-scripts가 쓰는 dotenv 10은 인라인 주석을 걷어내지 않는다.
  // "open  # ..." 처럼 적어도 동작하도록 첫 낱말만 본다.
  const forced = (process.env.REACT_APP_PHOTO_DROP_STATUS || '').trim().split(/[\s#]/)[0];
  if (forced === 'closed' || forced === 'open' || forced === 'archived') {
    return forced;
  }
  return null;
};

export const getCounterStatus = (now: Date = new Date()): CounterStatus => {
  const forced = getForcedStatus();
  if (forced) return forced;

  if (now < COUNTER_OPENS_AT) return 'closed';
  if (now > COUNTER_CLOSES_AT) return 'archived';
  return 'open';
};

/** 카운터 오픈까지 남은 일수 (이미 열렸으면 0) */
export const getDaysUntilOpen = (now: Date = new Date()): number => {
  const diff = COUNTER_OPENS_AT.getTime() - now.getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
};
