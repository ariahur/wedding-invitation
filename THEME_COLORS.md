# 프로젝트 테마 색상 가이드

이 문서는 **색상 값의 전체 정본**이다. 모든 hex·그라데이션·투명도가 여기 모여 있다.

- **왜 이 색인가**(컨셉·코어 5색·사용 규칙) → `.claude/rules/theme-concept.md`
- **디자인 시스템 전체**(타이포·레이아웃·컴포넌트·Named Rules) → `DESIGN.md`
- **섹션 레이아웃 규격** → `src/sections/CLAUDE.md`

> **2026-08-26 코드 대조 완료.** `src/**/*.css` 전체를 실제로 세어 값과 사용처를 맞췄다.
> 사용 횟수는 그때 기준이며, **주석 처리되어 실제로는 적용되지 않는 값은 그렇게 표시했다.**
> 색을 추가·변경했으면 이 문서와 `DESIGN.md` 프론트매터를 함께 갱신한다.

## 🎨 주요 색상 팔레트

### 배경 색상 (Background Colors)

| 색상 코드 | 색상 이름 | 사용 위치 | 설명 |
|---------|---------|---------|------|
| `#FAF8F3` | Ivory Paper | **앱 배경(`.App`)**, `paper-container`, `PaperCard`, 보딩패스 래퍼, 로딩 화면, BagTag 펀치홀 | 이 프로젝트의 "종이" 그 자체. 가장 바깥 바탕색이다 |
| `#FFFFFF` | White | 티켓·태그·카드의 면, 보딩패스 본체, `section-wrapper--white` 상단, 참석 선택 칩 | 아이보리 위에 얹혀 "새로 발행된 종이"로 읽힌다 |
| `#F2E9DA` | Warm Sand | **ThankYou 섹션 배경 한 곳뿐** (`.thank-you`) | 본문 배경(`#FAF8F3`)과 같은 색조에서 채도만 올린 톤. 앱 배경이 **아니다** |
| `#E6D8C3` | Beige | 타임라인 이벤트 라벨 그라데이션 끝단, 로딩 텍스트 그라데이션 끝단, AboutUs·Directions 그라데이션(주석) | 현재 **단독 배경으로는 쓰이지 않는다.** 그라데이션 끝단 전용 |
| `#F0E6D6` | Light Beige | AboutUs·Directions 섹션 배경 그라데이션 — **전부 주석 처리됨** | 실제 렌더링에 나타나지 않는다 |
| `#f5f5f5` | Very Light Gray | AboutUs 프로필 이미지 플레이스홀더 (2회) | 사진 로드 전 바탕 |

> **주석 처리되어 살아 있지 않은 베이지 계열:** `#F4EBDE` `#F3E9DC` `#F2E8DA` `#EEE2D0` `#EADCC8`.
> `AboutUsSection.css` / `DirectionsSection.css` 상단의 주석 블록 안에만 있다. 되살릴 계획이 없으면 새로 참조하지 않는다.

### 주요 액센트 색상 (Primary Accent Colors)

| 색상 코드 | 색상 이름 | 사용 위치 | 설명 |
|---------|---------|---------|------|
| `#1A2F4A` | Uniform Navy | 섹션 타이틀, 티켓·태그·보딩패스 헤더, 버튼 보더·텍스트, 스크롤 버튼, 바코드 줄, 절취선 | 항공사 정복의 색이자 이 시스템의 잉크. 압도적 최다 사용(64회) |
| `#2a3f5a` | Navy Hover | 스크롤 버튼 호버, AboutUs 버튼 호버, 연락처 모달·조회 모달 배경 그라데이션 끝단 | 네이비의 눌린 상태. 단독으로 쓰지 않는다 |
| `#16283F` | Navy Deep | RsvpIssuedPanel 버튼 호버, HeroPassFlip 뒷면 그라데이션 끝단 | `#2a3f5a`보다 더 어두운 네이비. 두 곳 전용 |
| `#C9A77C` | Trim Gold | 액센트 보더, 티켓·태그 헤더의 4px 밑단, 키워드, 참석 선택 칩, 아이콘 스트로크 | 정복 소매단의 금색 라인. **면이 아니라 선과 테두리로 존재한다** |
| `#D4B896` | Light Gold | 골드 그라데이션의 밝은 끝단 | 단독 사용 없음 |
| `#B8956A` | Camel | 타임라인 카운터 숫자, 이벤트 라벨 배지 | **타임라인 전용.** 다른 섹션에 나타나면 잘못 복사된 것 |
| `#e0e0e0` | Divider Gray | 섹션 구분선, 타임라인 수직선, 카드 보더, 입력 필드 밑줄, 보딩패스 헤더 경계 | 이 시스템에서 "선"의 기본값 (12회) |

### 텍스트 색상 (Text Colors)

| 색상 코드 | 색상 이름 | 사용 위치 | 설명 |
|---------|---------|---------|------|
| `#333` | Text Primary | 기본 본문, 폼 라벨 (11회) | 가장 진한 텍스트 |
| `#666` | Text Secondary | 설명 텍스트, 입력 필드 값 (14회) | 일반 설명 |
| `#999` | Text Tertiary | 플레이스홀더, 보조 문구, 비활성 아이콘 (9회) | 연한 텍스트 |
| `#9CA3AF` | Label Gray | **티켓·태그의 필드 라벨, 바코드 텍스트, PhotoDrop 라벨** (13회) | Roboto 기계 인쇄 라벨과 항상 함께 나타난다 |
| `#6B7280` | Slate Gray | Hero 날짜 그라데이션 중간색, RsvpIssuedPanel 수정 버튼 (2회) | |
| `#4A5568` | Slate Dark | Hero 날짜 그라데이션 시작색 (1회) | |
| `#555` | — | Directions 안내, 타임라인 설명, RSVP 문구 (3회) | **잔재.** 새로 쓰지 말고 `#666`을 쓴다 |
| `#888` | — | Directions 버스 보조 문구 (1회) | **잔재.** 새로 쓰지 말고 `#999`를 쓴다 |
| `white` / `#FFFFFF` | White | 네이비 배경 위 텍스트, 선택된 칩의 텍스트 | 대비용 |
| `rgba(26, 47, 74, 0.65)` | Navy 65% | ThankYou 섹션 텍스트 | 반투명 네이비 |

### 상태 색상 (Status Colors)

**피드백 전용이다. 장식·강조·구분에 쓰지 않는다.**

| 색상 코드 | 색상 이름 | 사용 위치 |
|---------|---------|---------|
| `#4CAF50` | Green | RSVP 성공 메시지 |
| `#16a34a` | Dark Green | RSVP 성공 배지 텍스트 |
| `#ef4444` | Red | 폼 에러 메시지·밑줄 (4회) |
| `#dc2626` | Dark Red | RSVP·PhotoDrop 에러 배지 텍스트 |
| `#E8A598` | Muted Coral | RSVP 조회 모달의 에러 문구. 네이비 모달 배경 위에서 읽히도록 톤을 낮춘 레드 |

### 교통 노선 색 (Transit Colors)

Directions 섹션의 12px 원형 표식(`.directions__circle--*`) 전용이다.
**상태색이 아니라 서울 대중교통의 실제 노선 색**을 흉내 낸 것이므로, 다른 의미로 재사용하지 않는다.

| 색상 코드 | 클래스 | 표시 대상 |
|---------|-------|---------|
| `#4CAF50` | `--green` | 지하철 2호선, 버스 지선 |
| `#4A90E2` | `--blue` | 버스 간선 |
| `#F44336` | `--red` | 버스 광역 |

### 보조 색상 (Secondary Colors)

| 색상 코드 | 색상 이름 | 사용 위치 |
|---------|---------|---------|
| `#ccc` | Gray | 비활성 버튼의 텍스트·보더 |
| `#eee` | Very Light Gray | 보딩패스 내부 경계선 1곳 |
| `#ddd` | Light Gray | 타임라인 이미지 플레이스홀더의 `2px dashed` 보더 |
| `#fff9c4` | Light Yellow | **타임라인 이벤트 설명의 `.highlight` 텍스트 배경** (형광펜 효과) |
| `#f5f7fa` / `#c3cfe2` | Blue-Gray | 타임라인 이미지 플레이스홀더 그라데이션 |
| `#000` | Black | 보딩패스 바코드 패턴 (146회 — 전부 바코드 줄무늬) |

## 🌈 그라데이션 (Gradients)

### 로딩 화면 텍스트 그라데이션
```css
linear-gradient(135deg, #1A2F4A 0%, #1A2F4A 5%, #C9A77C 50%, #E6D8C3 100%)
```
Navy → Gold → Beige. `LoadingScreen.css` 2곳. `background-clip: text`로 글자에 입힌다.

### 섹션 구분선 (Section Divider)
```css
/* src/App.css — .paper-container .section-divider */
height: 1px;
background: #e0e0e0;
margin: 48px 0;
```
**그라데이션이 아니라 1px 회색 실선이다.** 과거 문서에 있던 골드/베이지 그라데이션 구분선은
현재 코드 어디에도 없다. 이 선은 `src/App.css`가 소유하며 섹션 CSS에서 재정의하지 않는다.

### Hero Boarding Pass 액센트 보더
```css
linear-gradient(
  to right,
  rgba(201, 167, 124, 0.9) 0%,
  #C9A77C 15%,
  #D4B896 30%,
  #D4B896 70%,
  #C9A77C 85%,
  rgba(201, 167, 124, 0.9) 100%
)
```
높이 4px + `box-shadow: 0 1px 2px rgba(201, 167, 124, 0.2)`. 보딩패스 상단 배너 바로 아래.

### Hero 날짜 텍스트 그라데이션
```css
linear-gradient(to right, #4A5568 0%, #6B7280 40%, #9CA3AF 60%, #C9A77C 100%)
```
`background-clip: text`. 회색에서 골드로 넘어가며 "기계로 인쇄된 날짜"를 만든다.

### 타임라인 선 (Timeline Line)
```css
linear-gradient(
  to bottom,
  rgba(224, 224, 224, 0.3) 0%,
  #e0e0e0 20%,
  #e0e0e0 80%,
  rgba(224, 224, 224, 0.3) 100%
)
```
양 끝이 흐려지는 회색 수직선.

### 타임라인 이벤트 라벨
```css
linear-gradient(135deg, #B8956A 0%, #C9A77C 50%, #D4B896 100%)
```
카멜 → 골드 → 라이트 골드. 타임라인 이벤트 배지 전용.
호버 시 `linear-gradient(135deg, #C9A77C 0%, #D4B896 50%, #E6D8C3 100%)` 로 한 단계 밝아진다.

### 참석 선택 칩 (선택됨)
```css
linear-gradient(135deg, #C9A77C 0%, #D4B896 100%)
```
`::before`에 깔고 `opacity: 0 → 1`로 채운다. **골드가 넓은 면을 차지하는 유일한 자리다.**

### 모달 배경 (연락처 / RSVP 조회)
```css
linear-gradient(135deg, #1A2F4A 0%, #2a3f5a 100%)
```
`AboutUsSection.css`, `RsvpLookupModal.css`.

### HeroPassFlip 뒷면
```css
linear-gradient(160deg, #1a2f4a 0%, #16283f 100%)
```

### 흰 섹션 배경
```css
linear-gradient(to bottom, #fff 0%, #fff 40%, #FAF8F3 100%)
```
`section-wrapper--white`. 흰색에서 종이색으로 내려간다.

### 타임라인 이미지 플레이스홀더
```css
linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)
```
`.event-image-placeholder`. **현재 사용 중이다** (과거 문서의 "주석 처리됨"은 사실이 아니었다).

### 버튼 호버의 빛 스침
```css
linear-gradient(90deg, transparent, rgba(26, 47, 74, 0.1), transparent)
```
`.form-submit::before`가 `left: -100% → 100%`로 0.5s 동안 훑고 지나간다.

## 🔳 반복되는 색 패턴 (종이 장치)

색이 아니라 **패턴**으로 정의되는 것들. 새 티켓 계열 컴포넌트는 값을 그대로 복제한다.

### 절취선 (Perforation)
```css
height: 1px;
background-image: linear-gradient(
  to right,
  rgba(26, 47, 74, 0.25) 0,
  rgba(26, 47, 74, 0.25) 6px,
  transparent 6px,
  transparent 12px
);
background-size: 12px 1px;
background-repeat: repeat-x;
```
**6px 선 + 6px 공백.** `RsvpTicket` / `BagTag` / `HeroPassFlip`이 완전히 같은 값을 공유한다.

### 보딩패스 푸터 점선
```css
repeating-linear-gradient(
  to right,
  rgba(26, 47, 74, 0.4) 0px,
  rgba(26, 47, 74, 0.4) 4px,
  transparent 4px,
  transparent 8px
)
```
4px + 4px. 절취선(6+6)과 규격이 다르니 섞지 않는다.

### 바코드 줄무늬
```css
repeating-linear-gradient(
  90deg,
  #1A2F4A 0px, #1A2F4A 2px, transparent 2px, transparent 4px,
  #1A2F4A 4px, #1A2F4A 5px, transparent 5px, transparent 8px,
  #1A2F4A 8px, #1A2F4A 11px, transparent 11px, transparent 13px
);
opacity: 0.45;
```
티켓·태그는 위 네이비 패턴을, Hero 보딩패스는 `#000` 기반의 더 촘촘한 패턴을 쓴다.
높이: 티켓 46px / 태그 40px / 보딩패스 50px.

### BagTag 펀치홀
```css
width: 26px; height: 8px;
border-radius: 4px;
background: #FAF8F3;
box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25);
```
태그를 가방에 매다는 구멍. **이 프로젝트에서 유일하게 안으로 파인 그림자다.**

> 과거 문서에 있던 "절취선 반원 노치"는 코드에 존재하지 않는다. 종이 장치는 위 넷이 전부다.

## 🫧 투명도 사용 (Opacity Usage)

### 네이비 계열
| 값 | 사용 위치 |
|-----|---------|
| `rgba(26, 47, 74, 0.05)` | 버튼·언어 토글 호버 배경 |
| `rgba(26, 47, 74, 0.06)` | ThankYou 섹션 보더 |
| `rgba(26, 47, 74, 0.08)` | **티켓·태그 외곽 보더**, AboutUs 블록 구분선 |
| `rgba(26, 47, 74, 0.1)` | 버튼 호버 그림자, 빛 스침 그라데이션 |
| `rgba(26, 47, 74, 0.2)` | 버튼 호버 그림자 |
| `rgba(26, 47, 74, 0.25)` | **절취선**, RsvpIssuedPanel 밑줄, 오픈 티켓의 dashed 보더, 티켓 그림자 |
| `rgba(26, 47, 74, 0.3)` | 언어 토글 보더 |
| `rgba(26, 47, 74, 0.4)` | 보딩패스 푸터 점선 |
| `rgba(26, 47, 74, 0.65)` | ThankYou 텍스트 |

### 골드 계열
| 값 | 사용 위치 |
|-----|---------|
| `rgba(201, 167, 124, 0.1)` | 주소 복사 버튼 호버 배경 (Directions) |
| `rgba(201, 167, 124, 0.2)` | 액센트 보더 그림자 |
| `rgba(201, 167, 124, 0.3)` | 선택된 칩의 그림자, 그라데이션 |
| `rgba(201, 167, 124, 0.6)` | 그라데이션 끝단 |
| `rgba(201, 167, 124, 0.8)` | 텍스트 |
| `rgba(201, 167, 124, 0.9)` | 로딩 화면 별 파티클, 액센트 보더 양 끝 |

### 회색 / 카멜 / 화이트
| 값 | 사용 위치 |
|-----|---------|
| `rgba(224, 224, 224, 0.2 ~ 0.5)` | 타임라인 선·마커·이미지 보더, 카드 호버 그림자 |
| `rgba(184, 149, 106, 0.25)` / `0.3` / `0.35` | 카멜 그림자·보더 (타임라인 전용) |
| `rgba(255, 255, 255, 0.05 ~ 0.1)` | 모달 아이템 배경 |
| `rgba(255, 255, 255, 0.2)` | 보더, PaperCard 흰 막 |
| `rgba(255, 255, 255, 0.3)` | 보더, PaperCard `::after` |
| `rgba(255, 255, 255, 0.65)` | **티켓·태그 헤더의 라벨 텍스트** |
| `rgba(255, 255, 255, 0.7)` | 모달 텍스트 |

### 검정 (그림자 / 오버레이)
| 값 | 사용 위치 |
|-----|---------|
| `rgba(0, 0, 0, 0.03)` / `0.05` | `paper-container` — **종이 세계의 그림자 상한** |
| `rgba(0, 0, 0, 0.15)` / `0.2` | 스크롤 버튼 (부유 컨트롤) |
| `rgba(0, 0, 0, 0.25)` | BagTag 펀치홀 inset, PaperCard (잔재) |
| `rgba(0, 0, 0, 0.45)` | 갤러리 라이트박스 **이미지 그림자** |
| `rgba(0, 0, 0, 0.5)` | 타임라인 이미지 모달의 이미지 그림자 |
| `rgba(0, 0, 0, 0.85)` | **타임라인 이미지 모달** 배경 오버레이 |
| `rgba(16, 26, 40, 0.94)` | **갤러리 라이트박스** 배경. 순검정이 아니라 네이비 쪽으로 기운 어둠이다 |
| `rgba(34, 197, 94, 0.1)` / `0.2` | 성공 배지 배경·보더 |
| `rgba(239, 68, 68, 0.1)` / `0.2` | 에러 배지 배경·보더 |

## 📐 색상 사용 가이드

### 코어 5색

새 색을 만들기 전에 **반드시 여기서 먼저 고른다.**

- **Primary**: `#1A2F4A` (Uniform Navy)
- **Secondary**: `#C9A77C` (Trim Gold)
- **Background**: `#FAF8F3` (Ivory Paper)
- **Surface**: `#FFFFFF` (White)
- **Accent**: `#E6D8C3` (Beige)

보조: 구분선 `#e0e0e0` / 타임라인 전용 카멜 `#B8956A` / 라벨 `#9CA3AF`

### 텍스트 계층 구조
1. `#333` — 본문 (진함)
2. `#666` — 설명
3. `#999` — 플레이스홀더·보조
4. `#9CA3AF` — Roboto 기계 인쇄 라벨 전용
5. `#1A2F4A` — 강조·타이틀
6. `#C9A77C` — 키워드 강조
7. `#B8956A` — 타임라인 카운터 전용

### 상태별 색상
- **Success**: `#4CAF50` / `#16a34a`
- **Error**: `#ef4444` / `#dc2626` / `#E8A598`(네이비 배경 위)
- **Hover**: `#2a3f5a`, `#16283F`, `rgba(26, 47, 74, 0.05)`
- **Disabled**: `#ccc`

### 섹션별 색상 사용

#### Hero Boarding Pass
- 배경: 래퍼 `#FAF8F3`, 본체 `#FFFFFF`
- 상단 배너: `#1A2F4A` 바탕 + 흰 글자 + 골드 스트로크 아이콘
- 액센트 보더: 골드 그라데이션 4px
- 날짜: 회색 → 골드 텍스트 그라데이션
- 바코드: `#000`

#### About Us
- 배경: 투명 (`paper-container`의 `#FAF8F3`가 비친다)
- 블록 구분선: `rgba(26, 47, 74, 0.08)`
- 카드 보더: `#e0e0e0`
- 키워드: `#C9A77C`
- 연락처 모달: 네이비 그라데이션

#### Timeline
- 배경: 흰색 → 종이색 그라데이션 (`section-wrapper--white`)
- 타임라인 선·마커: `#e0e0e0`
- 카운터 숫자·이벤트 라벨: 카멜 `#B8956A`
- 텍스트 하이라이트: `#fff9c4`
- 이미지 모달: `rgba(0, 0, 0, 0.85)` 오버레이 + `0 8px 32px rgba(0, 0, 0, 0.5)` 이미지 그림자
  (갤러리 라이트박스와 값이 **다르다**. 둘은 별개 컴포넌트다)

#### Gallery
- 배경: 투명
- 라이트박스 배경: `rgba(16, 26, 40, 0.94)` — 네이비 쪽으로 기운 어둠
- 라이트박스 이미지: `border-radius: 6px` + `0 12px 40px rgba(0, 0, 0, 0.45)`

#### Directions
- 배경: 투명
- 노선 표식(12px 원): 지하철 2호선·지선 `#4CAF50`, 간선 `#4A90E2`, 광역 `#F44336`
- 주소 복사 버튼 호버: `#C9A77C` 텍스트 + `rgba(201, 167, 124, 0.1)` 배경

#### RSVP
- 배경: 흰색 → 종이색 그라데이션
- 버튼: 투명 바탕 + `2px solid #1A2F4A`
- 입력 필드: 밑줄 `#e0e0e0` → 포커스 `#1A2F4A`
- 참석 선택 칩: 흰 바탕 → 선택 시 골드 그라데이션
- 발권 티켓: 흰 바탕 + 네이비 헤더 + 4px 골드 밑단

#### Photo Drop
- 배경: 투명
- 라벨: `#9CA3AF`
- 수하물 태그: 티켓과 동일 + 펀치홀

#### Thank You
- 배경: `#F2E9DA`
- 텍스트: `rgba(26, 47, 74, 0.65)`
- 상단 물결: `#FAF8F3`

#### Loading Screen
- 배경: `#FAF8F3`
- 텍스트 그라데이션: Navy → Gold → Beige
- 별 파티클: `rgba(201, 167, 124, 0.9)`

## 📝 참고사항

- hex는 **대문자**로 쓴다 (`#1A2F4A`). 단 회색 계열 `#333` `#666` `#999` `#e0e0e0`와
  기존 소문자 표기(`#2a3f5a`, `#f5f5f5` 등)는 그대로 유지한다.
- 투명도가 필요하면 `rgba()`를 쓴다. CSS 변수는 이 프로젝트에 **없다** — 전부 하드코딩 hex다.
- 그라데이션 방향은 `135deg`(좌상 → 우하) 또는 `90deg` / `to right`로 통일한다.
- 종이 세계 안의 그림자는 검정 `0.05` / 네이비 `0.08`이 상한이다.
  `PaperCard`의 3중 그림자(검정 `0.25 / 0.2 / 0.15`)는 규범을 벗어난 잔재이며 복사할 모범이 아니다.
- 어르신 하객이 주요 사용자다. 텍스트/배경 대비를 항상 이 기준으로 확인한다.
