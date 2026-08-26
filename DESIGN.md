---
name: No Return Airlines — Wedding Invitation
description: 항공권으로 발행된 모바일 청첩장. 정복 네이비와 마감 골드, 아이보리 종이 위의 기계 인쇄 라벨.
colors:
  uniform-navy: "#1A2F4A"
  navy-deep: "#2a3f5a"
  trim-gold: "#C9A77C"
  gold-light: "#D4B896"
  camel: "#B8956A"
  ivory-paper: "#FAF8F3"
  warm-sand: "#F2E9DA"
  beige-accent: "#E6D8C3"
  beige-light: "#F0E6D6"
  surface-white: "#FFFFFF"
  divider-gray: "#e0e0e0"
  label-gray: "#9CA3AF"
  text-primary: "#333"
  text-secondary: "#666"
  text-tertiary: "#999"
  disabled-gray: "#ccc"
  success-green: "#4CAF50"
  error-red: "#ef4444"
typography:
  display:
    fontFamily: "Roboto, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "2px"
  headline:
    fontFamily: "Gowun Dodum, Lora, sans-serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "1px"
  title:
    fontFamily: "Gowun Dodum, Lora, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Gowun Dodum, Lora, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  label:
    fontFamily: "Roboto, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "2px"
  script:
    fontFamily: "Dancing Script, cursive"
    fontSize: "42px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
rounded:
  none: "0"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "999px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
  "3xl": "36px"
  "4xl": "48px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.uniform-navy}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "16px 24px"
    width: "100%"
  button-primary-hover:
    backgroundColor: "rgba(26, 47, 74, 0.05)"
    textColor: "{colors.uniform-navy}"
    rounded: "{rounded.sm}"
  button-primary-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.disabled-gray}"
    rounded: "{rounded.sm}"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 0"
    width: "100%"
  input-underline-focus:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.none}"
  chip-attendance:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  chip-attendance-active:
    backgroundColor: "{colors.trim-gold}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  ticket:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.uniform-navy}"
    rounded: "{rounded.lg}"
    padding: "0"
    width: "100%"
  ticket-header:
    backgroundColor: "{colors.uniform-navy}"
    textColor: "{colors.surface-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 20px 18px"
  bag-tag:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.uniform-navy}"
    rounded: "{rounded.lg}"
    padding: "0"
    width: "300px"
  pass-banner:
    backgroundColor: "{colors.uniform-navy}"
    textColor: "{colors.surface-white}"
    typography: "{typography.label}"
    rounded: "16px 16px 0 0"
    padding: "12px 20px"
  nav-language-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.uniform-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  fab-scroll-top:
    backgroundColor: "{colors.uniform-navy}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.circle}"
    height: "48px"
    width: "48px"
  paper-container:
    backgroundColor: "{colors.ivory-paper}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "36px 22px 48px"
---

# Design System: No Return Airlines — Wedding Invitation

## Overview

**Creative North Star: "노 리턴 항공 (No Return Airlines)"**

이 시스템은 한 가상 항공사의 브랜드 매뉴얼처럼 작동한다. 화면에 등장하는 모든 것은 **노 리턴 항공이 발행한 서류**다 — 보딩패스, 발권된 티켓, 수하물 태그, 게이트 안내판. 그래서 색은 두 가지 잉크뿐이다: 승무원 정복의 네이비(`#1A2F4A`)와 그 소매단을 두르는 마감 골드(`#C9A77C`). 나머지는 색이 아니라 **종이**다 — 아이보리, 웜 샌드, 화이트, 베이지. 라벨과 코드는 Roboto로 기계가 찍어낸 것처럼 인쇄되고, 사람의 말은 고운돋움(국문)과 Lora(영문)로 쓰인다.

성격은 **격식 있고 따뜻하다.** 항공사의 정확함과 절제를 유지하되 차갑게 굳지 않는다. 네이비의 격식을 아이보리 종이 질감과 골드가 늦춘다. 장식은 최소한이고, 화면을 채우는 것은 여백과 인쇄물의 물성이다 — 절취선, 펀치홀, 바코드, 4px 골드 밑단.

밀도는 낮다. 실사용 폭이 320~430px 하나뿐이므로 한 화면에 한 가지 일만 시킨다. 본문은 12px에 `line-height: 1.8`로 헐겁게 눕고, 섹션과 섹션 사이는 48px로 벌어진다. 부모님 세대가 이 화면을 읽는다는 사실이 밀도의 상한을 정한다.

**확정된 거부 대상:** 파스텔·형광 색조, 둥글둥글한 팝 요소, 강한 드롭섀도우와 네온 글로우. 코어 팔레트 밖의 새 색과 폰트 역할표 밖의 새 폰트.

**Key Characteristics:**
- 잉크는 두 가지 — 정복 네이비와 마감 골드. 나머지는 전부 종이와 회색 본문
- Roboto는 기계 인쇄체 전용 — 티켓 라벨, 코드, 게이트·좌석 번호에만
- 그림자는 종이가 살짝 뜬 정도까지 (검정 0.05 / 네이비 0.08)
- 브레이크포인트는 `430px` 하나
- 한/영 두 언어가 같은 레이아웃에서 동등하게 성립해야 성립한 것
- 촉감은 그림자가 아니라 종이 장치(절취선·펀치홀·바코드)로 만든다

## Colors

정복의 네이비와 그것을 두르는 금색 라인, 그리고 그 둘이 인쇄되는 종이. 팔레트는 이 세 층으로만 이루어져 있다.

### Primary
- **Uniform Navy** (`#1A2F4A`): 항공사 정복의 색이자 이 시스템의 잉크. 섹션 타이틀, 티켓 헤더, 보딩패스 상단 배너, 버튼 보더와 텍스트, 스크롤 버튼, 강조 본문에 쓴다. 화면에서 가장 무거운 것은 언제나 이 색이다.
- **Navy Deep** (`#2a3f5a`): 네이비의 눌린 상태. 호버와 모달 배경 그라데이션의 끝단에만 등장한다. 단독으로 쓰지 않는다.

### Secondary
- **Trim Gold** (`#C9A77C`): 정복 소매단의 금색 라인. 액센트 보더, 티켓 헤더 하단의 4px 밑단, 키워드 강조, 참석 선택 시 채워지는 면, 아이콘 스트로크. 면적이 아니라 **선과 테두리**로 존재하는 것이 이 색의 성질이다.
- **Gold Light** (`#D4B896`): 골드 그라데이션의 밝은 끝단 전용. 단독 사용 없음.
- **Camel** (`#B8956A`): 타임라인 전용 액센트. 연도 카운터 숫자와 이벤트 라벨 배지에만 쓴다. 타임라인 밖으로 나가지 않는다.

### Tertiary
- **Success Green** (`#4CAF50`) / **Error Red** (`#ef4444`): 피드백 전용. RSVP 성공/에러 메시지, 지하철·버스 아이콘 구분. 장식이나 강조에 쓰지 않는다.

### Neutral
- **Ivory Paper** (`#FAF8F3`): 종이 그 자체. 앱 배경(`.App`), `paper-container`, `PaperCard`, 보딩패스 래퍼, 로딩 화면의 바탕.
- **Surface White** (`#FFFFFF`): 티켓·태그·카드의 면, `section-wrapper--white`의 상단. 아이보리 위에 얹혀 "새로 발행된 종이"로 읽힌다.
- **Warm Sand** (`#F2E9DA`): 아이보리보다 한 톤 진한 종이. 현재는 ThankYou 푸터 한 곳에서만 바닥 면으로 쓰인다.
- **Beige Accent** (`#E6D8C3`) / **Beige Light** (`#F0E6D6`): 베이지 섹션 래퍼 배경과 그라데이션 끝단.
- **Divider Gray** (`#e0e0e0`): 섹션 구분선, 타임라인 수직선, 카드 보더, 입력 필드 밑줄. 이 시스템에서 "선"의 기본값.
- **Label Gray** (`#9CA3AF`): 티켓·태그의 필드 라벨과 바코드 텍스트 전용. Roboto 라벨과 항상 함께 나타난다.
- **Text Primary / Secondary / Tertiary** (`#333` / `#666` / `#999`): 본문 3단계. 각각 본문·설명·플레이스홀더. `#555`(3회)와 `#888`(1회)은 잔재이므로 새로 쓰지 않는다.
- **Disabled Gray** (`#ccc`): 비활성 버튼의 텍스트와 보더.

### Named Rules

**The Two-Ink Rule.** 한 화면에 잉크는 두 가지뿐 — 정복 네이비와 마감 골드. 그 밖의 모든 색면은 종이(아이보리/화이트/베이지)이거나 본문 회색이다. 세 번째 잉크가 필요하다고 느껴지면 색이 아니라 위계가 잘못된 것이다.

**The Gold-as-Line Rule.** 골드는 선과 테두리로 존재한다. 넓은 면을 골드로 채우는 것은 참석 선택 칩(`chip-attendance-active`) 하나뿐이며, 그 예외성이 그 칩을 "발권됨"으로 읽히게 만든다.

**The Feedback-Only Rule.** 그린과 레드는 상태 피드백에서만 나타난다. 장식·강조·구분에 쓰는 순간 항공사의 색 체계가 무너진다.

**The Camel Containment Rule.** `#B8956A`는 타임라인 전용이다. 다른 섹션에서 이 색을 보면 잘못 복사된 것이다.

## Typography

**Display / Machine Font:** Roboto (with sans-serif fallback)
**Body Font (KR):** Gowun Dodum (with Lora, sans-serif fallback)
**Body Font (EN):** Lora (serif) — `Playfair Display`는 TimelineSection의 폴백으로만
**Script Font:** Dancing Script — 로딩 화면 인사말 한 곳 전용

**Character:** 두 개의 목소리가 겹쳐 있다. Roboto는 발권 기계가 찍어낸 사무적인 목소리로 코드·라벨·시각을 말하고, 고운돋움과 Lora는 사람이 손으로 쓴 초대의 목소리로 문장을 말한다. 이 대비가 "항공권으로 쓰인 청첩장"을 성립시킨다. 두 목소리가 섞이는 순간 둘 다 힘을 잃는다.

### Hierarchy
- **Display** (Roboto, 700, 32px, line-height 1.1, letter-spacing 2px): 보딩패스와 티켓의 노선 코드(`SYD` / `ICN`). 이 시스템에서 가장 큰 글자이며, 항상 네이비 면 위 흰 글자다.
- **Headline** (Gowun Dodum, 400, 28px, line-height 1.4, letter-spacing 1px): 섹션 타이틀(`<h2>`). 영문은 Lora 300, 24px, letter-spacing 3px, `text-transform: uppercase`. 430px 이하에서 KR 24px / EN 20px.
- **Title** (600, 16px, line-height 1.3): 티켓·태그의 필드 값, 카드 안의 이름. `word-break: keep-all`로 한글 단어가 쪼개지지 않게 한다.
- **Body** (400, 12px, line-height 1.6~1.8): 본문 전체. 이 시스템의 기본 크기이며 압도적으로 가장 많이 쓰인다(55회). 인사말 문단은 1.8, 보조 설명은 1.6.
- **Label** (Roboto, 700, 10px, letter-spacing 2px, uppercase): 티켓 라벨, 상태 배지, 바코드 텍스트, 게이트·좌석 표기, 언어 토글. 색은 `#9CA3AF` 또는 네이비 면 위 `rgba(255,255,255,0.65)`.
- **Script** (Dancing Script, 400, 42px): 로딩 화면 인사말. **다른 어디에도 등장하지 않는다.**

### Named Rules

**The Machine-Print Rule.** Roboto는 티켓 세계의 글자다. 언제나 `10~12px` + `letter-spacing 1~2px` + `uppercase` 세트로만 등장하며, 일반 본문 문장에는 절대 쓰지 않는다. 이 세 조건 중 하나라도 빠지면 기계 인쇄가 아니라 그냥 산세리프가 된다.

**The Two-Language Title Rule.** 섹션 타이틀은 KR 28→24 / EN 24→20 네 값이 한 세트다. `@media (max-width: 430px)` 오버라이드를 빠뜨리면 그 섹션만 타이틀이 커 보인다(과거 Gallery·PhotoDrop에서 실제로 발생). 타이틀을 건드릴 때는 8개 섹션 전부를 함께 고친다.

**The One Handwriting Rule.** 손글씨는 로딩 화면 인사말 하나뿐이다. 손글씨가 두 곳에 있으면 그것은 더 이상 특별하지 않다.

## Layout

단일 컬럼, 세로 스크롤 하나. 앱 전체가 `max-width: 430px`로 잠겨 있고 그 안에서 위에서 아래로 섹션이 이어진다.

- **컨테이너:** `.App`이 430px 상한과 아이보리 배경을 잡고, 그 안의 `.paper-container`가 `border-radius: 24px` + `padding: 36px 22px 48px`로 한 장의 긴 종이를 만든다. Hero와 ThankYou는 이 종이 밖의 상·하단 전용 섹션이다.
- **섹션 루트:** `padding: 24px 20px`, `background: transparent`. 배경은 항상 `PaperCard` / `section-wrapper`가 담당한다. 모바일에서 줄일 때는 `20px` 또는 `20px 16px`.
- **리듬:** 섹션 구분선이 위아래 `48px`을 확보한다. 타이틀 아래는 `24px` 고정 — 보조 문구가 있든 없든 이 값으로만 간격을 조절한다. 내부 간격은 `4 / 8 / 12 / 16 / 20 / 24px` 스케일에서 고르며, `12px`와 `8px`이 가장 잦다.
- **가장자리 확장:** 흰 배경 섹션(`section-wrapper--white`)은 `margin-left/right: -33px`로 종이 폭을 넘어 좌우 끝까지 번지고, 상단에 56px 물결(`section-wave`, 인라인 SVG)이 이전 섹션과 겹쳐 경계를 흐린다.
- **반응형:** 브레이크포인트는 `@media (max-width: 430px)` **하나뿐**. 미디어쿼리는 각 섹션 CSS 파일 맨 아래에 모으고 순서는 `430px` → `prefers-reduced-motion: reduce`.

### Named Rules

**The One Breakpoint Rule.** 브레이크포인트는 `430px` 하나다. 새 브레이크포인트를 추가하는 대신 그 안에서 성립하는 레이아웃을 찾는다. 데스크톱은 이 제품의 사용 환경이 아니다.

**The Title Gap Rule.** 섹션 타이틀의 `margin-bottom: 24px`는 상수다. 타이틀과 다음 요소 사이가 답답하거나 헐거우면 다음 요소의 margin을 조절하고, 이 값은 건드리지 않는다.

## Elevation & Depth

이 시스템은 **종이가 살짝 뜬 정도**까지만 띄운다. 깊이는 그림자가 아니라 종이의 겹침과 경계선으로 만들어진다 — 아이보리 위에 흰 티켓이 놓이고, 그 티켓에 절취선이 지나가고, 물결이 이전 섹션 위로 포개진다.

그림자의 검정 불투명도는 `0.05` 이하, 네이비 그림자는 `0.08`이 상한이다. 예외는 두 가지: 종이 세계 밖의 요소(스크롤 버튼 `0.15`, 갤러리 라이트박스 `0.45`, 타임라인 이미지 모달 `0.5`)와 `PaperCard`다. `PaperCard`의 3중 그림자(검정 `0.25 / 0.2 / 0.15`)는 이 규범을 크게 벗어난 유일한 잔재이며, **모범이 아니라 예외로 기록된 것이다.** 새 컴포넌트는 이 값을 복사하지 않는다.

### Shadow Vocabulary
- **Paper Lift** (`box-shadow: 0 16px 32px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.03)`): `paper-container`. 긴 종이 한 장이 바닥에서 아주 살짝 떠 있는 상태. 기본값.
- **Ticket Lift** (`box-shadow: 0 6px 20px rgba(26,47,74,0.08)`): 발권된 티켓과 수하물 태그. 네이비 잉크가 번진 듯한 그림자로, 검정 그림자보다 종이에 가깝게 앉는다.
- **Interactive Lift** (`box-shadow: 0 4px 12px rgba(26,47,74,0.2)` + `translateY(-1px)`): 버튼 호버. 눌리기 직전에 종이가 손끝을 따라 올라오는 정도.
- **Floating Control** (`box-shadow: 0 4px 12px rgba(0,0,0,0.15)` → 호버 `0 6px 16px rgba(0,0,0,0.2)`): 스크롤 버튼처럼 종이 위에 떠 있는 조작 요소.
- **Overlay** (갤러리 라이트박스: 배경 `rgba(16,26,40,0.94)` + 이미지 `0 12px 40px rgba(0,0,0,0.45)` / 타임라인 이미지 모달: 배경 `rgba(0,0,0,0.85)` + 이미지 `0 8px 32px rgba(0,0,0,0.5)`): 종이 세계 밖의 층이므로 규범이 다르다. 갤러리의 배경은 순검정이 아니라 네이비 쪽으로 기운 어둠이다.
- **Inset Punch** (`box-shadow: inset 0 1px 2px rgba(0,0,0,0.25)`): 수하물 태그의 펀치홀. 유일하게 안으로 파인 그림자.

### Named Rules

**The Lifted-Paper Rule.** 그림자는 종이가 살짝 뜬 정도까지만. 검정 `0.05` / 네이비 `0.08`을 넘기려면 그 요소가 종이 세계 밖(모달·부유 컨트롤)에 있어야 한다.

**The Depth-By-Overlap Rule.** 층이 필요하면 그림자를 키우는 대신 겹친다 — 물결(`section-wave`)이 이전 섹션을 덮고, 흰 섹션이 종이 폭을 넘어 번지고, 티켓이 아이보리 위에 놓인다.

## Shapes

모서리는 **인쇄물의 크기에 비례한다.** 큰 종이일수록 크게 깎인다.

- `24px` — `paper-container`, 긴 종이 한 장
- `16px` — 티켓, 수하물 태그, `PaperCard`, 보딩패스 상단(`16px 16px 0 0`)
- `12px` — 중간 카드와 모달
- `8px` — 버튼, 언어 토글, 작은 배지 (가장 잦은 값, 16회)
- `0` — 입력 필드와 참석 선택 칩. 이 둘은 **기입란**이지 카드가 아니므로 깎지 않는다
- `50%` / `999px` — 원형 아이콘 버튼, 타임라인 마커, 알약 배지

보더는 `1px solid #e0e0e0`(구분·경계)와 `1px solid rgba(26,47,74,0.08)`(티켓 외곽)이 기본이다. 강조 보더는 버튼의 `2px solid #1A2F4A` 하나뿐이다.

**반복되는 종이 장치** — 이 시스템의 실루엣을 결정하는 것들:
- **절취선**: 6px 선 + 6px 공백, `rgba(26,47,74,0.25)`, 높이 1px. RsvpTicket / BagTag / HeroPassFlip이 **완전히 같은 값**을 공유한다.
- **점선 상단선**: 4px + 4px, `rgba(26,47,74,0.4)`. 보딩패스 푸터 경계.
- **바코드**: `repeating-linear-gradient(90deg, ...)`로 그린 불규칙 줄무늬, `opacity: 0.45`. 티켓 46px / 태그 40px / 보딩패스 50px 높이.
- **펀치홀**: 26×8px, `border-radius: 4px`, 아이보리 채움 + inset 그림자. 수하물 태그를 가방에 매다는 구멍.
- **4px 골드 밑단**: 네이비 헤더 아래를 두르는 `border-bottom: 4px solid #C9A77C`. 티켓·태그·보딩패스가 공유하는 서명.
- **물결**: 56px 높이의 인라인 SVG. 흰 섹션의 상단 경계.

### Named Rules

**The Perforation Rule.** 절취선은 6px 선 + 6px 공백 + `rgba(26,47,74,0.25)`다. 새 티켓 계열 컴포넌트는 이 값을 **그대로 복제한다.** 규격이 다른 절취선이 두 개 있으면 같은 항공사가 발행한 서류로 보이지 않는다.

**The Form-Is-Flat Rule.** 기입란(입력 필드, 참석 선택 칩)은 `border-radius: 0`이다. 둥근 입력 필드는 이 시스템에서 카드처럼 보이며, 양식 서류의 성격을 지운다.

**The Gold Hem Rule.** 네이비 헤더 아래에는 `4px solid #C9A77C` 밑단을 두른다. 이것이 노 리턴 항공이 발행한 서류라는 표식이다.

## Components

### Buttons
- **성격:** 손으로 잡히는 서류. 촉감은 그림자가 아니라 종이 장치와 미세한 들림에서 온다.
- **Shape:** 부드럽게 깎인 모서리(`8px`).
- **Primary** (`.form-submit`): 투명 바탕 + `2px solid #1A2F4A` 보더 + 네이비 텍스트, `padding: 16px 24px`, `width: 100%`. 면을 채우지 않고 테두리로 존재한다 — 도장이 찍히기 전의 서류 칸처럼.
- **Hover:** `rgba(26,47,74,0.05)` 배경 + `translateY(-1px)` + Interactive Lift. 동시에 `::before` 의사 요소가 `left: -100% → 100%`로 0.5s 동안 훑고 지나간다(빛 스침).
- **Disabled:** 텍스트·보더 모두 `#ccc`, transform 없음.
- **Icon FAB** (`.scroll-to-top-btn`): 48×48 원형, 네이비 채움 + 흰 아이콘, `position: fixed`. 유일하게 면이 꽉 찬 버튼.

### Chips
- **Style** (`.radio-label`): 흰 바탕, 보더 없음, `border-radius: 0`, `padding: 12px 16px`, 좌우로 `flex: 1` 균등 분할.
- **Selected:** `::before`가 `linear-gradient(135deg, #C9A77C, #D4B896)`를 `opacity: 0→1`로 채우고, 칩 전체가 `scale(1.02)`로 커지며 텍스트와 아이콘이 흰색으로 뒤집힌다. 골드가 면으로 등장하는 **유일한 자리**이며, 그래서 이 선택이 "발권"처럼 느껴진다.
- **전환:** `0.3s cubic-bezier(0.4, 0, 0.2, 1)`.

### Cards / Containers
- **Paper Container:** 아이보리, `24px` 모서리, `36px 22px 48px` 패딩, Paper Lift. 하단 섹션 전체를 한 장의 종이로 묶는다.
- **Ticket / Bag Tag:** 흰 바탕, `16px` 모서리, `1px solid rgba(26,47,74,0.08)` 외곽, Ticket Lift, `overflow: hidden`. 네이비 헤더 + 4px 골드 밑단 + 2열 그리드 본문(`gap: 18px 12px`) + 절취선 + 바코드 순서로 조립된다.
- **PaperCard:** 아이보리, `16px` 모서리. `::before`가 텍스처 이미지를 `opacity: 0.12`로, `::after`가 `rgba(255,255,255,0.3)` 흰 막을 덮어 종이 질감을 만든다. 그림자는 규범을 벗어난 잔재(Elevation 참조).

### Inputs / Fields
- **Style** (`.form-input`, `.form-textarea`): 보더 없음, `border-bottom: 1px solid #e0e0e0`, `border-radius: 0`, 투명 바탕, `padding: 8px 0`, 12px 텍스트. 상자가 아니라 **기입란**이다.
- **Focus:** `outline: none` + 밑줄만 `#1A2F4A`로 바뀐다. 링도 글로우도 없다.
- **Error:** 밑줄이 `#ef4444`로 바뀌고 필드 아래에 12px 에러 문구.
- **Label:** 12px / 600 / `#333`, `min-width: 80px`으로 좌측 정렬 — 양식 서류의 항목명처럼 값과 나란히 선다.

### Navigation
- **Language Toggle** (`.language-toggle-button`): 우상단 고정. 투명 바탕 + `1px solid rgba(26,47,74,0.3)` + `8px` 모서리, Roboto 11px/600/`letter-spacing: 1px`/uppercase + Material 아이콘 18px. 호버 시 `rgba(26,47,74,0.05)` + `translateY(-1px)`. 이 시스템에서 유일한 전역 내비게이션이며, Roboto를 쓰는 유일한 조작 요소다.
- 그 외 내비게이션은 없다. 이동 수단은 스크롤 하나뿐이다.

### Boarding Pass (Signature)

Hero 전체가 한 장의 실제 보딩패스다. 위에서 아래로: 네이비 상단 배너(`WEDDING BOARDING PASS`, Roboto 11px, 골드 스트로크 아이콘) → 4px 골드 그라데이션 액센트 보더 → 흰 헤더(날짜) → 본문(항공사명·편명·클래스·노선 코드 32px) → 커플 사진 → 점선 경계 → 푸터(`GATE 1F` / `BOARDING 15:00` + 50px 바코드). `HeroPassFlip`으로 앞뒤가 뒤집히며, 뒷면 절취선은 티켓·태그와 같은 규격을 쓴다.

### Ticket & Bag Tag (Signature)

RSVP 제출과 사진 접수는 각각 **발권**과 **수하물 접수**로 완결된다. 두 컴포넌트는 헤더 구조, 4px 골드 밑단, 2열 필드 그리드, 절취선, 바코드를 공유하되 태그에만 펀치홀(26×8px)이 있다. 불참 응답은 `1px dashed rgba(26,47,74,0.25)` 보더의 "오픈 티켓"으로 발급된다 — 실선이 아닌 점선이 "언제든 다시"를 뜻한다.

### 모션

- **표준 이징:** `cubic-bezier(0.4, 0, 0.2, 1)`. 상태 전환은 `0.2s`, 형태 변화는 `0.3s`, 카드 플립은 `0.6~0.85s`.
- **섹션 진입:** framer-motion `sectionFadeInProps` — `opacity 0→1`, `y 28→0`, `0.45s easeOut`, `viewport: { once: true, amount: 0.15 }`. 모든 섹션이 예외 없이 이 하나를 쓴다.
- **접근성:** `prefers-reduced-motion: reduce` 블록은 각 CSS 파일 맨 아래, `430px` 미디어쿼리 다음에 온다. 현재 3개 파일에만 있다.

## Do's and Don'ts

### Do:
- **Do** 새 UI 요소를 만들기 전에 "이것은 노 리턴 항공이 발행한 어떤 서류인가"를 먼저 답한다. 티켓·태그·스탬프·안내판·도장 중 하나로 성립해야 한다.
- **Do** 절취선을 그릴 때 `6px 선 + 6px 공백 + rgba(26,47,74,0.25)`를 그대로 복제한다.
- **Do** 네이비 헤더에 `border-bottom: 4px solid #C9A77C` 밑단을 두른다.
- **Do** 섹션 타이틀을 고칠 때 **8개 섹션 전부**와 `@media (max-width: 430px)` 오버라이드, `:lang(en)` 변형을 함께 고친다 (KR 28→24 / EN 24→20).
- **Do** 언어 의존 텍스트 요소에 `lang={language}`를 붙인다. `:lang(en)` 셀렉터 전체가 여기에 의존한다.
- **Do** 문구를 `src/data/translations.ts`에만 둔다. 컴포넌트에 문자열을 하드코딩하지 않는다.
- **Do** 그라데이션 방향을 `135deg` 또는 `90deg` / `to right`로 통일한다.
- **Do** 새 색을 추가했으면 `THEME_COLORS.md`를 같이 갱신한다.

### Don't:
- **Don't** 코어 5색(`#1A2F4A` / `#C9A77C` / `#FAF8F3` / `#FFFFFF` / `#E6D8C3`) 밖의 색을 새로 만든다. 필요하면 `THEME_COLORS.md`에서 찾고, 거기에도 없으면 사용자에게 묻는다.
- **Don't** 폰트를 새로 추가한다. Roboto / Gowun Dodum / Lora / Dancing Script / Playfair Display / Material Symbols가 전부다.
- **Don't** Roboto를 일반 본문 문장에 쓴다. 티켓 라벨·코드 전용이며 항상 `10~12px` + `letter-spacing` + `uppercase` 세트로만.
- **Don't** 카멜(`#B8956A`)을 타임라인 밖에서 쓴다.
- **Don't** 그린·레드를 피드백이 아닌 곳에 쓴다.
- **Don't** 검정 `0.05` / 네이비 `0.08`을 넘는 그림자를 종이 세계 안의 요소에 준다. `PaperCard`의 3중 그림자는 복사할 모범이 아니다.
- **Don't** 입력 필드나 참석 선택 칩의 모서리를 깎는다. 기입란은 `border-radius: 0`이다.
- **Don't** `@media (max-width: 430px)` 외의 브레이크포인트를 추가한다.
- **Don't** 섹션 전용 스타일을 `src/App.css`에 넣는다. `section-divider` / `section-wave`는 App.css가 소유하고, 섹션 CSS에서 재정의하지 않는다.
- **Don't** 파스텔·형광 색조, 둥글둥글한 팝 요소, 네온 글로우, 강한 드롭섀도우를 들인다.
- **Don't** 보딩패스 세계관과 무관한 은유(예: 봉투 밖의 새 은유, 게임적 요소)를 섞는다.
