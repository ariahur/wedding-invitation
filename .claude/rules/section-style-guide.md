# 섹션 공통 스타일 정책

`src/sections/*` 의 모든 섹션은 아래 규격을 **그대로** 따른다.
섹션을 추가하거나 수정할 때 이 문서를 먼저 확인하고, 값이 다르면 맞춘다.

## 1. 파일 / 구성 규칙

- 섹션 하나 = `src/sections/<Name>Section.tsx` + `src/sections/<Name>Section.css` 한 쌍.
- CSS는 해당 `.tsx` 상단에서 `import './<Name>Section.css'` 로만 불러온다. 전역 CSS(`src/App.css`, `app/globals.css`)에 섹션 전용 스타일을 넣지 않는다.
- 새 섹션은 `src/App.tsx` 의 `<div className="paper-container">` 안에 추가한다.
  (Hero / ThankYou는 예외 — `paper-container` 밖에 있는 상·하단 전용 섹션이다.)
- 클래스명은 BEM: 블록은 케밥케이스(`.photo-drop`), 하위는 `.photo-drop__title` 형태.

## 2. JSX 골격

```tsx
<div className="section-wrapper">          {/* 흰 배경 섹션은 "section-wrapper section-wrapper--white" */}
  <div className="section-divider"></div>
  <div className="section-wave" aria-hidden="true" />   {/* --white 일 때만 */}
  <motion.div {...sectionFadeInProps}>
    <div className="my-section">
      <h2 className="my-section__title" lang={language}>{t.mySection.title}</h2>
      ...
    </div>
  </motion.div>
</div>
```

- `section-divider` / `section-wave` 는 `src/App.css` 가 소유한다. 섹션 CSS에서 재정의 금지.
- 언어 의존 텍스트 요소에는 **반드시** `lang={language}` 를 붙인다 (`const language = useLanguage()`).
  `:lang(en)` 셀렉터가 전부 여기에 의존한다.

## 3. 섹션 루트

```css
.my-section {
  padding: 24px 20px;
  background-color: transparent;
  margin-top: 0;
}
```

배경은 `PaperCard` / `section-wrapper` 가 담당하므로 섹션 루트는 `transparent` 를 유지한다.

## 4. 섹션 타이틀 (`__title`) — 정본

**이 블록은 모든 섹션에서 값이 100% 동일해야 한다.** 하나를 바꾸면 전부 바꾼다.

```css
.my-section__title {
  font-size: 28px;
  font-weight: 400;
  color: #1A2F4A;
  margin-top: 8px;
  margin-bottom: 24px;
  padding: 12px 0;
  text-align: center;
  font-family: "Gowun Dodum", "Lora", sans-serif;
  letter-spacing: 1px;
  line-height: 1.4;
}

.my-section__title:lang(en) {
  text-transform: uppercase;
  font-size: 24px;
  letter-spacing: 3px;
  font-weight: 300;
  font-family: "Lora", serif;
}

@media (max-width: 430px) {
  .my-section__title {
    font-size: 24px;
  }

  .my-section__title:lang(en) {
    font-size: 20px;
  }
}
```

요약: **KR 28 → 24 / EN 24 → 20**. 모바일 오버라이드를 빠뜨리는 것이 과거 실제 불일치 원인이었다
(Gallery·PhotoDrop만 430px 오버라이드가 없어 다른 섹션보다 타이틀이 커 보였음).

- `<h2>` 로 마크업한다. 섹션 안쪽 소제목은 `<h3>` + `__notice-title` / `__section-title` 등 별도 클래스.
- 색상은 `#1A2F4A` 대문자 표기로 통일.

## 5. 타이틀 바로 아래 보조 문구 (`__subtitle` / `__intro`)

```css
.my-section__subtitle {
  margin: 0 0 24px;
  text-align: center;
  font-size: 12px;
  color: #999;
  line-height: 1.6;
  font-family: "Gowun Dodum", "Lora", sans-serif;
}

.my-section__subtitle:lang(en) {
  font-family: "Lora", serif;
}
```

타이틀의 `margin-bottom: 24px` 는 보조 문구가 있든 없든 그대로 둔다 (간격은 이 값으로만 조절).

## 6. 반응형

- 브레이크포인트는 **`@media (max-width: 430px)` 하나만** 사용한다. 새 브레이크포인트를 임의로 추가하지 않는다.
- 섹션 CSS 안에서 미디어쿼리는 파일 맨 아래에 모으고, 순서는
  `@media (max-width: 430px)` → `@media (prefers-reduced-motion: reduce)`.
- 모바일에서 섹션 루트 패딩을 줄일 경우 `padding: 20px` (Directions·Rsvp) 또는 `padding: 20px 16px` (AboutUs) 중 기존 값을 따른다.

## 7. 색상 / 폰트

컨셉과 코어 팔레트·폰트 역할표는 `theme-concept.md` 가 정본이다. 여기서는 섹션 작업에 필요한 것만 반복한다.

- 색상은 새로 만들지 말고 코어 5색(`#1A2F4A` / `#C9A77C` / `#FAF8F3` / `#FFFFFF` / `#E6D8C3`)에서 고른다.
  그 밖의 값이 필요하면 `THEME_COLORS.md` 에서 찾고, 새 색을 추가했으면 그 문서도 함께 갱신한다.
- 한국어 본문 `"Gowun Dodum", "Lora", sans-serif` / 영문 `"Lora", serif` 조합을 유지한다.
- `Roboto` 는 티켓/보딩패스 라벨 전용이다. 섹션 본문에 쓰지 않는다.

## 8. 수정할 때의 체크리스트

섹션 타이틀·간격·색상 등 **공통 요소**를 건드리는 요청을 받으면:

1. `grep -n "__title" src/sections/*.css` 로 전 섹션의 현재 값을 먼저 비교한다.
2. 한 섹션만 고치지 말고 8개 섹션 전체에 동일하게 반영한다.
3. 데스크톱 값과 `@media (max-width: 430px)` 값 **양쪽 모두** 확인한다.
4. `:lang(en)` 변형도 같이 확인한다.
5. 정본 값이 바뀌었으면 이 문서의 4·5절 코드 블록도 함께 수정한다.
