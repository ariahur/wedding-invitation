/**
 * Google Apps Script for RSVP Form to Google Sheets
 *
 * 사용 방법:
 * 1. Google Sheets를 새로 만들거나 기존 시트를 엽니다
 * 2. 확장 프로그램 > Apps Script를 클릭합니다
 * 3. 아래 코드를 붙여넣고 저장합니다
 * 4. 배포 > 새 배포 > 유형 선택: 웹 앱
 * 5. 다음 사용자로 실행: 나
 * 6. 액세스 권한: 모든 사용자
 * 7. 배포를 클릭하고 웹 앱 URL을 복사합니다
 * 8. .env 파일에 REACT_APP_GOOGLE_SHEETS_WEB_APP_URL=복사한URL 을 추가합니다
 *
 * ※ 코드를 수정한 뒤에는 반드시 "배포 관리 > 새 버전"으로 다시 배포해야 반영됩니다.
 *
 * 지원하는 요청 (POST, Content-Type: text/plain, body는 JSON 문자열):
 *   { action: 'submit', name, phone, email, attendance, guestCount, hasChildren, childrenAges, note }
 *     → 동일한 성함 + 연락처가 이미 있으면 해당 행을 갱신하고, 없으면 새 행을 추가합니다.
 *   { action: 'lookup', name, phoneTail, digits }
 *     → 성함과 연락처 뒷자리가 일치하는 최신 신청 내역을 반환합니다.
 *       (한국어 화면은 뒤 4자리, 영어 화면은 호주 번호에 맞춰 뒤 3자리)
 */

// 시트 이름을 설정하세요 (기본값: 'RSVP')
const SHEET_NAME = 'RSVP';

const COL = {
  TIMESTAMP: 1,
  NAME: 2,
  PHONE: 3,
  EMAIL: 4,
  ATTENDANCE: 5,
  GUEST_COUNT: 6,
  HAS_CHILDREN: 7,
  CHILDREN_AGES: 8,
  NOTE: 9,
  UPDATED_AT: 10,
};

const COLUMN_COUNT = 10;

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'submit';

    if (action === 'lookup') {
      return handleLookup(data);
    }

    return handleSubmit(data);
  } catch (error) {
    return createResponse({
      success: false,
      error: error.toString(),
    });
  }
}

/** 신규 신청 또는 기존 신청 수정 */
function handleSubmit(data) {
  const sheet = getOrCreateSheet();
  const row = buildRow(data);
  // 재작성(수정) 여부는 연락처 뒤 4자리로 판별한다
  const existingRowIndex = findRowIndex(sheet, data.name, lastFourDigits(data.phone), 4);

  if (existingRowIndex > 0) {
    // 최초 제출 시간은 유지하고 나머지 값만 갱신
    const originalTimestamp = sheet.getRange(existingRowIndex, COL.TIMESTAMP).getValue();
    row[COL.TIMESTAMP - 1] = originalTimestamp || row[COL.TIMESTAMP - 1];
    sheet.getRange(existingRowIndex, 1, 1, COLUMN_COUNT).setValues([row]);

    return createResponse({
      success: true,
      message: 'Data updated successfully',
      updated: true,
    });
  }

  sheet.appendRow(row);

  return createResponse({
    success: true,
    message: 'Data added successfully',
    updated: false,
  });
}

/** 성함 + 연락처 뒷자리로 신청 내역 조회 (한국 번호 4자리 / 호주 번호 3자리) */
function handleLookup(data) {
  const sheet = getOrCreateSheet();
  const name = normalizeName(data.name);
  const digits = Number(data.digits) > 0 ? Number(data.digits) : 4;
  const tail = onlyDigits(data.phoneTail || data.phoneLast4).slice(-digits);

  if (!name || tail.length !== digits) {
    return createResponse({ success: true, found: false });
  }

  const rowIndex = findRowIndex(sheet, data.name, tail, digits);
  if (rowIndex < 0) {
    return createResponse({ success: true, found: false });
  }

  const values = sheet.getRange(rowIndex, 1, 1, COLUMN_COUNT).getValues()[0];

  return createResponse({
    success: true,
    found: true,
    data: {
      name: String(values[COL.NAME - 1] || ''),
      phone: String(values[COL.PHONE - 1] || ''),
      email: String(values[COL.EMAIL - 1] || ''),
      attendance: values[COL.ATTENDANCE - 1] === '참석' ? 'attending' : 'not_attending',
      guestCount: values[COL.GUEST_COUNT - 1] ? Number(values[COL.GUEST_COUNT - 1]) : null,
      hasChildren: values[COL.HAS_CHILDREN - 1] === '예' ? 'yes' : 'no',
      childrenAges: String(values[COL.CHILDREN_AGES - 1] || ''),
      note: String(values[COL.NOTE - 1] || ''),
      submittedAt: toIsoString(values[COL.TIMESTAMP - 1]),
    },
  });
}

/** 성함이 같고 연락처 뒷자리가 같은 마지막(가장 최근) 행 번호. 없으면 -1 */
function findRowIndex(sheet, name, tail, digits) {
  const tailLength = Number(digits) > 0 ? Number(digits) : 4;
  const targetName = normalizeName(name);
  const targetTail = onlyDigits(tail).slice(-tailLength);

  if (!targetName || targetTail.length !== tailLength || sheet.getLastRow() < 2) {
    return -1;
  }

  const rowCount = sheet.getLastRow() - 1;
  const names = sheet.getRange(2, COL.NAME, rowCount, 1).getValues();
  const phones = sheet.getRange(2, COL.PHONE, rowCount, 1).getValues();

  for (let i = rowCount - 1; i >= 0; i--) {
    const rowName = normalizeName(names[i][0]);
    const rowTail = onlyDigits(phones[i][0]).slice(-tailLength);
    if (rowName && rowName === targetName && rowTail === targetTail) {
      return i + 2; // 헤더(1행) 보정
    }
  }

  return -1;
}

function buildRow(data) {
  return [
    new Date(),
    data.name || '',
    data.phone || '',
    data.email || '',
    data.attendance === 'attending' ? '참석' : '불참',
    data.guestCount || '',
    data.hasChildren === 'yes' ? '예' : '아니오',
    data.childrenAges || '',
    data.note || '',
    new Date(),
  ];
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    setupHeaders(sheet);
  } else if (sheet.getLastRow() === 0) {
    setupHeaders(sheet);
  }

  return sheet;
}

function normalizeName(value) {
  return String(value == null ? '' : value).replace(/\s+/g, '').toLowerCase();
}

function onlyDigits(value) {
  return String(value == null ? '' : value).replace(/[^0-9]/g, '');
}

function lastFourDigits(value) {
  return onlyDigits(value).slice(-4);
}

function toIsoString(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value ? String(value) : '';
}

// CORS 헤더를 포함한 응답 생성
function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupHeaders(sheet) {
  const headers = [
    '제출 시간',
    '성함',
    '연락처',
    '이메일',
    '참석 여부',
    '동행 인원',
    '아이 동반',
    '아이 나이',
    '특이사항',
    '최종 수정 시간'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // 헤더 스타일링
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f0f0f0');
  headerRange.setBorder(true, true, true, true, true, true);

  // 열 너비 자동 조정
  sheet.autoResizeColumns(1, headers.length);
}

// GET 요청 처리 (테스트용)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    message: 'Google Sheets Web App is running',
    method: 'Use POST to submit RSVP data'
  }))
  .setMimeType(ContentService.MimeType.JSON);
}
