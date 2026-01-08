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
 */

// 시트 이름을 설정하세요 (기본값: 'RSVP')
const SHEET_NAME = 'RSVP';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    // 시트가 없으면 생성
    if (!sheet) {
      const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
      setupHeaders(newSheet);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Sheet created' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      setupHeaders(sheet);
    }
    
    // 요청 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 타임스탬프 추가
    const timestamp = new Date();
    
    // 데이터 행 추가
    const row = [
      timestamp,
      data.name || '',
      data.phone || '',
      data.email || '',
      data.attendance === 'attending' ? '참석' : '불참',
      data.guestCount || '',
      data.hasChildren === 'yes' ? '예' : '아니오',
      data.childrenAges || '',
      data.note || ''
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: 'Data added successfully' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
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
    '특이사항'
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

