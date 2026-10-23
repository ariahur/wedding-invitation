---
name: add-section
description: 청첩장에 새 섹션(src/sections/<Name>Section.tsx + .css)을 프로젝트 규격대로 스캐폴딩한다. 템플릿 복사 → translations.ts 에 ko/en 문구 추가 → App.tsx 의 paper-container 에 삽입 → 스타일 감사 → 빌드까지 한 번에 진행한다. "섹션 추가해줘", "~ 섹션 만들어줘", "화면에 ~ 파트 넣고 싶어", "인사말/축의금/방명록/영상 섹션" 처럼 새 화면 블록을 원하는 요청이면 이름을 명시하지 않아도 이 스킬을 쓴다. 기존 섹션 안에 요소를 추가하는 것(예: RSVP 폼에 필드 추가)에는 쓰지 않는다.
---

# 새 섹션 추가

섹션 규격은 `src/sections/CLAUDE.md` 가 정본이고, 이 스킬은 그 규격을 **빠뜨리지 않고** 한 번에 적용하는 절차다.
규격에서 자주 빠지는 것은 정해져 있다: 430px 타이틀 오버라이드, `:lang(en)` 변형, `lang={language}` 속성,
`translations.ts` 의 en 쪽 누락. 아래 순서를 그대로 따르면 이 네 가지가 저절로 채워진다.

## 0. 이름 정하기

| 항목 | 규칙 | 예 |
|---|---|---|
| 컴포넌트 | PascalCase + `Section` | `GuestbookSection` |
| CSS 블록 | 케밥케이스, `Section` 없이 | `.guestbook` |
| 번역 키 | camelCase | `t.guestbook` |

세 가지가 같은 단어에서 나오게 한다. 이름이 애매하면 사용자에게 한 번 묻는다 (파일명은 나중에 바꾸기 번거롭다).

## 1. 템플릿 복사

`assets/` 의 두 파일을 복사하고 플레이스홀더를 치환한다.

```bash
SKILL=.claude/skills/add-section/assets
NAME=Guestbook      # PascalCase
BLOCK=guestbook     # 케밥케이스
KEY=guestbook       # camelCase
sed -e "s/__Name__/$NAME/g" -e "s/__block__/$BLOCK/g" -e "s/__key__/$KEY/g" \
  $SKILL/TemplateSection.tsx > src/sections/${NAME}Section.tsx
sed -e "s/__block__/$BLOCK/g" $SKILL/TemplateSection.css > src/sections/${NAME}Section.css
```

템플릿에 들어 있는 것과 왜 그런지:

- `.tsx` — `section-wrapper` > `section-divider` > `motion.div {...sectionFadeInProps}` > 블록 골격.
  `section-divider` / `section-wave` 는 `src/App.css` 소유라 섹션 CSS 에서 재정의하지 않는다.
  흰 배경 섹션이면 `section-wrapper--white` 를 붙이고 `section-wave` 주석을 푼다 (Timeline·Gallery·Directions·Rsvp 가 흰 배경이고, 아이보리 배경과 번갈아 배치하는 것이 현재 리듬이다).
- `.css` — 루트(3절), 타이틀 정본(4절), 보조문구(5절), 430px 오버라이드(6절)가 정본 값 그대로 들어 있다.
  **타이틀 블록의 값은 손대지 않는다.** 바꾸고 싶으면 전 섹션 + 정본 문서를 같이 바꾸는 별도 작업이다.
- 보조문구(`__subtitle`)나 `prefers-reduced-motion` 이 필요 없으면 해당 블록을 지운다. 빈 채로 두지 않는다.

## 2. 문구는 translations.ts 에만

컴포넌트에 문자열을 하드코딩하지 않는다. `src/data/translations.ts` 에서:

1. `Translations` 인터페이스에 `guestbook: { title: string; subtitle: string; ... }` 추가.
2. `translations.ko` 와 `translations.en` **양쪽** 에 값 추가. 한쪽만 채우면 타입 에러로 빌드가 멈춘다 — 이것이 의도된 안전장치다.
3. 영어 타이틀은 CSS 가 `uppercase` 로 바꾸므로 원문은 보통 표기로 쓴다 (`"Guestbook"`, `"GUESTBOOK"` 아님).

문구 요소마다 `lang={language}` 를 붙인다. `:lang(en)` 셀렉터(폰트·자간 변형)가 전부 이 속성에 의존한다. 템플릿의 타이틀·보조문구에는 이미 붙어 있으니, 본문에 추가하는 요소에도 같은 습관을 유지한다.

## 3. App.tsx 에 배치

`src/App.tsx` 의 `<div className="paper-container">` 안에 import 와 함께 넣는다.
위치는 사용자가 말한 곳, 말하지 않았으면 내용상 자연스러운 곳을 골라 "~ 뒤에 넣었다" 고 보고한다.
Hero / ThankYou 처럼 `paper-container` 밖에 두는 것은 상·하단 전용 예외이므로 새 섹션은 원칙적으로 안에 넣는다.

## 4. 본문 작성 시 지킬 것

- 색은 코어 5색(`#1A2F4A` `#C9A77C` `#FAF8F3` `#FFFFFF` `#E6D8C3`) → 없으면 `THEME_COLORS.md` → 거기에도 없으면 사용자에게 묻는다. 새 색을 임의로 만들지 않는다.
- 폰트는 한국어 `"Gowun Dodum", "Lora", sans-serif` / 영문 `"Lora", serif`. `Roboto` 는 티켓 라벨(작은 대문자 + letter-spacing)에만.
- 브레이크포인트는 `@media (max-width: 430px)` 하나. 미디어쿼리는 파일 끝에 모은다.
- 새 UI 요소는 종이 인쇄물(티켓·태그·스탬프·안내판)로 성립하는 형태를 우선한다 (`theme-concept.md` 4절). 파스텔·네온·강한 그림자는 컨셉 밖이다.
- 이미지는 `imageProps('<그룹>/<파일명>', sizes)` 로만 쓴다. 그룹이 새로 필요하면 `add-photos` 스킬 절차를 따른다.

## 5. 검증

```bash
node .claude/skills/audit-sections/scripts/audit-sections.mjs   # 새 섹션이 ✓ 로 나와야 한다
npm run build                                                     # 타입 + 린트 + 번들
```

감사 스크립트가 `✗` 를 내면 그 항목을 정본 값으로 맞춘다. 빌드 경고는 린트 결과이므로 무시하지 않는다.
테스트 파일은 없으므로 "테스트 통과" 를 근거로 삼지 않는다.

## 6. 보고

사용자에게 알릴 것: 만든 파일 두 개, 번역 키 이름, App.tsx 에서의 위치, 감사·빌드 결과. 커밋은 요청받았을 때만 한다.
