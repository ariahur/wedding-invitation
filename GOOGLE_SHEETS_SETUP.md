# Google Sheets 연동 설정 가이드

RSVP 폼 제출 시 **Google Sheets에만** 데이터가 저장됩니다. 아래 설정이 없으면 RSVP 제출이 동작하지 않습니다.

## 1. Google Sheets 준비

1. [Google Sheets](https://sheets.google.com)에 접속하여 새 스프레드시트를 만듭니다.
2. 스프레드시트 이름을 원하는 이름으로 변경합니다 (예: "결혼식 RSVP")

## 2. Google Apps Script 설정

1. Google Sheets에서 **확장 프로그램** > **Apps Script**를 클릭합니다.
2. `google-apps-script.js` 파일의 내용을 복사하여 Apps Script 편집기에 붙여넣습니다.
3. 상단의 **저장** 아이콘을 클릭하여 저장합니다.
4. 프로젝트 이름을 설정합니다 (예: "RSVP to Sheets").

## 3. 웹 앱 배포

1. Apps Script 편집기에서 **배포** > **새 배포**를 클릭합니다.
2. **유형 선택** 옆의 톱니바퀴 아이콘을 클릭하고 **웹 앱**을 선택합니다.
3. 다음 설정을 입력합니다:
   - **설명**: "RSVP Form to Google Sheets" (선택사항)
   - **다음 사용자로 실행**: **나**
   - **액세스 권한**: **모든 사용자**
4. **배포** 버튼을 클릭합니다.
5. 권한 승인 창이 나타나면:
   - **권한 확인**을 클릭합니다.
   - Google 계정을 선택합니다.
   - **고급** > **[프로젝트 이름](안전하지 않을 수 있음)로 이동**을 클릭합니다.
   - **허용**을 클릭합니다.
6. 배포가 완료되면 **웹 앱 URL**이 표시됩니다. 이 URL을 복사합니다.

## 4. 환경 변수 설정

1. 프로젝트 루트 디렉토리에 `.env` 파일을 만듭니다 (이미 있다면 수정).
2. 다음 내용을 추가합니다:

```env
REACT_APP_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

`YOUR_SCRIPT_ID` 부분을 위에서 복사한 웹 앱 URL로 교체합니다.

## 5. 앱 재시작

환경 변수를 추가한 후 개발 서버를 재시작합니다:

```bash
npm start
```

## 테스트

1. RSVP 폼을 작성하고 제출합니다.
2. Google Sheets를 새로고침하여 데이터가 추가되었는지 확인합니다.

## 사진·영상 수하물 접수(BAGGAGE DROP) 설정

게스트가 결혼식날 찍은 사진과 영상을 부치는 기능입니다. 파일은 **네이버 MYBOX**에 저장되고, 접수 기록만 이 스프레드시트의 `PHOTOS` 시트에 남습니다.

경로는 두 갈래입니다.

| 단계 | 담당 | 이유 |
| --- | --- | --- |
| 파일 업로드 | Vercel 서버리스 함수 `api/photo.js` → MYBOX Open API | MYBOX 저장소는 브라우저 직접 업로드를 403으로 막고, Apps Script는 요청마다 2~3초가 걸려 느림 (함수는 1MB 사진 기준 약 1초) |
| 접수 기록 | Apps Script `action: 'photoLog'` (한 접수당 1회) | RSVP와 같은 시트에 남기기 위함 |

### 1. MYBOX 개인 액세스 토큰 발급

1. [MYBOX Open API](https://developers.mybox.naver.com/) 에서 개인 액세스 토큰(`mbx_pat_...`)을 발급합니다.
2. 이 토큰은 **내 MYBOX 전체를 읽고 쓸 수 있는 비밀값**입니다. 코드·문서·저장소에 적지 마세요.
   `.env`에는 넣어도 됩니다 — `REACT_APP_` 접두사가 없어 번들에 들어가지 않고, `.env`는 git에 올라가지 않습니다.

### 2. Vercel 환경 변수 등록

Vercel 대시보드 > 프로젝트 > **Settings > Environment Variables** 에 추가하고 **재배포**합니다.

| 이름 | 값 | 필수 |
| --- | --- | --- |
| `MYBOX_PAT` | 발급한 토큰 | 필수 |
| `MYBOX_FOLDER_ID` | 저장 폴더의 resourceId | 선택. 비우면 루트에서 `MYBOX_FOLDER_NAME` 폴더를 찾거나 새로 만듭니다 |
| `MYBOX_FOLDER_NAME` | 폴더 이름 | 선택. 기본값 `결혼식 게스트 사진` |

함수는 서울 리전(`icn1`)에서 실행되도록 `vercel.json`에 지정되어 있습니다.

### 3. Apps Script 재배포와 시트 준비

1. `google-apps-script.js` 전체를 복사해 Apps Script 편집기에 다시 붙여넣고 저장합니다.
2. **배포 > 배포 관리 > (연필 아이콘) > 버전: 새 버전 > 배포**를 클릭합니다.
   - 새 배포가 아니라 **기존 배포의 새 버전**으로 올려야 웹 앱 URL이 그대로 유지됩니다.
3. 함수 목록에서 **`setupPhotoDrop`**을 실행해 `PHOTOS` 시트를 만들어 둡니다.

Apps Script에는 MYBOX 토큰이 필요 없습니다. 예전에 스크립트 속성 `MYBOX_PAT`를 넣어 두었다면 지워도 됩니다.

### 4. 로컬에서 테스트하기

`npm start`만으로는 `/api/photo`가 없어서 업로드가 실패합니다. Vercel CLI 없이 함수만 따로 띄우는 스크립트를 쓰세요.

```bash
# .env 에 한 줄 추가 (git에 올라가지 않음)
MYBOX_PAT=mbx_pat_...

# 터미널 A: 함수를 http://localhost:3001/api/photo 로 띄움
npm run photo-api

# 터미널 B: 프론트가 그 주소로 올리도록 지정
REACT_APP_PHOTO_UPLOAD_URL=http://localhost:3001/api/photo npm start
```

`REACT_APP_PHOTO_UPLOAD_URL`을 비우면 같은 도메인의 `/api/photo`를 씁니다 (배포 기본값). `.env`에 적어 두면 배포 빌드에도 딸려가니 실행할 때만 붙이세요.

### 5. (선택) 저장 폴더 지정

기본값은 MYBOX 루트에 `결혼식 게스트 사진` 폴더를 만들어 쓰는 것입니다. 다른 폴더를 쓰려면 위 환경 변수 `MYBOX_FOLDER_ID` 또는 `MYBOX_FOLDER_NAME`을 바꾸고 재배포합니다.

### 6. 접수 기간

카운터는 예식 당일에 자동으로 열리고 2주 뒤 닫힙니다. 기간은 `src/utils/photoDropSchedule.ts`에서 관리합니다.

```ts
export const COUNTER_OPENS_AT = new Date('2027-02-20T00:00:00+09:00');
export const COUNTER_CLOSES_AT = new Date('2027-03-06T23:59:59+09:00');
```

### 7. 미리 확인하기 (선택)

날짜와 무관하게 각 상태를 미리 보려면 실행할 때만 환경 변수를 붙입니다. `.env`에 넣으면 배포에도 딸려가니 주의하세요.

```bash
REACT_APP_PHOTO_DROP_STATUS=open npm start
```

| 값 | 화면 |
| --- | --- |
| `closed` | 카운터 오픈 예정 + D-day |
| `open` | 사진·영상 접수 폼 |
| `archived` | 접수 마감 안내 |

값을 지우면 실제 날짜 기준으로 자동 판정됩니다.

> `.env`에 적을 때는 주석을 값 뒤에 붙이지 마세요. react-scripts 5가 쓰는 dotenv 10은 인라인 `#` 주석을 걷어내지 않아서 `open  # 설명`이 값 전체로 들어갑니다. 주석은 윗줄에 따로 적어주세요. (`.env`를 고친 뒤에는 개발 서버를 재시작해야 반영됩니다.)

### 저장되는 내용

- **MYBOX 폴더**: `20270220-153042_홍길동_1_a3f9.jpg` / `20270220-153042_홍길동_2_c07e.mp4` 형식(접수 시각_성함_순번_난수)으로 저장되어 접수 시각 순으로 정렬됩니다. 끝의 난수는 동시에 올라오는 파일의 이름이 겹치지 않게 하는 용도입니다.
- **PHOTOS 시트**: 접수 시간 / 성함 / 연락처 뒷자리 / 태그 번호 / 접수 묶음 / 순번 / 파일명 / MYBOX 파일 ID / 한마디

파일은 공개되지 않고 신랑신부의 MYBOX에서만 볼 수 있습니다. 청첩장 화면에는 접수 결과(수하물 태그)만 표시됩니다.

### 전송 방식과 용량

- 사진은 업로드 전에 긴 변 2048px / JPEG 품질 82%로 줄여서 보냅니다. 원본 20MB를 넘는 사진은 선택 단계에서 제외됩니다.
- 영상은 줄이지 않고 원본 그대로 보냅니다. 한 편 200MB까지 받습니다 (`api/photo.js`의 `VIDEO_MAX_BYTES`).
- 파일은 4MB 조각으로 잘라 바이너리 그대로 함수에 보내고(Vercel 요청 본문 한도 4.5MB), 함수가 MYBOX의 이어올리기(resume) API로 이어 붙입니다.
  영상 썸네일에는 전송 진행률(%)이 표시됩니다.
- 한 번에 최대 30개까지 고를 수 있고(`MAX_PHOTOS`), 4개씩 동시에 보냅니다(`UPLOAD_CONCURRENCY`). 둘 다 `src/sections/PhotoDropSection.tsx` 상단 상수입니다.
- 파일이 모두 올라간 뒤 Apps Script에 `photoLog` 한 번으로 기록합니다. 기록이 실패해도 파일은 이미 MYBOX에 있으므로 게스트에게는 성공으로 보이고, 오류는 브라우저 콘솔에만 남습니다.

## 확인 메일 · 리마인드 메일 설정

**참석**으로 신청하고 이메일을 남긴 게스트에게 **신청 직후 확인 메일**을, 예식 **30일 전에 리마인드 메일**을 보냅니다.
불참으로 신청한 분에게는 메일이 나가지 않습니다.
보내는 주소는 이 스크립트를 소유한 Google 계정이며(표시 이름만 `EMAIL_SENDER_NAME` 으로 바꿀 수 있습니다),
일반 Gmail 계정은 하루 100통, Workspace 계정은 하루 1,500통까지 보낼 수 있습니다.

### 1. 청첩장 먼저 배포 (메일 이미지)

메일 상단 로고와 하단 지도는 **첨부가 아니라 웹에 올라와 있는 이미지**를 불러옵니다.
두 파일은 저장소의 `public/` 에 있으므로, 청첩장을 배포하면 함께 올라갑니다.

| 파일 | 메일에서 쓰이는 곳 |
|---|---|
| `public/email-logo.png` | 상단 로고 (원 바깥 여백은 투명 — 다크모드에서 흰 네모로 뜨지 않게) |
| `public/email-map.jpg` | 한국어 메일의 하단 지도 (카카오맵, 누르면 카카오맵이 열립니다) |
| `public/email-map-en.jpg` | 영어 메일의 하단 지도 (영문 라벨만 얹어 직접 그린 지도, 누르면 구글맵이 열립니다) |

영어 지도는 `npm run email-map` 으로 다시 만들 수 있습니다 (`scripts/render-email-map-en.mjs`, OpenStreetMap 데이터 사용).
구글·카카오 지도는 영문 모드에서도 상호가 한국어로 남아서 캡처 대신 직접 그립니다.

배포한 뒤 `<청첩장 주소>/email-logo.png` 가 브라우저에서 열리는지 확인하세요.
열리지 않으면 메일에서 로고 자리가 빈칸으로 나옵니다.
배포 주소가 바뀌면 `INVITATION_URL` 만 고치면 로고 · 지도 · RSVP 버튼이 모두 따라갑니다.

### 2. 스크립트 재배포

`google-apps-script.js` 전체를 편집기에 붙여넣고 **배포 관리 > 새 버전**으로 다시 배포합니다.

### 3. Gmail 권한 승인

1. 함수 선택 목록에서 **`setupEmail`** 을 고르고 **실행** 을 클릭합니다.
2. 권한 승인 창이 뜨면 허용합니다 (Gmail 발송 권한).
3. 실행 로그에 보내는 주소와 오늘 남은 발송 통수가 찍히면 준비 완료입니다.

`sendTestConfirmationEmail` 을 실행하면 **국문·영문 × 발급·변경** 샘플 네 통이 내 주소로 옵니다.

### 4. 리마인드 예약

1. 함수 선택 목록에서 **`setupReminder`** 를 고르고 **실행** 을 클릭합니다.
2. 매일 한 번 도는 트리거가 만들어지고, 실행 로그에 발송 예정일이 찍힙니다.
3. `sendTestReminderEmail` 을 실행하면 **국문·영문** 샘플 두 통이 내 주소로 옵니다 (시트는 건드리지 않습니다).
4. 확인 메일과 리마인드 메일을 한 번에 보려면 `sendAllTestEmails` 를 실행합니다 (총 6통).

예식 30일 전에, **참석**으로 신청하고 이메일을 남긴 게스트에게 한 통씩 나갑니다.
리마인드는 이 한 번이 마지막입니다 — 트리거가 그날 하루 걸렀을 때만 `REMINDER_GRACE_DAYS`(기본 2일) 동안 이어서 보내고,
D-28 이 지나면 그 뒤에 새로 신청한 사람에게도, D-1 · 예식 당일에도 보내지 않습니다.
보낸 시각은 RSVP 시트의 **리마인드 발송** 열에 기록되고, 값이 있는 행은 다시 보내지 않습니다.
(발송 창 안에서 다시 보내고 싶으면 그 칸을 비우고 `sendReminderEmails` 를 실행하세요. 창이 지난 뒤에도 굳이 보내야 한다면 `sendReminderEmails` 를 직접 실행하면 됩니다 — 트리거는 더 보내지 않습니다.)

### 5. 설정값

`google-apps-script.js` 상단에서 바꿀 수 있습니다.

| 상수 | 뜻 |
|---|---|
| `SEND_CONFIRMATION_EMAIL` | 확인 메일 발송 on/off |
| `SEND_REMINDER_EMAIL` | 리마인드 메일 발송 on/off |
| `WEDDING_DATE` | 예식 일시 (월은 0부터 — `1` 이 2월). 리마인드 날짜 계산용 |
| `REMINDER_DAYS_BEFORE` | 예식 며칠 전에 보낼지 (기본 30) |
| `REMINDER_GRACE_DAYS` | 트리거가 발송일을 걸렀을 때 이어서 보낼 기간 (기본 2일 → D-30 ~ D-28 까지만 발송) |
| `REMINDER_TRIGGER_HOUR` | 트리거가 확인하는 시각 (기본 10시) |
| `EMAIL_SENDER_NAME` | 받는 사람에게 보이는 발신자 이름 |
| `INVITATION_URL` | RSVP 버튼이 가리키는 청첩장 주소. 로고 · 지도 이미지 주소의 기준이기도 합니다 |
| `EMAIL_LOGO_URL` | 상단 로고 이미지 주소 (`INVITATION_URL` 에서 자동으로 만들어집니다) |
| `EMAIL_MAP_URL` | 하단 지도 이미지 주소 (`ko` 카카오맵 / `en` 구글맵) |
| `MAP_LINK_URL` | 지도를 눌렀을 때 열리는 주소 (한국어 카카오맵 / 영어 구글맵) |
| `WEDDING_INFO` | 메일에 찍히는 예식 정보. `dateLine`(날짜) 과 `timeLine`(시각) 이 나뉘어 두 줄로 크게 보입니다 |

메일 문구는 `EMAIL_TEXT` 의 `ko` / `en` 에 모여 있습니다. 게스트가 신청한 화면 언어로 보냅니다.
신청 내용은 `confirmationDetails()` 가 만든 [라벨, 값] 목록으로 나가며,
표를 그리지 않고 `emailDetailLine()` 이 한 줄씩 나열합니다. 라벨 문구는 `EMAIL_TEXT` 의 `label...` 항목에 있습니다.

메일 폰트는 `EMAIL_FONT` 에 있습니다. 청첩장 본문과 같은 Gowun Dodum(둥근 고딕)을 헤드라인·본문에 쓰고,
Gmail 처럼 웹폰트를 내려받지 않는 클라이언트는 각 OS 의 둥근 고딕(Apple SD Gothic Neo · Malgun Gothic · Noto Sans KR)으로 대신 그립니다.
편명 · RSVP 버튼 · 푸터의 Roboto(`EMAIL_FONT_TICKET`)는 티켓 기계 인쇄체 은유라 그대로 둡니다.
받는 사람 기기가 다크모드여도 Apple Mail · iOS Mail 은 `color-scheme: light` 메타를 따라 밝게 보이고,
Outlook 은 `[data-ogsc]` / `[data-ogsb]` 규칙으로 원래 색을 되살립니다 (`emailDarkModeCss()`).
**Gmail 앱(iOS · Android)은 메타를 무시하고 색을 직접 뒤집으며, 이를 막는 검증된 방법이 없습니다.**
그라데이션 배경 · `background-clip: text` 우회는 iOS 에서만 통하고 Android 에서는 글자가 반투명하게 깨졌습니다 (2026년 9월 실측).
그래서 Gmail 은 막지 않고 대신 **글자색을 검정(`EMAIL_COLORS.ink`) 하나로** 두어, 라이트에서는 검정 · 다크에서는 흰색으로 또렷하게 보이게 합니다.
네이비 · 회색 같은 중간 밝기 글자는 뒤집힌 뒤 흐려지므로 쓰지 않고, 위계는 글자 크기로 냅니다. 편명의 골드와 푸터의 베이지만 예외입니다.
로고는 원 바깥 여백이 투명한 PNG 라 어두운 카드 위에서도 흰 네모로 뜨지 않습니다.
글자색 요소에는 `c-<색 키>`, 배경 요소에는 `b-<색 키>` 클래스가 붙어 있으니 문구를 추가할 때 같은 방식으로 붙이세요.

## 문제 해결

### 사진·영상이 저장되지 않는 경우

브라우저 콘솔의 "Error uploading photo" 메시지에 함수가 돌려준 원인이 그대로 찍힙니다.

1. **`MYBOX_PAT is not configured`**: Vercel 환경 변수가 없거나, 추가한 뒤 재배포하지 않은 것입니다. 로컬이면 `.env`에 `MYBOX_PAT`가 있는지, `npm run photo-api`가 떠 있는지 확인합니다.
2. **`MYBOX upload URL failed (401)`**: 토큰이 잘못됐거나 만료된 것입니다. 재발급해서 환경 변수를 바꿉니다.
3. **`MYBOX upload URL failed (404)`**: `MYBOX_FOLDER_ID`가 가리키는 폴더가 없습니다. 값을 비우거나 올바른 ID로 바꿉니다.
4. **`PLAT-507`**: MYBOX 용량이 가득 찼습니다.
5. **로컬에서 404 / HTML 응답**: `npm start`만 띄우면 `/api/photo`가 없습니다. 4절대로 함수를 따로 띄우고 `REACT_APP_PHOTO_UPLOAD_URL`을 지정합니다.
6. **파일은 올라갔는데 시트에 없음**: Apps Script를 새 버전으로 재배포했는지 확인합니다. 예전 버전은 `photoLog` 액션을 모릅니다.
7. **아이폰 HEIC 사진**: 사진첩에서 고르면 대부분 JPEG로 변환되어 올라갑니다. 변환되지 않은 원본은 브라우저가 디코딩하지 못해 압축 없이 그대로 전송되며, 20MB를 넘으면 제외됩니다.
8. **영상이 중간에 끊긴 경우**: 그 파일만 실패로 표시되고, 다시 부치면 처음부터 새 파일로 올라갑니다. MYBOX에 미완성 파일은 남지 않습니다.

### 메일이 오지 않는 경우

1. **Gmail 권한 확인**: 편집기에서 `setupEmail` 을 실행해 권한 승인이 끝났는지 확인합니다.
2. **할당량 확인**: `setupEmail` 로그의 "오늘 남은 발송 가능 통수" 가 0이면 다음 날 이어서 나갑니다.
3. **스팸함 확인**: 첫 발송은 스팸으로 분류되는 경우가 있습니다.
4. **리마인드**: RSVP 시트의 "리마인드 발송" 열에 이미 시각이 찍힌 행은 다시 보내지 않습니다.

메일 발송이 실패해도 신청 자체는 정상 저장됩니다. 실패 내역은 Apps Script 실행 로그에 남습니다.

### 데이터가 추가되지 않는 경우

1. **웹 앱 URL 확인**: `.env` 파일의 URL이 올바른지 확인합니다.
2. **권한 확인**: Apps Script에서 웹 앱이 "모든 사용자"로 배포되었는지 확인합니다.
3. **시트 이름 확인**: Apps Script 코드의 `SHEET_NAME` 변수가 실제 시트 이름과 일치하는지 확인합니다.
4. **브라우저 콘솔 확인**: 개발자 도구의 콘솔에서 오류 메시지를 확인합니다.

### CORS 오류가 발생하는 경우

Google Apps Script 웹 앱은 CORS를 지원하므로 일반적으로 문제가 없습니다. 만약 오류가 발생한다면:
- 웹 앱이 올바르게 배포되었는지 확인합니다.
- "모든 사용자" 권한으로 배포되었는지 확인합니다.

## 참고사항

- RSVP 데이터는 Google Sheets만 사용합니다. `REACT_APP_GOOGLE_SHEETS_WEB_APP_URL`이 설정되지 않으면 제출 시 오류가 표시됩니다.
- Vercel 등에 배포할 때도 동일한 환경 변수를 설정해야 합니다.

