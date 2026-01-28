# 모바일 청첩장 (Wedding Invitation)

Create React App + TypeScript로 구현된 모바일 청첩장 웹 애플리케이션입니다. 항공권(보딩패스) 테마의 청첩장에 로딩 화면, 우리 소개, 타임라인, 오시는 길, RSVP 응답 등이 포함됩니다.

## 기술 스택

- **React** 18.3.1
- **TypeScript**
- **Create React App** (react-scripts 5.x)
- **react-router-dom** — URL 기반 한/영 라우팅 (`/ko`, `/en`)
- **framer-motion** — 로딩·타임라인·모달 등 애니메이션
- **Supabase** — RSVP 응답 저장
- **react-hook-form** + **zod** — RSVP 폼 검증
- **CSS** — 전역·섹션별 스타일 (`.css`)

## 프로젝트 구조

```
src/
├── App.tsx                 # 라우팅, 메타 태그, 로딩/메인 전환
├── App.css
├── index.tsx
├── components/
│   ├── LoadingScreen/       # "We're getting married!" 텍스트·별 파티클 애니메이션
│   └── PaperCard/          # 종이 질감 카드 (선택 사용)
├── contexts/
│   └── LanguageContext.tsx  # 한/영 언어 상태
├── data/
│   └── translations.ts      # 한국어·영어 문구 (타임라인, RSVP, 오시는 길 등)
├── hooks/
│   └── useScrollLock.ts     # 모달 열릴 때 스크롤 잠금 커스텀 훅
├── lib/
│   └── supabase.ts          # Supabase 클라이언트
├── sections/
│   ├── HeroBoardingPassSection  # 항공권 스타일 메인(날짜, 경로, 커플 사진, 안내 문구)
│   ├── AboutUsSection          # 신랑·신부 소개, 연락처 모달(전화 링크)
│   ├── TimelineSection         # 연도별 타임라인, 이미지 클릭 시 모달
│   ├── DirectionsSection       # 장소·주소·카카오맵, 주소 복사
│   ├── RsvpSection             # 참석 여부·동행 인원 등 RSVP 폼
│   └── ThankYouSection         # 맨 하단 감사 문구·배경 사진
├── styles/
│   └── globals.css
├── types/
│   ├── rsvp.ts
│   └── language.ts
└── utils/
    ├── animations.ts          # 공통 애니메이션 설정
    ├── imageErrorHandler.ts   # 이미지 에러 핸들링 유틸리티
    └── textUtils.tsx          # 텍스트 줄바꿈 렌더링 유틸리티
```

## 정적 리소스 (public/)

- `public/about/` — 신랑·신부 프로필 사진 (`groom.jpeg`, `bride.JPG`)
- `public/timeline/` — 타임라인 이벤트 이미지 (`2013.png`, `2018.png`, `2019.png`, `2025.jpeg`, `2027.jpeg`)
- `public/couple.jpg` — 메인 보딩패스 영역 커플 사진
- `public/couple2.png` — 맨 하단(Thank You) 배경 사진
- `public/kakao-map.html` — 카카오맵 임베드용 (필요 시)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고 Supabase 정보를 넣습니다.

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase 테이블 생성

Supabase 대시보드에서 RSVP 저장용 테이블을 만듭니다.

```sql
CREATE TABLE rsvp_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  attendance TEXT NOT NULL CHECK (attendance IN ('attending', 'not_attending')),
  guest_count INTEGER,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON rsvp_responses
  FOR INSERT WITH CHECK (true);
```

### 4. 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다. 기본 라우트는 `/ko`로 리다이렉트됩니다.

## 빌드

```bash
npm run build
```

결과물은 `build/` 폴더에 생성됩니다. 정적 호스팅 예:

```bash
npx serve -s build
```

## Vercel 배포

1. [Vercel](https://vercel.com)에 로그인 후 New Project로 저장소 연결
2. **Environment Variables**에 아래 추가:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
3. 빌드·배포는 푸시 시 자동 수행 (Build Command: `npm run build`, Output: `build`)

## 주요 기능

- **로딩 화면** — "We're getting married!" 문자 애니메이션, 별 파티클, 골드·베이지 그라데이션
- **보딩패스 메인** — 항공권 스타일 레이아웃, 날짜·경로·커플 사진·안내 문구
- **한/영 전환** — URL `/ko`, `/en` 및 상단 토글로 전환, `translations.ts` 기반
- **우리 소개** — 신랑·신부 카드, 연락처 모달(전화 번호 링크)
- **타임라인** — 연도별 이벤트·이미지, 스크롤 시 선 애니메이션, 이미지 클릭 시 모달(줌 없음), 2013/2025는 왼쪽·2018은 오른쪽이 더 보이도록 `object-position` 적용, 흰색→종이색 그라데이션 배경, 상단 물결 구분선
- **오시는 길** — 장소명·주소·층 안내, 주소 복사, 카카오맵 링크, 흰색→종이색 그라데이션 배경, 상단 물결 구분선
- **RSVP** — 참석/불참, 동행 인원 등 조건부 필드, react-hook-form + zod 검증, Supabase 저장
- **감사 문구** — 맨 하단 섹션, 배경 이미지(`couple2.png`) + `background-size: cover`·`background-position: 50% 50%`
- **반응형** — 모바일 중심 (320px~430px) 레이아웃

## RSVP 폼 필드

### 필수

- **성함** — 1~30자
- **연락처** — 최소 10자리
- **참석 여부** — 참석 / 불참

### 선택

- **이메일** — 이메일 형식 검증
- **요청사항** — 자유 입력

### 조건부

- **동행 인원** — “참석” 선택 시에만 노출, 1~10명

## 코드 구조

### 공통 유틸리티
- **`hooks/useScrollLock.ts`**: 모달 열릴 때 스크롤 위치 저장/복원
- **`utils/animations.ts`**: 섹션 fade-in 애니메이션 공통 설정
- **`utils/imageErrorHandler.ts`**: 이미지 로드 실패 시 플레이스홀더 표시
- **`utils/textUtils.tsx`**: 여러 줄 텍스트 렌더링 유틸리티

### 스타일링
- 타임라인과 오시는 길 섹션은 흰색→종이색 그라데이션 배경과 상단 물결 구분선 사용
- 타임라인 선과 구분선은 회색(`#e0e0e0`)으로 통일

## 참고 문서

- [THEME_COLORS.md](./THEME_COLORS.md) — 프로젝트 테마 색상 정의·사용처
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — 화면 미노출·캐시·환경변수 등 문제 해결

## 라이선스

Private
