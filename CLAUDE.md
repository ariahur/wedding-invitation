# wedding-invitation

**Create React App(react-scripts) + TypeScript** 기반 모바일 청첩장.
Next.js가 **아니다** — 루트의 `app/`, `next.config.ts` 는 미사용 잔재다.

화면은 섹션 단위(`src/sections/*`)로 구성되고, `src/App.tsx` 의 `<PaperCard>` 안에서 순서대로 렌더링된다.
기술 스택과 디렉터리 구조는 `README.md` 참고.

## 공통 정책

아래 세 문서는 세션마다 자동으로 로드된다. 작업 전에 해당 절을 확인하고 그대로 따른다.

@.claude/rules/project-conventions.md

@.claude/rules/section-style-guide.md

@.claude/rules/theme-concept.md

특히:
- 섹션의 타이틀/간격/색상/반응형을 수정할 때는 **한 섹션만 고치지 말고 전 섹션에 동일하게** 반영한다.
- 검증은 `npm run build` 로 한다 (테스트 파일 없음, `npx eslint` 동작 안 함).
- 의존성 설치는 항상 `npm install --legacy-peer-deps`.
- 색·폰트를 새로 추가하지 않는다. 코어 팔레트 5색과 폰트 역할표는 `theme-concept.md` 참고.

## 참고 문서

- `THEME_COLORS.md` — 색상 값 전체 정본 (모든 hex·그라데이션·투명도). 요약과 사용 규칙은 `theme-concept.md`
- `GOOGLE_SHEETS_SETUP.md` — RSVP(Apps Script) 연동 설정
- `TROUBLESHOOTING.md`
