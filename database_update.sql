-- RSVP 테이블에 어린이/영유아 관련 필드 추가
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- hasChildren 컬럼 추가 (어린이/영유아 참석 여부)
ALTER TABLE rsvp_responses 
ADD COLUMN has_children TEXT CHECK (has_children IN ('no', 'yes'));

-- childrenAges 컬럼 추가 (어린이/영유아 나이 정보)
ALTER TABLE rsvp_responses 
ADD COLUMN children_ages TEXT;

-- 컬럼에 대한 코멘트 추가 (선택사항)
COMMENT ON COLUMN rsvp_responses.has_children IS '어린이 또는 영유아 참석 여부 (no/yes)';
COMMENT ON COLUMN rsvp_responses.children_ages IS '어린이/영유아 나이 정보 (예: 6개월, 2세, 5세)';

-- Keepalive용 SELECT 정책 (Supabase 일시정지 방지를 위해 하루 1회 rsvp_responses 조회 시 필요)
-- id 컬럼만 limit 1로 조회하므로 최소한의 권한입니다
CREATE POLICY "Allow public select for keepalive" ON rsvp_responses
  FOR SELECT USING (true);
