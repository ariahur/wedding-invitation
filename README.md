# 모바일 청첩장 (Wedding Invitation)

Create React App + TypeScript로 구현된 모바일 청첩장 웹 애플리케이션입니다.

## 기술 스택

- **React** 18.3.1
- **TypeScript**
- **Create React App**
- **Supabase** (데이터베이스)
- **react-hook-form** + **zod** (폼 검증)
- **CSS Modules** (스타일링)

## 프로젝트 구조

```
src/
├── app/
│   └── App.tsx              # 메인 앱 컴포넌트
├── components/
│   └── PaperCard/           # 종이 질감 카드 컴포넌트
├── sections/
│   ├── HeroBoardingPassSection.tsx  # 항공권 스타일 메인 섹션
│   ├── DirectionsSection.tsx        # 교통안내 섹션
│   └── RsvpSection.tsx              # RSVP 폼 섹션
├── lib/
│   └── supabase.ts          # Supabase 클라이언트
├── types/
│   └── rsvp.ts              # RSVP 타입 정의
└── styles/
    └── globals.css          # 전역 스타일
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase 테이블 생성

Supabase 대시보드에서 다음 SQL을 실행하여 `rsvp_responses` 테이블을 생성하세요:

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

-- RLS 정책 설정 (선택사항, 개발 단계에서는 비활성화 가능)
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 insert할 수 있도록 정책 생성
CREATE POLICY "Allow public insert" ON rsvp_responses
  FOR INSERT WITH CHECK (true);
```

### 4. 종이 질감 텍스처 이미지 추가 (선택사항)

`public/textures/` 폴더에 다음 이미지 파일을 추가하세요:
- `paper1.jpg` - Hero 섹션용
- `paper2.jpg` - Directions 섹션용
- `paper3.jpg` - RSVP 섹션용

이미지가 없어도 기본 스타일로 동작합니다.

### 5. 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 빌드

프로덕션 빌드:

```bash
npm run build
```

빌드된 파일은 `build/` 폴더에 생성됩니다.

## Vercel 배포

### 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결 또는 프로젝트 업로드

### 2. 환경변수 설정

Vercel 프로젝트 설정에서 다음 환경변수를 추가하세요:

- `REACT_APP_SUPABASE_URL`: Supabase 프로젝트 URL
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase Anon Key

**설정 경로**: Project Settings → Environment Variables

### 3. 배포

Vercel은 자동으로 배포를 진행합니다. Git에 푸시하면 자동으로 재배포됩니다.

## 주요 기능

- ✅ 항공권 스타일의 메인 청첩장 카드
- ✅ 교통안내 (지하철, 버스, 자가용)
- ✅ 주소 복사 기능
- ✅ RSVP 폼 (참석 여부, 동행 인원 등)
- ✅ 조건부 필드 (참석 시에만 동행 인원 입력)
- ✅ 폼 검증 (react-hook-form + zod)
- ✅ Supabase 데이터 저장
- ✅ 종이 질감 텍스처 배경
- ✅ 모바일 반응형 디자인 (320px ~ 430px)

## 폼 필드

### 필수 필드
- **성함**: 1-30자
- **연락처**: 최소 10자리
- **참석 여부**: 참석/불참 선택

### 선택 필드
- **이메일**: 이메일 형식 검증
- **요청사항**: 자유 입력

### 조건부 필드
- **동행 인원**: 참석 선택 시에만 표시, 1-10명 범위

## 라이선스

Private
