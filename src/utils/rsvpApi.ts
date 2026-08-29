import { RsvpTicket } from '../types/rsvp';
import { callWebApp } from './appsScript';

/** 탑승권 신청 (동일 성함 + 연락처가 있으면 시트에서 해당 행을 갱신) */
export const submitRsvp = async (
  language: 'ko' | 'en',
  ticket: RsvpTicket,
  fallbackError: string
): Promise<void> => {
  // language 는 Apps Script 가 확인 메일을 어느 언어로 보낼지 고르는 데 쓴다
  await callWebApp(language, { action: 'submit', language, ...ticket }, fallbackError);
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
