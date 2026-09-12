# 프로젝트 공통 규칙

기술 스택·디렉터리 설명은 `README.md` 에 있다. 이 문서는 **코드만 봐서는 알기 어렵고, 틀리면 시간을 크게 버리는 규칙**만 모은다.

## 1. 이 프로젝트는 Next.js가 아니다 — Create React App이다

가장 헷갈리는 지점이다. 루트에 Next 파일이 남아 있지만 **전부 미사용 스캐폴딩**이다.

| 실제 사용 | 잔재 (건드리지 말 것) |
|---|---|
| `src/index.tsx` (진입점) | `app/page.tsx`, `app/layout.tsx` — `create-next-app` 기본 템플릿 그대로 |
| `src/App.tsx` (라우팅: react-router) | `next.config.ts`, `next-env.d.ts` |
| `react-scripts build` → `/build` | `.next/`, `app/globals.css` |
| `api/photo.js` (Vercel 서버리스 함수, CommonJS) | |
| | `src/lib/` — 빈 디렉터리 |

규칙:
- **`app/` 아래에 코드를 추가하지 않는다.** 빌드에 포함되지 않는다.
- Next 전용 API(`next/image`, `next/font`, 서버 컴포넌트, App Router, `NEXT_PUBLIC_*`)를 쓰지 않는다.
- 라우팅은 `react-router-dom` (`/ko`, `/en`). Vercel은 `vercel.json` 의 rewrite로 `/api/` 를 뺀 모든 경로를 `index.html` 로 넘기는 SPA 배포다.
- `api/` 는 Vercel 서버리스 함수다. CRA 빌드·ESLint·tsconfig 밖에 있으므로 **CommonJS 자바스크립트**로 쓰고, 검증은 `npm run photo-api` 로 직접 띄워서 한다.

## 2. 의존성 설치는 항상 `--legacy-peer-deps`

```bash
npm install --legacy-peer-deps
```

react-scripts 5 + react-router-dom 7 조합이 peer dependency 충돌을 낸다.
`vercel.json` 의 `installCommand` / `buildCommand` 도 이 플래그를 쓴다. 플래그 없이 설치하면 로컬만 깨진 상태가 된다.

## 3. 환경변수

- **접두사는 `REACT_APP_` 만 유효하다.** CRA는 다른 이름을 번들에 넣지 않는다 (`NEXT_PUBLIC_*` 안 됨).
- CRA 환경변수는 **빌드 시점에 번들에 문자열로 박힌다.** 브라우저에서 누구나 읽을 수 있으므로
  **서버 시크릿(service role key, 비공개 API 키)을 절대 넣지 않는다.** 공개 전제 키만 허용.
- `.env` 는 `.gitignore` 에 있다 → 키를 추가했으면 **Vercel 대시보드 환경변수에도 같이 등록**해야 배포가 동작한다.

현재 코드가 실제로 읽는 값:

| 변수 | 읽는 곳 | 용도 |
|---|---|---|
| `REACT_APP_GOOGLE_SHEETS_WEB_APP_URL` | 프론트 | RSVP 저장·사진 접수 기록 (Apps Script 웹 앱) |
| `REACT_APP_PHOTO_DROP_STATUS` | 프론트 | `open` / `closed` / `archived`. 비우면 실제 날짜 기준 |
| `REACT_APP_PHOTO_UPLOAD_URL` | 프론트 | 사진 업로드 함수 주소. 비우면 `/api/photo`. 로컬 개발에서만 지정 |
| `PUBLIC_URL` | 프론트 | CRA 기본 제공 |
| `MYBOX_PAT` | `api/photo.js` (서버) | MYBOX 개인 액세스 토큰. **접두사 없음** → 번들에 안 들어감. Vercel 환경 변수 + 로컬 `.env` |
| `MYBOX_FOLDER_ID` / `MYBOX_FOLDER_NAME` | `api/photo.js` (서버) | 저장 폴더 지정 (선택) |

`.env` 의 `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`, `REACT_APP_KAKAO_MAP_API_KEY`,
`REACT_APP_GOOGLE_MAPS_API_KEY` 는 **현재 코드에서 참조되지 않는다.** 새로 쓰기 시작할 때 실제로 연결됐는지 먼저 확인할 것.

## 4. 다국어 (한/영)

- 사용자에게 보이는 문구는 **`src/data/translations.ts` 한 곳에만** 둔다. 컴포넌트에 문자열 하드코딩 금지.
- `Translations` 인터페이스에 필드를 추가하면 `translations: Record<Language, Translations>` 의 **ko / en 양쪽을 모두 채워야** 타입이 통과한다.
- 섹션에서는 `const language = useLanguage()` 로 읽고, 문구 요소에 `lang={language}` 를 붙인다.
  → CSS의 `:lang(en)` 셀렉터가 전부 이 속성에 의존한다 (`src/sections/CLAUDE.md` 2절 참고).

## 5. 이미지 파이프라인

```
assets/originals/<그룹>/  →  npm run images  →  public/<그룹>/ + src/data/imageManifest.json
```

- 원본(장당 5~7MB)은 `.gitignore` 대상이다. **저장소에 커밋하지 않고** 로컬/클라우드에 따로 보관한다.
- 코드에서는 경로를 직접 쓰지 말고 `imageProps('<그룹>/<파일명>', sizes)` / `imageGroup('<그룹>')` 을 쓴다 (`src/data/images.ts`).
- 사진을 추가·교체했으면 `npm run images` 를 다시 돌려 매니페스트를 갱신하고, 매니페스트도 함께 커밋한다.
- 갤러리 배치 순서 = 파일명 순서 (`src/data/gallery.ts`).

## 6. 검증은 `npm run build` 로 한다

- **테스트 파일이 없다.** `npm test` 는 실행할 것이 없으므로 "테스트 통과"를 근거로 삼지 않는다.
- 린트는 `react-scripts build` 가 `package.json` 의 `eslintConfig: { extends: ["react-app"] }` 설정으로 함께 돌린다.
  빌드 경고를 실제 린트 결과로 보면 된다.
- 루트의 `eslint.config.mjs` 는 **동작하지 않는다** — `eslint-config-next` 를 import 하는데 그 패키지가 설치돼 있지 않다(1절의 Next 잔재). `npx eslint` 로 검증하려 하지 말 것.
- 타입 체크는 빌드에 포함된다. 별도 `tsc --noEmit` 스크립트는 없다.

## 7. 외부 연동

- RSVP는 Google Apps Script 웹 앱으로 전송된다. 스크립트 원본은 루트 `google-apps-script.js` 이고
  **자동 배포되지 않는다** — 수정했으면 Apps Script 편집기에 붙여넣고 새 배포를 만들어야 반영된다.
  절차와 주의사항은 `GOOGLE_SHEETS_SETUP.md` 에 있다.
- 게스트 사진·영상은 **Vercel 서버리스 함수 `api/photo.js`** 가 네이버 MYBOX Open API 로 중계해 저장하고,
  Apps Script 는 접수 한 건당 `action: 'photoLog'` 로 시트 기록만 남긴다 (Google Drive 아님).
  MYBOX 저장소는 브라우저 직접 업로드(Origin 헤더)를 403 으로 막으므로 프론트에서 MYBOX 를 바로 호출하는 구조로 바꾸려 하지 말고,
  Apps Script 로 파일을 중계하는 구조로 되돌리지도 말 것 (요청마다 2~3초 기본 지연, 측정값: 1MB 사진 7.5초 vs 함수 0.8초).
  MYBOX 토큰(`mbx_pat_...`)은 Vercel 환경 변수 `MYBOX_PAT` 와 로컬 `.env` 에만 둔다. 코드·문서에 값을 적지 않는다.

## 8. Git

- 작업 브랜치는 `dev`, PR 대상은 `main`.
- 커밋·푸시는 사용자가 요청할 때만 한다.
