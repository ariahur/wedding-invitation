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
 *   { action: 'submit', language, name, phone, email, attendance, guestCount, hasChildren, childrenAges, note }
 *     → 동일한 성함 + 연락처가 이미 있으면 해당 행을 갱신하고, 없으면 새 행을 추가합니다.
 *       email 이 비어 있지 않으면 그 주소로 탑승권 확인 메일을 보냅니다 (language 기준 ko/en).
 *   { action: 'lookup', name, phoneTail, digits }
 *     → 성함과 연락처 뒷자리가 일치하는 최신 신청 내역을 반환합니다.
 *       (한국어 화면은 뒤 4자리, 영어 화면은 호주 번호에 맞춰 뒤 3자리)
 *   { action: 'photo', name, phoneTail, message, batchId, tagNo, fileName, mimeType, data, index, total }
 *     → 게스트가 부친 사진 한 장을 Drive 폴더에 저장하고 PHOTOS 시트에 기록합니다.
 *       data는 base64 문자열이며, 사진은 한 장씩 순차로 전송됩니다.
 *
 * ※ 사진 접수를 쓰려면 Drive 권한 승인이 새로 필요합니다.
 *   코드를 붙여넣고 재배포한 뒤 권한 승인 창이 다시 뜨면 허용해주세요.
 *
 * ※ 확인 메일을 쓰려면 Gmail 전송 권한 승인도 새로 필요합니다. 재배포한 뒤 setupEmail() 을
 *   한 번 실행해 권한을 승인하고 남은 발송 할당량을 확인하세요.
 *   보내는 주소는 이 스크립트를 소유한 Google 계정입니다.
 *   일반 Gmail 계정은 하루 100통, Workspace 계정은 하루 1,500통까지 보낼 수 있습니다.
 *
 * ※ 예식 D-30 리마인드 메일을 쓰려면 setupReminder() 를 한 번 실행하세요.
 *   매일 도는 트리거가 만들어지고, 예식 30일 전이 되는 날부터 "참석" 으로 신청하고
 *   이메일을 남긴 게스트에게 한 통씩 보냅니다. 보낸 시각은 시트의 "리마인드 발송" 열에
 *   기록되며, 값이 있는 행은 다시 보내지 않습니다. (다시 보내려면 그 칸을 비우세요)
 */

// 시트 이름을 설정하세요 (기본값: 'RSVP')
const SHEET_NAME = 'RSVP';

// 게스트 사진 기록용 시트 이름
const PHOTO_SHEET_NAME = 'PHOTOS';

// 사진을 저장할 Drive 폴더 이름. 없으면 내 드라이브 루트에 자동으로 만들어집니다.
const PHOTO_FOLDER_NAME = '결혼식 게스트 사진';

// 특정 폴더에 저장하고 싶으면 폴더 ID를 넣으세요 (비워두면 위 이름으로 찾거나 새로 만듭니다)
const PHOTO_FOLDER_ID = '';

// 사진 한 장의 최대 크기 (디코딩 후 기준)
const PHOTO_MAX_BYTES = 12 * 1024 * 1024;

// ===== 확인 메일 =====

// 이메일을 남긴 게스트에게 탑승권 확인 메일을 보냅니다.
// false 로 바꾸면 시트 기록은 그대로 두고 발송만 끕니다.
const SEND_CONFIRMATION_EMAIL = true;

// 받는 사람에게 보이는 발신자 이름 (주소는 스크립트를 소유한 계정으로 고정된다)
const EMAIL_SENDER_NAME = '준용 ♥ 다영';

// 메일의 RSVP 버튼이 가리키는 청첩장 주소
const INVITATION_URL = 'https://wedding-invitation-sigma-ivory.vercel.app';

// 메일에 들어가는 이미지 주소.
// 메일 클라이언트는 첨부가 아닌 "웹에 올라와 있는 이미지"만 불러올 수 있으므로,
// 두 파일은 청첩장과 함께 배포되어야 한다 (저장소의 public/ 에 있다).
//   public/email-logo.jpg  →  상단 로고
//   public/email-map.jpg   →  하단 지도
// 배포 주소가 바뀌면 INVITATION_URL 만 고치면 둘 다 따라간다.
const EMAIL_LOGO_URL = INVITATION_URL + '/email-logo.jpg';

// 하단 지도 이미지. 청첩장 화면과 같게 한국어는 카카오맵, 영어는 구글맵(영문 표기)을 쓴다
// (src/sections/DirectionsSection.tsx 가 언어별로 띄우는 지도와 같은 것).
const EMAIL_MAP_URL = {
  ko: INVITATION_URL + '/email-map.jpg',
  en: INVITATION_URL + '/email-map-en.jpg',
};

// 지도를 눌렀을 때 열리는 지도 서비스. 위 이미지와 짝을 맞춘다
const MAP_LINK_URL = {
  ko: 'https://map.kakao.com/?q=' + encodeURIComponent('그랜드힐컨벤션'),
  en: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Grand Hill Convention Seoul'),
};

// 메일에 찍힐 예식 정보. src/data/translations.ts 의 hero / rsvp.ticket 값과 맞춰 둔다.
// date 는 큰 글씨(요일까지)와 시각을 따로 두어 예시 디자인처럼 두 줄로 보여준다.
const WEDDING_INFO = {
  flight: 'DA206',
  origin: 'SYD',
  destination: 'ICN',
  boarding: '15:00',
  gate: '1F',
  seatClass: 'GUEST',
  dateCode: '20 FEB 2027',
  ko: {
    couple: '조준용 ♥ 허다영',
    signature: '신랑 조준용 · 신부 허다영',
    dateLine: '2027년 2월 20일 토요일',
    timeLine: '오후 3시',
    venue: '그랜드힐컨벤션 1층 플로리아',
    address: '서울시 강남구 역삼로 607 (대치동)',
  },
  en: {
    couple: 'Daniel ♥ Aria',
    signature: 'Daniel · Aria',
    dateLine: 'Saturday, 20 February 2027',
    timeLine: '3:00 PM',
    venue: 'Grand Hill Convention, 1F Floria',
    address: '607 Yeoksam-ro, Gangnam-gu, Seoul',
  },
};

// ===== 리마인드 메일 =====

// 예식이 다가오면 "참석" 으로 신청한 게스트에게 리마인드 메일을 보냅니다.
// false 로 바꾸면 트리거가 돌아도 발송하지 않습니다.
const SEND_REMINDER_EMAIL = true;

// 예식 일시. 월은 0부터 센다 (1 = 2월). 리마인드 발송일 계산에만 쓴다.
const WEDDING_DATE = new Date(2027, 1, 20, 15, 0);

// 예식 며칠 전에 보낼지 (한 달 전 = 30)
const REMINDER_DAYS_BEFORE = 30;

// 매일 도는 트리거가 확인하는 시각 (0~23)
const REMINDER_TRIGGER_HOUR = 10;

// 테마 색 (THEME_COLORS.md 코어 팔레트)
const EMAIL_COLORS = {
  navy: '#1A2F4A',
  gold: '#C9A77C',
  ivory: '#FAF8F3',
  white: '#FFFFFF',
  beige: '#E6D8C3',
  label: '#9CA3AF',
  text: '#333333',
  subText: '#666666',
};

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
  LANGUAGE: 11,
  REMINDER_SENT: 12,
};

// buildRow() 가 한 번에 쓰는 열 수 (리마인드 발송 열은 리마인드 작업만 건드린다)
const COLUMN_COUNT = 11;

const HEADERS = [
  '제출 시간',
  '성함',
  '연락처',
  '이메일',
  '참석 여부',
  '동행 인원',
  '아이 동반',
  '아이 나이',
  '특이사항',
  '최종 수정 시간',
  '언어',
  '리마인드 발송',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'submit';

    if (action === 'lookup') {
      return handleLookup(data);
    }

    if (action === 'photo') {
      return handlePhoto(data);
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

  const updated = existingRowIndex > 0;

  if (updated) {
    // 최초 제출 시간은 유지하고 나머지 값만 갱신
    const originalTimestamp = sheet.getRange(existingRowIndex, COL.TIMESTAMP).getValue();
    row[COL.TIMESTAMP - 1] = originalTimestamp || row[COL.TIMESTAMP - 1];
    sheet.getRange(existingRowIndex, 1, 1, COLUMN_COUNT).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  const mailed = sendConfirmationEmail(data, updated);

  return createResponse({
    success: true,
    message: updated ? 'Data updated successfully' : 'Data added successfully',
    updated: updated,
    mailed: mailed,
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

/** 게스트가 부친 사진 한 장을 Drive에 저장하고 PHOTOS 시트에 기록한다 */
function handlePhoto(data) {
  const name = String(data.name || '').trim();
  const base64 = String(data.data || '');

  if (!name || !base64) {
    return createResponse({ success: false, error: 'Missing name or photo data' });
  }

  const bytes = Utilities.base64Decode(base64);
  if (bytes.length > PHOTO_MAX_BYTES) {
    return createResponse({ success: false, error: 'Photo is too large' });
  }

  const tagNo = String(data.tagNo || '');
  const index = Number(data.index) > 0 ? Number(data.index) : 1;
  const safeName = normalizeName(name) || 'guest';
  const originalName = String(data.fileName || 'photo.jpg');
  const extension = (originalName.match(/\.[^.]+$/) || ['.jpg'])[0];
  // 정렬하기 좋도록 접수 시각 + 성함 + 순번으로 파일명을 다시 짓는다
  const storedName =
    Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd-HHmmss') +
    '_' + safeName + '_' + index + extension;

  const blob = Utilities.newBlob(bytes, String(data.mimeType || 'image/jpeg'), storedName);
  const file = getPhotoFolder().createFile(blob);

  const sheet = getOrCreatePhotoSheet();
  sheet.appendRow([
    new Date(),
    name,
    String(data.phoneTail || ''),
    tagNo,
    String(data.batchId || ''),
    index + ' / ' + (Number(data.total) || 1),
    storedName,
    file.getUrl(),
    String(data.message || ''),
  ]);

  return createResponse({
    success: true,
    message: 'Photo saved successfully',
    data: { fileId: file.getId() },
  });
}

/** 사진을 저장할 Drive 폴더 (ID가 지정되어 있으면 그 폴더, 아니면 이름으로 찾거나 생성) */
function getPhotoFolder() {
  if (PHOTO_FOLDER_ID) {
    return DriveApp.getFolderById(PHOTO_FOLDER_ID);
  }

  const existing = DriveApp.getFoldersByName(PHOTO_FOLDER_NAME);
  if (existing.hasNext()) {
    return existing.next();
  }

  return DriveApp.createFolder(PHOTO_FOLDER_NAME);
}

function getOrCreatePhotoSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(PHOTO_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(PHOTO_SHEET_NAME);
    setupPhotoHeaders(sheet);
  } else if (sheet.getLastRow() === 0) {
    setupPhotoHeaders(sheet);
  }

  return sheet;
}

function setupPhotoHeaders(sheet) {
  const headers = [
    '접수 시간',
    '성함',
    '연락처 뒷자리',
    '태그 번호',
    '접수 묶음',
    '순번',
    '파일명',
    '파일 링크',
    '한마디'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f0f0f0');
  headerRange.setBorder(true, true, true, true, true, true);

  sheet.autoResizeColumns(1, headers.length);
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
    normalizeLanguage(data.language),
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
  } else {
    ensureExtraHeaders(sheet);
  }

  return sheet;
}

/** 나중에 추가된 열(언어 / 리마인드 발송)의 헤더를 기존 시트에 채워 넣는다 */
function ensureExtraHeaders(sheet) {
  if (sheet.getMaxColumns() < HEADERS.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), HEADERS.length - sheet.getMaxColumns());
  }

  const range = sheet.getRange(1, COL.LANGUAGE, 1, 2);
  const current = range.getValues()[0];
  if (current[0] && current[1]) {
    return;
  }

  range.setValues([[HEADERS[COL.LANGUAGE - 1], HEADERS[COL.REMINDER_SENT - 1]]]);
  range.setFontWeight('bold');
  range.setBackground('#f0f0f0');
  range.setBorder(true, true, true, true, true, true);
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
  const headers = HEADERS;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // 헤더 스타일링
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f0f0f0');
  headerRange.setBorder(true, true, true, true, true, true);

  // 열 너비 자동 조정
  sheet.autoResizeColumns(1, headers.length);
}

// ===================================================================
// 메일 문구
// ===================================================================

const EMAIL_TEXT = {
  ko: {
    subjectPrefix: '준용 & 다영',
    subjectIssued: '[{flight}] {origin} → {destination} 탑승권 발급 완료',
    subjectUpdated: '[{flight}] {origin} → {destination} 탑승권 변경 완료',
    subjectReminder: '[{flight}] 탑승 D-{days} · 우리의 특별한 날이 다가옵니다',
    subjectReminderToday: '[{flight}] 오늘, 우리의 특별한 날입니다',

    // 상단 로고 아래 한 줄
    route: '{origin} → {destination} · {flight}',
    logoAlt: 'DANIEL & ARIA AIR',

    greeting: '{name}님, 참석 여부를 알려주셔서 감사합니다.',
    leadIssued: '아래 내용으로 접수되었습니다.',
    leadUpdated: '아래 내용으로 수정되었습니다.',

    // 신청 내용 — 표가 아니라 한 줄씩 나열한다
    labelName: '성함',
    labelPhone: '연락처',
    labelEmail: '이메일',
    labelAttendance: '참석 여부',
    labelGuestCount: '동행 인원',
    labelChildren: '아이 동반',
    labelNote: '전달사항',

    valueAttending: '참석합니다',
    valueGuestCount: '{count}명 (본인 포함)',
    valueChildrenNo: '아니오',
    valueChildrenYes: '예',

    // 일시·장소 패널
    button: 'RSVP 확인하기',
    buttonNote: '누르면 모바일 청첩장이 열립니다.',

    // 맺음말
    signoffAttending: '오시는 길 조심히 오시고,\n게이트에서 반갑게 맞이하겠습니다.',

    editNote: '신청 내용은 청첩장의 “탑승권 신청”에서 언제든 다시 수정하실 수 있습니다.',
    footer: '이 메일은 발신 전용입니다.',
    mapAlt: '그랜드힐컨벤션 위치',
    mapCredit: '',

    // 리마인드 메일
    reminderGreeting: '{name}님, 우리의 특별한 날이 {daysPhrase} 앞으로 다가왔습니다.',
    reminderGreetingToday: '{name}님, 드디어 오늘 우리의 특별한 날입니다.',
    reminderLead: '참석 소식을 전해주신 덕분에 준비하는 내내 든든했습니다.\n예식 일정을 다시 한번 안내드립니다.',
    reminderDaysPhrase: '{days}일',
    reminderDaysPhraseOne: '하루',

    signoffReminder: '오시는 길 조심히 오시고,\n그날 반가운 얼굴로 뵙겠습니다.',
    reminderEditNote: '혹시 일정이 바뀌셨다면 청첩장의 “탑승권 신청”에서 수정해주세요.',
  },
  en: {
    subjectPrefix: 'Daniel & Aria',
    subjectIssued: '[{flight}] {origin} → {destination} boarding pass issued',
    subjectUpdated: '[{flight}] {origin} → {destination} boarding pass updated',
    subjectReminder: '[{flight}] D-{days} to boarding — our special day is almost here',
    subjectReminderToday: '[{flight}] Today is our special day',

    route: '{origin} → {destination} · {flight}',
    logoAlt: 'DANIEL & ARIA AIR',

    greeting: '{name}, thank you for letting us know.',
    leadIssued: 'We have received your RSVP as below.',
    leadUpdated: 'Your RSVP has been updated as below.',

    labelName: 'Full Name',
    labelPhone: 'Phone',
    labelEmail: 'Email',
    labelAttendance: 'Attendance',
    labelGuestCount: 'Number of Guests',
    labelChildren: 'Children',
    labelNote: 'Special Requests',

    valueAttending: 'I will attend',
    valueGuestCount: '{count} (including yourself)',
    valueChildrenNo: 'No',
    valueChildrenYes: 'Yes',

    button: 'View your RSVP',
    buttonNote: 'Opens the mobile invitation.',

    signoffAttending: 'Travel safe — we will be waiting\nto greet you at the gate.',

    editNote: 'You can update your RSVP anytime from the “RSVP” section of the invitation.',
    footer: 'This mailbox is not monitored.',
    mapAlt: 'Grand Hill Convention on the map',
    mapCredit: 'Map data © Google',

    reminderGreeting: '{name}, our special day is only {daysPhrase} away.',
    reminderGreetingToday: '{name}, our special day is finally here.',
    reminderLead: 'Knowing that you will be there has kept us going.\nHere are the details once more.',
    reminderDaysPhrase: '{days} days',
    reminderDaysPhraseOne: 'one day',

    signoffReminder: 'Travel safe —\nwe cannot wait to see your face on the day.',
    reminderEditNote: 'If your plans have changed, please update your RSVP in the invitation.',
  },
};

// ===================================================================
// 확인 메일 (신청 직후)
// ===================================================================

/**
 * "참석" 으로 신청하고 이메일을 남긴 게스트에게 확인 메일을 보낸다.
 * 불참으로 신청한 사람에게는 보내지 않는다.
 * 메일 발송이 실패해도 신청 자체는 성공으로 남겨야 하므로 예외를 삼키고 false 를 돌려준다.
 */
function sendConfirmationEmail(data, updated) {
  if (!SEND_CONFIRMATION_EMAIL) {
    return false;
  }

  // 참석자에게만 보낸다
  if (data.attendance !== 'attending') {
    return false;
  }

  const to = String(data.email || '').trim();
  if (!isValidEmail(to)) {
    return false;
  }

  const language = normalizeLanguage(data.language);
  const t = EMAIL_TEXT[language];

  const subjectTemplate = updated ? t.subjectUpdated : t.subjectIssued;

  const subject = withSubjectPrefix(fillTemplate(subjectTemplate, {
    flight: WEDDING_INFO.flight,
    origin: WEDDING_INFO.origin,
    destination: WEDDING_INFO.destination,
  }), language);

  return sendGuestEmail(to, subject, confirmationParts(data, updated, language), language, data.name);
}

/** 확인 메일의 문구 묶음 (참석자에게만 발송된다) */
function confirmationParts(data, updated, language) {
  const t = EMAIL_TEXT[language];
  const name = String(data.name || '').trim();

  return {
    greeting: fillTemplate(t.greeting, { name: name }),
    lead: updated ? t.leadUpdated : t.leadIssued,
    details: confirmationDetails(data, language),
    button: t.button,
    buttonNote: t.buttonNote,
    signoff: t.signoffAttending,
    editNote: t.editNote,
    footer: t.footer,
  };
}

/**
 * 폼에 작성된 내용을 [라벨, 값] 목록으로 정리한다.
 * 메일 본문(HTML)과 대체 텍스트가 같은 목록을 공유하며,
 * HTML 쪽은 이 목록을 표가 아니라 한 줄씩 나열해 보여준다.
 */
function confirmationDetails(data, language) {
  const t = EMAIL_TEXT[language];
  const rows = [];

  rows.push([t.labelName, String(data.name || '').trim()]);
  rows.push([t.labelPhone, String(data.phone || '').trim()]);
  rows.push([t.labelEmail, String(data.email || '').trim()]);
  rows.push([t.labelAttendance, t.valueAttending]);
  rows.push([
    t.labelGuestCount,
    fillTemplate(t.valueGuestCount, { count: Number(data.guestCount) || 1 }),
  ]);

  const ages = String(data.childrenAges || '').trim();
  if (data.hasChildren === 'yes') {
    rows.push([t.labelChildren, ages ? t.valueChildrenYes + ' · ' + ages : t.valueChildrenYes]);
  } else {
    rows.push([t.labelChildren, t.valueChildrenNo]);
  }

  const note = String(data.note || '').trim();
  if (note) {
    rows.push([t.labelNote, note]);
  }

  return rows;
}

// ===================================================================
// 리마인드 메일 (예식 D-30)
// ===================================================================

/**
 * "참석" 으로 신청하고 이메일을 남긴 게스트에게 리마인드 메일을 보낸다.
 * 이미 보낸 행(시트의 "리마인드 발송" 열에 시각이 찍힌 행)은 건너뛰므로
 * 여러 번 실행해도 같은 사람에게 두 번 가지 않는다.
 */
function sendReminderEmails() {
  const result = { sent: 0, skipped: 0, failed: 0 };

  if (!SEND_REMINDER_EMAIL) {
    Logger.log('리마인드 발송 스위치(SEND_REMINDER_EMAIL)가 꺼져 있습니다.');
    return result;
  }

  const sheet = getOrCreateSheet();
  const rowCount = sheet.getLastRow() - 1;
  if (rowCount < 1) {
    Logger.log('신청 내역이 없습니다.');
    return result;
  }

  const values = sheet.getRange(2, 1, rowCount, COL.REMINDER_SENT).getValues();
  const daysLeft = Math.max(daysUntilWedding(), 0);
  let quota = MailApp.getRemainingDailyQuota();

  for (let i = 0; i < rowCount; i++) {
    const row = values[i];

    // 참석자에게만, 아직 안 보낸 사람에게만
    if (row[COL.ATTENDANCE - 1] !== '참석' || row[COL.REMINDER_SENT - 1]) {
      result.skipped++;
      continue;
    }

    const guest = rowToGuest(row);
    if (!isValidEmail(guest.email)) {
      result.skipped++;
      continue;
    }

    if (quota <= 0) {
      Logger.log('오늘 발송 할당량을 다 썼습니다. 내일 트리거가 남은 사람부터 이어서 보냅니다.');
      break;
    }

    if (sendReminderEmail(guest, daysLeft)) {
      sheet.getRange(i + 2, COL.REMINDER_SENT).setValue(new Date());
      quota--;
      result.sent++;
    } else {
      result.failed++;
    }
  }

  Logger.log('리마인드 발송: ' + result.sent + '통 / 건너뜀 ' + result.skipped + ' / 실패 ' + result.failed);
  return result;
}

/** 리마인드 메일 한 통 */
function sendReminderEmail(guest, daysLeft) {
  const language = guest.language;
  const t = EMAIL_TEXT[language];

  const subject = withSubjectPrefix(fillTemplate(daysLeft > 0 ? t.subjectReminder : t.subjectReminderToday, {
    flight: WEDDING_INFO.flight,
    days: daysLeft,
  }), language);

  return sendGuestEmail(guest.email, subject, reminderParts(guest, daysLeft, language), language, guest.name);
}

/** 리마인드 메일의 문구 묶음 */
function reminderParts(guest, daysLeft, language) {
  const t = EMAIL_TEXT[language];
  const name = String(guest.name || '').trim();

  const daysPhrase = daysLeft === 1
    ? t.reminderDaysPhraseOne
    : fillTemplate(t.reminderDaysPhrase, { days: daysLeft });

  const greeting = daysLeft > 0
    ? fillTemplate(t.reminderGreeting, { name: name, daysPhrase: daysPhrase })
    : fillTemplate(t.reminderGreetingToday, { name: name });

  return {
    greeting: greeting,
    lead: t.reminderLead,
    details: reminderDetails(guest, language),
    button: t.button,
    buttonNote: t.buttonNote,
    signoff: t.signoffReminder,
    editNote: t.reminderEditNote,
    footer: t.footer,
  };
}

/**
 * 리마인드 메일에 다시 짚어줄 내용.
 * 일시 · 장소 · 주소는 바로 아래 패널에 크게 나오므로 여기서는 되풀이하지 않고,
 * 신청 때 적어주신 동행 인원만 확인차 한 줄 남긴다.
 */
function reminderDetails(guest, language) {
  const t = EMAIL_TEXT[language];
  const rows = [];

  const count = Number(guest.guestCount) || 0;
  if (count > 0) {
    rows.push([t.labelGuestCount, fillTemplate(t.valueGuestCount, { count: count })]);
  }

  return rows;
}

/** 시트 한 행을 메일 빌더가 쓰는 게스트 객체로 바꾼다 */
function rowToGuest(row) {
  return {
    name: String(row[COL.NAME - 1] || '').trim(),
    phone: String(row[COL.PHONE - 1] || '').trim(),
    email: String(row[COL.EMAIL - 1] || '').trim(),
    attendance: row[COL.ATTENDANCE - 1] === '참석' ? 'attending' : 'not_attending',
    guestCount: row[COL.GUEST_COUNT - 1],
    hasChildren: row[COL.HAS_CHILDREN - 1] === '예' ? 'yes' : 'no',
    childrenAges: String(row[COL.CHILDREN_AGES - 1] || '').trim(),
    note: String(row[COL.NOTE - 1] || '').trim(),
    language: guestLanguage(row),
  };
}

/**
 * 신청 언어. 언어 열이 생기기 전에 저장된 행은 성함에 한글이 있는지로 판단한다.
 */
function guestLanguage(row) {
  const saved = String(row[COL.LANGUAGE - 1] || '').trim().toLowerCase();
  if (saved === 'ko' || saved === 'en') {
    return saved;
  }
  return /[가-힣]/.test(String(row[COL.NAME - 1] || '')) ? 'ko' : 'en';
}

/** 오늘부터 예식일까지 남은 일수 (날짜 기준, 지난 뒤에는 음수) */
function daysUntilWedding() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const wedding = new Date(WEDDING_DATE.getFullYear(), WEDDING_DATE.getMonth(), WEDDING_DATE.getDate());
  return Math.round((wedding.getTime() - today.getTime()) / 86400000);
}

/**
 * 매일 도는 트리거가 부르는 함수.
 * 예식 D-{REMINDER_DAYS_BEFORE} 이 지나면 아직 못 받은 참석자에게 리마인드를 보낸다.
 * (트리거가 하루 걸러도 다음 날 이어서 보내도록 "그 날 하루만" 이 아니라 범위로 판단한다)
 */
function dailyReminderCheck() {
  const daysLeft = daysUntilWedding();

  if (daysLeft > REMINDER_DAYS_BEFORE) {
    Logger.log('아직 이릅니다. 예식까지 ' + daysLeft + '일 남았습니다.');
    return;
  }

  if (daysLeft < 0) {
    Logger.log('예식이 지났습니다. 리마인드를 보내지 않습니다.');
    return;
  }

  sendReminderEmails();
}

// ===================================================================
// 메일 공통 (레이아웃 · 유틸)
// ===================================================================

/**
 * 확인 메일과 리마인드 메일이 공유하는 발송부.
 * 메일이 실패해도 호출한 쪽 흐름은 막지 않도록 예외를 삼키고 false 를 돌려준다.
 */
function sendGuestEmail(to, subject, parts, language, name) {
  try {
    MailApp.sendEmail({
      to: to,
      name: EMAIL_SENDER_NAME,
      subject: subject,
      body: buildEmailText(parts, language),
      htmlBody: buildEmailHtml(parts, language),
    });
    return true;
  } catch (error) {
    Logger.log('메일 발송 실패 (' + String(name || '') + '): ' + error);
    return false;
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function normalizeLanguage(value) {
  return String(value || '').toLowerCase() === 'en' ? 'en' : 'ko';
}

/** '{key}' 자리를 values 의 값으로 바꾼다 */
function fillTemplate(template, values) {
  let result = String(template || '');
  for (const key in values) {
    result = result.split('{' + key + '}').join(String(values[key]));
  }
  return result;
}

/** 모든 메일 제목 앞에 신청 언어에 맞는 접두사를 붙인다 */
function withSubjectPrefix(subject, language) {
  return EMAIL_TEXT[language].subjectPrefix + ' ' + subject;
}

/** HTML을 못 읽는 클라이언트를 위한 대체 본문 */
function buildEmailText(parts, language) {
  const info = WEDDING_INFO[language];
  const lines = [];

  lines.push(parts.greeting);
  lines.push('');
  lines.push(parts.lead);
  lines.push('');

  for (let i = 0; i < parts.details.length; i++) {
    lines.push(parts.details[i][0] + ': ' + parts.details[i][1]);
  }
  lines.push('');

  lines.push(info.dateLine);
  lines.push(info.timeLine);
  lines.push(info.venue);
  lines.push(info.address);
  lines.push('');
  lines.push(parts.button + ': ' + INVITATION_URL);
  lines.push(MAP_LINK_URL[language]);
  lines.push('');
  lines.push(parts.signoff);
  lines.push(info.signature);
  lines.push('');
  lines.push(parts.editNote);
  lines.push(parts.footer);

  return lines.join('\n');
}

/**
 * 메일 HTML 본문.
 *
 * 레이아웃 (위 → 아래):
 *   로고 · 편명 → 인사와 헤드라인 → 신청 내용 산문 → 일시·장소 패널 + RSVP 버튼
 *   → 맺음말과 서명 → 지도 → 네이비 푸터
 *
 * 메일 클라이언트는 CSS를 거의 지원하지 않으므로 표 중첩 + 인라인 스타일로만 짠다.
 */
function buildEmailHtml(parts, language) {
  const t = EMAIL_TEXT[language];
  const info = WEDDING_INFO[language];

  const route = fillTemplate(t.route, {
    origin: WEDDING_INFO.origin,
    destination: WEDDING_INFO.destination,
    flight: WEDDING_INFO.flight,
  });

  let detailsHtml = '';
  for (let i = 0; i < parts.details.length; i++) {
    detailsHtml += emailDetailLine(parts.details[i][0], parts.details[i][1]);
  }

  return '' +
  '<!DOCTYPE html>' +
  '<html lang="' + language + '"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>' + escapeHtml(info.couple) + '</title></head>' +
  '<body style="margin:0;padding:0;background:' + EMAIL_COLORS.ivory + ';">' +

  // 받은편지함 미리보기 줄 (본문에서는 감춘다)
  '<div style="display:none;font-size:1px;color:' + EMAIL_COLORS.ivory + ';max-height:0;overflow:hidden;">' +
    escapeHtml(parts.lead) +
  '</div>' +

  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + EMAIL_COLORS.ivory + ';">' +
    '<tr><td align="center" style="padding:28px 12px 40px 12px;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:' + EMAIL_COLORS.white + ';border:1px solid ' + EMAIL_COLORS.beige + ';">' +

        // ── 레터헤드: 괘선 · 로고 · 괘선 · 편명
        '<tr><td style="padding:34px 28px 0 28px;">' +
          emailRule(EMAIL_COLORS.navy) +
        '</td></tr>' +
        '<tr><td align="center" style="padding:22px 28px;">' +
          '<img src="' + EMAIL_LOGO_URL + '" width="124" alt="' + escapeHtml(t.logoAlt) + '" ' +
            'style="display:block;width:124px;max-width:40%;height:auto;border:0;outline:none;text-decoration:none;">' +
        '</td></tr>' +
        '<tr><td style="padding:0 28px;">' +
          emailRule(EMAIL_COLORS.navy) +
        '</td></tr>' +
        '<tr><td align="center" style="padding:13px 28px 0 28px;font-family:Roboto,Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:' + EMAIL_COLORS.gold + ';">' +
          escapeHtml(route) +
        '</td></tr>' +

        // ── 인사 · 안내문
        '<tr><td align="center" style="padding:38px 32px 0 32px;font-family:Georgia,\'Times New Roman\',serif;font-size:21px;line-height:1.6;color:' + EMAIL_COLORS.navy + ';">' +
          nl2br(escapeHtml(parts.greeting)) +
        '</td></tr>' +
        '<tr><td align="center" style="padding:14px 32px 0 32px;font-size:14px;line-height:1.8;color:' + EMAIL_COLORS.subText + ';">' +
          nl2br(escapeHtml(parts.lead)) +
        '</td></tr>' +

        // 헤드라인과 본문을 가르는 짧은 골드 선
        '<tr><td align="center" style="padding:26px 32px;">' +
          '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="46"><tr>' +
            '<td height="2" style="height:2px;line-height:2px;font-size:0;background:' + EMAIL_COLORS.gold + ';">&nbsp;</td>' +
          '</tr></table>' +
        '</td></tr>' +

        // ── 신청 내용 (표 없이 한 줄씩)
        '<tr><td align="center" style="padding:0 34px;">' + detailsHtml + '</td></tr>' +

        // ── 일시 · 장소 패널 + RSVP 버튼
        '<tr><td style="padding:20px 20px 0 20px;">' +
          '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + EMAIL_COLORS.ivory + ';">' +
            '<tr><td align="center" style="padding:40px 24px;">' +
              '<div style="font-family:Georgia,\'Times New Roman\',serif;font-size:24px;line-height:1.4;color:' + EMAIL_COLORS.navy + ';">' +
                escapeHtml(info.dateLine) +
              '</div>' +
              '<div style="padding-top:14px;font-size:16px;line-height:1.6;color:' + EMAIL_COLORS.text + ';">' +
                escapeHtml(info.timeLine) +
              '</div>' +
              '<div style="padding-top:6px;font-size:14px;line-height:1.7;color:' + EMAIL_COLORS.subText + ';">' +
                escapeHtml(info.venue) +
              '</div>' +
              '<div style="padding-top:2px;font-size:13px;line-height:1.7;color:' + EMAIL_COLORS.label + ';">' +
                escapeHtml(info.address) +
              '</div>' +
              '<div style="padding-top:30px;">' +
                '<a href="' + INVITATION_URL + '" style="display:inline-block;padding:14px 34px;border:1px solid ' + EMAIL_COLORS.navy + ';background:' + EMAIL_COLORS.white + ';color:' + EMAIL_COLORS.navy + ';text-decoration:none;font-family:Roboto,Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">' +
                  escapeHtml(parts.button) +
                '</a>' +
              '</div>' +
              '<div style="padding-top:12px;font-size:12px;line-height:1.6;color:' + EMAIL_COLORS.label + ';">' +
                escapeHtml(parts.buttonNote) +
              '</div>' +
            '</td></tr>' +
          '</table>' +
        '</td></tr>' +

        // ── 맺음말 · 서명
        '<tr><td align="center" style="padding:34px 34px 0 34px;font-size:14px;line-height:1.9;color:' + EMAIL_COLORS.subText + ';">' +
          nl2br(escapeHtml(parts.signoff)) +
        '</td></tr>' +
        '<tr><td align="center" style="padding:18px 34px 34px 34px;font-family:Georgia,\'Times New Roman\',serif;font-size:15px;line-height:1.6;color:' + EMAIL_COLORS.navy + ';">' +
          escapeHtml(info.signature) +
        '</td></tr>' +

        // ── 지도 (누르면 지도 서비스가 열린다)
        '<tr><td style="font-size:0;line-height:0;">' +
          '<a href="' + MAP_LINK_URL[language] + '" style="display:block;text-decoration:none;">' +
            '<img src="' + EMAIL_MAP_URL[language] + '" width="560" alt="' + escapeHtml(t.mapAlt) + '" ' +
              'style="display:block;width:100%;max-width:560px;height:auto;border:0;outline:none;text-decoration:none;">' +
          '</a>' +
        '</td></tr>' +

        // 지도 그림에 저작권 표기가 없는 언어만 한 줄 덧붙인다
        (t.mapCredit
          ? '<tr><td align="right" style="padding:6px 12px 0 12px;font-size:10px;line-height:1.4;color:' + EMAIL_COLORS.label + ';">' +
              escapeHtml(t.mapCredit) +
            '</td></tr>'
          : '') +

        // ── 푸터 (티켓 헤더와 같은 네이비 + 골드 밑단을 위로 뒤집은 모양)
        '<tr><td height="4" style="height:4px;line-height:4px;font-size:0;background:' + EMAIL_COLORS.gold + ';">&nbsp;</td></tr>' +
        '<tr><td align="center" style="background:' + EMAIL_COLORS.navy + ';padding:24px 28px;">' +
          '<div style="font-family:Roboto,Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:' + EMAIL_COLORS.gold + ';">' +
            escapeHtml(route) +
          '</div>' +
          '<div style="padding-top:12px;font-size:12px;line-height:1.8;color:' + EMAIL_COLORS.beige + ';">' +
            escapeHtml(parts.editNote) + '<br>' + escapeHtml(parts.footer) +
          '</div>' +
        '</td></tr>' +

      '</table>' +
    '</td></tr>' +
  '</table>' +
  '</body></html>';
}

/**
 * 신청 내용 한 줄. 라벨은 작은 회색 대문자, 값은 본문색으로 같은 줄에 잇는다.
 * 칸을 나누거나 선을 긋지 않아 표처럼 보이지 않는다.
 */
function emailDetailLine(label, value) {
  return '<div style="padding-bottom:11px;font-size:15px;line-height:1.7;">' +
    '<span style="font-family:Roboto,Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:' + EMAIL_COLORS.label + ';">' +
      escapeHtml(label) +
    '</span>' +
    '<span style="color:' + EMAIL_COLORS.text + ';">&nbsp;&nbsp;' + nl2br(escapeHtml(value)) + '</span>' +
  '</div>';
}

/** 레터헤드를 위아래로 감싸는 1px 괘선 */
function emailRule(color) {
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td height="1" style="height:1px;line-height:1px;font-size:0;background:' + color + ';">&nbsp;</td>' +
  '</tr></table>';
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nl2br(value) {
  return String(value == null ? '' : value).replace(/\n/g, '<br>');
}

// ===================================================================
// 메일 설정 · 테스트 (Apps Script 편집기에서 직접 실행)
// ===================================================================

/**
 * 확인 메일을 처음 설정할 때 Apps Script 편집기에서 한 번 실행하세요.
 * Gmail 전송 권한 승인 창을 띄우고, 오늘 남은 발송 가능 통수를 로그에 찍습니다.
 */
function setupEmail() {
  Logger.log('보내는 주소: ' + Session.getEffectiveUser().getEmail());
  Logger.log('오늘 남은 발송 가능 통수: ' + MailApp.getRemainingDailyQuota());
  Logger.log('발송 스위치(SEND_CONFIRMATION_EMAIL): ' + SEND_CONFIRMATION_EMAIL);
}

/**
 * 리마인드 메일을 예약할 때 Apps Script 편집기에서 한 번 실행하세요.
 * 매일 도는 트리거를 만들고(이미 있으면 다시 만듭니다) 발송 예정일을 로그에 찍습니다.
 * 트리거는 예식 D-{REMINDER_DAYS_BEFORE} 이 되는 날부터 참석자에게 한 통씩 보냅니다.
 */
function setupReminder() {
  getOrCreateSheet(); // "언어" / "리마인드 발송" 열 헤더를 채워 둔다

  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'dailyReminderCheck') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger('dailyReminderCheck')
    .timeBased()
    .everyDays(1)
    .atHour(REMINDER_TRIGGER_HOUR)
    .create();

  const sendDate = new Date(WEDDING_DATE.getTime() - REMINDER_DAYS_BEFORE * 86400000);
  const zone = Session.getScriptTimeZone();

  Logger.log('매일 ' + REMINDER_TRIGGER_HOUR + '시경 확인하는 트리거를 만들었습니다.');
  Logger.log('리마인드 발송 예정일: ' + Utilities.formatDate(sendDate, zone, 'yyyy-MM-dd') +
    ' (예식 ' + Utilities.formatDate(WEDDING_DATE, zone, 'yyyy-MM-dd') + ' 기준 D-' + REMINDER_DAYS_BEFORE + ')');
  Logger.log('오늘 기준 예식까지: ' + daysUntilWedding() + '일');
  Logger.log('발송 스위치(SEND_REMINDER_EMAIL): ' + SEND_REMINDER_EMAIL);
}

/**
 * 확인 메일 미리보기 — 실행하면 스크립트 소유자 주소로 샘플 두 통(발급 / 변경)이 발송됩니다.
 * 불참 신청에는 확인 메일이 나가지 않으므로 참석 샘플만 보냅니다.
 */
function sendTestConfirmationEmail() {
  const to = Session.getEffectiveUser().getEmail();

  const sample = {
    language: 'ko',
    name: '홍길동',
    phone: '010-1234-5678',
    email: to,
    attendance: 'attending',
    guestCount: 2,
    hasChildren: 'yes',
    childrenAges: '5세, 7세',
    note: '축하드려요! 그날 꼭 갈게요.',
  };

  sendConfirmationEmail(sample, false);
  sendConfirmationEmail(sample, true);

  Logger.log('테스트 메일 2통을 ' + to + ' 로 보냈습니다.');
}

/**
 * 리마인드 메일 미리보기 — 실행하면 스크립트 소유자 주소로 샘플 한 통이 발송됩니다.
 * 시트는 건드리지 않으므로 실제 게스트에게는 가지 않습니다.
 */
function sendTestReminderEmail() {
  const to = Session.getEffectiveUser().getEmail();

  sendReminderEmail({
    name: '홍길동',
    email: to,
    attendance: 'attending',
    guestCount: 2,
    language: 'ko',
  }, REMINDER_DAYS_BEFORE);

  Logger.log('리마인드 테스트 메일을 ' + to + ' 로 보냈습니다.');
}


// GET 요청 처리 (테스트용)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    message: 'Google Sheets Web App is running',
    method: 'Use POST to submit RSVP data'
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 사진 접수를 처음 설정할 때 Apps Script 편집기에서 한 번 실행하세요.
 * Drive 권한 승인 창을 띄우고, 사진 폴더와 PHOTOS 시트를 미리 만들어 둡니다.
 * 실행 로그에 폴더 URL이 찍히니 그 폴더를 즐겨찾기 해두면 편합니다.
 */
function setupPhotoDrop() {
  const folder = getPhotoFolder();
  getOrCreatePhotoSheet();

  Logger.log('사진 폴더: ' + folder.getName());
  Logger.log('폴더 URL: ' + folder.getUrl());
  Logger.log('폴더 ID: ' + folder.getId());
  Logger.log('PHOTOS 시트 준비 완료');
}
