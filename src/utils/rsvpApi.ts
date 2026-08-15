import { RsvpTicket } from '../types/rsvp';

interface RsvpApiResult<T> {
  success: boolean;
  error?: string;
  data?: T;
  found?: boolean;
}

const getWebAppUrl = (language: 'ko' | 'en'): string => {
  const url = process.env.REACT_APP_GOOGLE_SHEETS_WEB_APP_URL;
  if (!url) {
    throw new Error(
      language === 'ko'
        ? 'Google 스프레드시트 연동이 설정되지 않았습니다. .env에 REACT_APP_GOOGLE_SHEETS_WEB_APP_URL을 추가해주세요.'
        : 'Google Sheets is not configured. Add REACT_APP_GOOGLE_SHEETS_WEB_APP_URL to .env.'
    );
  }
  return url;
};

/**
 * Apps Script 웹앱 호출.
 * Content-Type을 text/plain으로 보내 preflight(OPTIONS) 없이 요청한다.
 */
const callWebApp = async <T,>(
  language: 'ko' | 'en',
  body: Record<string, unknown>,
  fallbackError: string
): Promise<RsvpApiResult<T>> => {
  const res = await fetch(getWebAppUrl(language), {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body),
  });

  const result = (await res.json().catch(() => ({}))) as RsvpApiResult<T>;
  if (!res.ok || result.success === false) {
    throw new Error(result.error || fallbackError);
  }
  return result;
};

/** 탑승권 신청 (동일 성함 + 연락처가 있으면 시트에서 해당 행을 갱신) */
export const submitRsvp = async (
  language: 'ko' | 'en',
  ticket: RsvpTicket,
  fallbackError: string
): Promise<void> => {
  await callWebApp(language, { action: 'submit', ...ticket }, fallbackError);
};

/** 성함 + 연락처 뒷자리(한국어 4자리 / 영어 3자리)로 기존 신청 내역 조회 */
export const lookupRsvp = async (
  language: 'ko' | 'en',
  params: { name: string; phoneTail: string; digits: number },
  fallbackError: string
): Promise<RsvpTicket | null> => {
  const result = await callWebApp<RsvpTicket>(
    language,
    {
      action: 'lookup',
      name: params.name,
      phoneTail: params.phoneTail,
      digits: params.digits,
    },
    fallbackError
  );

  if (!result.found || !result.data) {
    return null;
  }
  return result.data;
};
