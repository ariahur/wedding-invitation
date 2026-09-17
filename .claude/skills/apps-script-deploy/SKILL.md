---
name: apps-script-deploy
description: google-apps-script.js(RSVP 저장·조회·사진 접수 기록·확인 메일·리마인드 메일)를 수정한 뒤 실제로 반영되기까지의 절차. 이 파일은 자동 배포되지 않으므로 코드를 고친 것만으로는 아무것도 바뀌지 않는다. "확인 메일 문구/색/폰트 바꿔줘", "리마인드 메일", "RSVP 시트 컬럼", "Apps Script", "GAS", "웹 앱 URL", "메일이 안 와요", "배포했는데 그대로예요" 처럼 google-apps-script.js 나 메일·시트 동작을 건드리는 모든 요청에, 코드 수정 전 계획 단계와 수정 후 안내 단계 양쪽에서 사용한다.
---

# Apps Script 수정 → 배포

`google-apps-script.js` 는 저장소에 있는 **원본 사본** 일 뿐이다. 실제로 도는 코드는 Google Sheets 에 붙은 Apps Script 프로젝트 안에 있고,
그쪽은 사용자가 편집기에서 손으로 붙여넣고 새 버전을 배포해야 바뀐다. 이 스킬의 목적은 두 가지다:

1. 수정할 때 **어떤 변경이 재배포만으로 끝나고, 어떤 변경이 권한 승인·트리거·환경변수까지 필요한지** 미리 알고 작업한다.
2. 수정이 끝나면 사용자가 그대로 따라 할 수 있는 **체크리스트를 변경 내용에 맞게** 만들어 준다.

절차 원문은 `GOOGLE_SHEETS_SETUP.md` 에 있다. 이 스킬은 그 문서를 대체하지 않고, 변경 종류에 따라 필요한 절만 골라 준다.

## 수정 전에 — 변경 종류 판단

먼저 무엇을 바꾸는지 아래 표에서 찾는다. 뒤따르는 조치가 달라진다.

| 변경 | 재배포 | 추가 조치 |
|---|---|---|
| 메일 문구·색·폰트·레이아웃 (`EMAIL_TEXT`, `EMAIL_COLORS`, `EMAIL_FONT*`, `buildEmailHtml`, `emailDetailLine`) | 필요 | `sendAllTestEmails` 로 6통 샘플 수신 확인 |
| 예식 정보·주소 (`WEDDING_INFO`, `INVITATION_URL`, `MAP_LINK_URL`) | 필요 | `INVITATION_URL` 을 바꿨으면 로고·지도 URL 이 따라가므로 `<주소>/email-logo.png` 가 열리는지 확인 |
| 리마인드 시점 (`WEDDING_DATE`, `REMINDER_DAYS_BEFORE`, `REMINDER_GRACE_DAYS`, `REMINDER_TRIGGER_HOUR`) | 필요 | 트리거 시각을 바꿨으면 `setupReminder` 재실행 |
| 시트 컬럼 (`COL`, `HEADERS`, `COLUMN_COUNT`, `buildRow`, `setupHeaders`) | 필요 | 기존 행과 어긋나지 않는지 확인. `ensureExtraHeaders` 가 처리하는 범위 밖이면 시트 헤더를 손으로 맞춰야 한다 |
| 새 액션 추가 (`doPost` 분기) | 필요 | 프론트 호출부(`src/sections/RsvpSection.tsx`, `PhotoDropSection.tsx` 등)도 같이 수정. 요청은 `Content-Type: text/plain` + JSON 문자열 |
| Gmail·Drive 등 **새 Google 서비스** 를 처음 호출 | 필요 | 권한 범위가 늘어나므로 재배포 후 `setupEmail` 류 함수를 한 번 실행해 승인 창을 띄워야 한다. 안 하면 doPost 가 조용히 실패한다 |
| 배포를 "새 배포" 로 만들어 URL 이 바뀜 | — | `.env` 의 `REACT_APP_GOOGLE_SHEETS_WEB_APP_URL` + **Vercel 환경변수** 둘 다 갱신 후 프론트 재배포 |

원칙: **"배포 관리 > 새 버전"** 을 쓰면 URL 이 유지된다. "새 배포" 를 만들면 URL 이 바뀌어 프론트까지 다시 배포해야 하므로, 특별한 이유가 없으면 새 버전을 안내한다.

## 수정할 때

- 이 파일은 CRA 빌드·tsconfig·ESLint **바깥** 이다. `npm run build` 가 검사하지 않는다. 문법 확인은 `node --check google-apps-script.js` 로 한다
  (Apps Script 런타임은 V8 이라 최신 문법은 대체로 되지만, `import`/`export` 와 Node 전용 API 는 쓸 수 없다).
- 메일 HTML 은 Gmail 앱(iOS·Android)이 색을 강제로 뒤집는다는 실측 결론이 문서에 있다 (`GOOGLE_SHEETS_SETUP.md` "확인 메일" 절).
  그래서 글자색은 검정 하나(`EMAIL_COLORS.ink`)로 두고 위계는 크기로 낸다. 다크모드 우회를 다시 시도하려는 요청이면 그 실측 이력을 먼저 알린다.
- 글자색 요소에는 `c-<색 키>`, 배경 요소에는 `b-<색 키>` 클래스를 붙이는 규칙이 있다. 문구를 추가할 때 같은 방식으로 붙인다.
- 문구는 `EMAIL_TEXT.ko` / `EMAIL_TEXT.en` 양쪽을 채운다. 게스트가 신청한 화면 언어로 나간다.
- 시트 주소·토큰·개인 이메일 같은 값은 코드에 새로 적지 않는다.

## 수정 후 — 사용자에게 줄 체크리스트

변경 종류에 맞춰 아래에서 필요한 단계만 골라 번호를 매겨 준다. 전부 나열하지 않는다.

1. **붙여넣기** — Google Sheets > 확장 프로그램 > Apps Script 를 열고, `google-apps-script.js` 전체를 복사해 편집기 내용을 통째로 교체한 뒤 저장.
2. **재배포** — 배포 > 배포 관리 > 연필 아이콘 > 버전: **새 버전** > 배포. (URL 이 그대로인지 확인)
3. **권한 승인** (새 서비스를 쓰기 시작했을 때만) — 함수 목록에서 `setupEmail` 선택 > 실행 > 승인 창에서 허용.
4. **트리거** (리마인드 시각·주기를 바꿨을 때만) — `setupReminder` 실행. 실행 로그에 발송 예정일이 찍히는지 확인.
5. **테스트 메일** (메일을 건드렸을 때) — `sendAllTestEmails` 실행 → 내 주소로 국문·영문 × 발급·변경 4통 + 리마인드 2통. 각 메일을 라이트/다크 모드 Gmail 앱에서 한 번씩 본다.
6. **환경변수** (URL 이 바뀌었을 때만) — `.env` 와 Vercel 대시보드의 `REACT_APP_GOOGLE_SHEETS_WEB_APP_URL` 갱신 → Vercel 재배포.
7. **끝단 확인** — 청첩장에서 실제로 RSVP 를 한 번 넣어 시트에 행이 생기고(참석 + 이메일이면) 확인 메일이 오는지 본다. 테스트 행은 시트에서 지운다.

## 안 될 때 먼저 볼 것

- 코드를 고쳤는데 그대로다 → 2번을 안 했거나 "새 버전" 이 아니라 편집기 저장만 했을 가능성이 가장 크다.
- 메일이 안 온다 → `SEND_CONFIRMATION_EMAIL` 값, 3번 권한 승인, 그리고 Gmail 일 100통 한도(`setupEmail` 로그에 남은 통수). 불참 신청에는 원래 안 나간다.
- 프론트에서 실패한다 → 응답이 CORS 없이 오도록 요청은 `text/plain` 이어야 한다. `fetch` 옵션을 바꾸지 않았는지 확인.
- 더 자세한 항목은 `GOOGLE_SHEETS_SETUP.md` 의 "문제 해결" 절.
