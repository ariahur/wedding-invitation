# 테마 컨셉

이 문서는 **"왜 이 색과 이 폰트인가"** 를 정의한다.
값의 전체 목록(모든 hex, 그라데이션, 투명도)은 `THEME_COLORS.md` 가 정본이며, 이 문서는 그 요약과 사용 규칙이다.
섹션 타이틀·간격 등 레이아웃 규격은 `src/sections/CLAUDE.md` 를 따른다.

## 1. 컨셉 한 문단

**항공권(보딩패스) 모티프의 모바일 청첩장.**
결혼식을 "함께 떠나는 여정의 탑승"에 빗대어, 화면 전체가 종이 티켓 다발처럼 보이도록 만든다.
Hero는 실제 보딩패스(`HeroBoardingPassSection`), RSVP 완료는 발권된 티켓(`RsvpTicket`),
사진 업로드는 수하물 태그(`BagTag`), 인트로는 공항 안내판(`FlightBoardIntro`) 은유를 쓴다.
바탕은 `PaperCard` 의 아이보리 종이 질감이고, 그 위에 **네이비(항공사 정복) + 골드(고급 마감)** 를 얹는다.

톤: 차분하고 격식 있게, 장식은 절제. 파스텔·형광·둥글둥글한 팝 요소를 넣지 않는다.

## 2. 코어 팔레트 (5색)

이 5색만으로 대부분을 해결한다. 여기 없는 색이 필요하면 먼저 `THEME_COLORS.md` 에서 찾고,
거기에도 없으면 새로 만들지 말고 사용자에게 묻는다.

| 역할 | 값 | 쓰는 곳 |
|---|---|---|
| **Primary** (Navy) | `#1A2F4A` | 섹션 타이틀, 버튼, 보딩패스 본체, 강조 텍스트 |
| **Secondary** (Gold) | `#C9A77C` | 액센트 보더, 티켓 헤더의 4px 밑단, 키워드 강조 |
| **Background** (Ivory) | `#FAF8F3` | 앱 전체 배경, `paper-container`, 로딩 화면 |
| **Surface** (White) | `#FFFFFF` | 카드 / 티켓·태그 / `section-wrapper--white` 배경 |
| **Accent** (Beige) | `#E6D8C3` | 그라데이션 끝단 (타임라인 라벨, 로딩 텍스트) |

보조로 자주 쓰는 것: 구분선 `#e0e0e0`, 타임라인 전용 카멜 `#B8956A`,
티켓·태그의 라벨 `#9CA3AF`, 본문 텍스트 `#333` / `#666` / `#999` (진함 → 연함 순).

주의:
- **섹션 구분선은 골드가 아니라 `1px solid #e0e0e0`** 이다 (`src/App.css` 소유).
- `#E6D8C3` 는 현재 **단독 배경으로 쓰이지 않는다.** 베이지 섹션 래퍼 배경은 주석 처리되어 있다.

규칙:
- hex 는 **대문자** 로 쓴다 (`#1A2F4A`, `#c9a77c` 아님). 단 회색 계열 `#333` `#666` `#999` `#e0e0e0` 는 기존 표기를 유지한다.
- 상태색(성공 `#4CAF50` / 에러 `#ef4444`)은 **피드백 전용**이다. 장식에 쓰지 않는다.
- 새 색을 추가했으면 `THEME_COLORS.md` 를 **같이** 갱신한다.

## 3. 폰트 역할표

`public/index.html` 에서 로드하는 폰트는 아래가 전부다. **역할 밖에서 쓰지 않는다.**

| 폰트 | 역할 | 대표 사용처 |
|---|---|---|
| `Gowun Dodum` | 한국어 본문·타이틀 | 전 섹션 기본 (`src/styles/globals.css`) |
| `Lora` | 영문 본문·타이틀 (serif) | `:lang(en)` 변형 전체 |
| `Roboto` | **티켓 기계 인쇄체** — 라벨, 코드, 게이트/좌석 번호, 언어 토글 | `HeroBoardingPassSection`, `RsvpTicket`, `BagTag`, `HeroPassFlip` |
| `Dancing Script` | 손글씨 — 로딩 화면 인사말 **한 곳 전용** | `LoadingScreen.css` |
| `Playfair Display` | `Lora` 의 폴백으로만 | `TimelineSection.css` |
| `Material Symbols Outlined` | 아이콘 | 전역 |

- 본문 폰트 스택은 한국어 `"Gowun Dodum", "Lora", sans-serif` / 영문 `"Lora", serif` 조합을 유지한다.
- `Roboto` 는 "기계가 찍어낸 티켓" 느낌을 내는 장치다. 보통 `font-size: 11~12px` +
  `letter-spacing: 1~2px` + `text-transform: uppercase` 와 함께 쓴다. 일반 본문에는 쓰지 않는다.
- **폰트를 새로 추가하지 않는다.** 위 목록으로 표현이 안 되는 요청을 받으면 먼저 사용자에게 확인한다.
  (과거에 Grandiflora One / Cormorant / Nanum Pen Script / Caveat 를 로드만 하고 아무 데서도 쓰지 않아 제거했다.)

## 4. 은유를 지키는 규칙

컴포넌트를 추가·수정할 때 컨셉이 깨지지 않도록:

- 새 UI 요소는 **종이 인쇄물** 로 성립하는 형태를 우선한다 (티켓, 태그, 스탬프, 안내판, 도장).
- 티켓/태그 계열 컴포넌트에는 절취선·펀치홀·바코드 같은 기존 장치를 재사용한다. 새 은유를 섞지 않는다.
- 그림자는 종이가 살짝 뜬 정도로만. 강한 드롭섀도우나 네온 글로우를 쓰지 않는다.
- 그라데이션 방향은 `135deg` (좌상 → 우하) 또는 `90deg` / `to right` 로 통일한다.
