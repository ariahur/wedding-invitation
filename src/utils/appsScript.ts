interface AppsScriptResult<T> {
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
export const callWebApp = async <T,>(
  language: 'ko' | 'en',
  body: Record<string, unknown>,
  fallbackError: string
): Promise<AppsScriptResult<T>> => {
  const res = await fetch(getWebAppUrl(language), {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body),
  });

  const result = (await res.json().catch(() => ({}))) as AppsScriptResult<T>;
  if (!res.ok || result.success === false) {
    throw new Error(result.error || fallbackError);
  }
  return result;
};
