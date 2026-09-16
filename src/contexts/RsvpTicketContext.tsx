import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { RsvpTicket } from '../types/rsvp';
import { loadTicket, saveTicket } from '../utils/rsvpStorage';

/** issued: 방금 신청 완료 / saved: 저장·조회된 탑승권 */
export type TicketVariant = 'issued' | 'saved';

/** 히어로 사진(탑승권 앞면)의 DOM id. "탑승권 보기"에서 스크롤 대상으로 쓴다. */
export const HERO_PASS_ELEMENT_ID = 'hero-boarding-pass-photo';

interface RsvpTicketContextValue {
  ticket: RsvpTicket | null;
  variant: TicketVariant;
  /** 탑승권 저장 + 화면 상태 갱신 */
  applyTicket: (ticket: RsvpTicket, variant: TicketVariant) => void;
  /** 히어로 사진이 뒤집혀 탑승권 면을 보여주고 있는지 */
  isPassRevealed: boolean;
  setPassRevealed: (revealed: boolean) => void;
  /** 다른 섹션에서 "탑승권 보러 가기"를 눌렀을 때: 히어로로 스크롤 + 뒤집기 */
  revealPass: () => void;
}

const RsvpTicketContext = createContext<RsvpTicketContextValue | null>(null);

export const RsvpTicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ticket, setTicket] = useState<RsvpTicket | null>(null);
  const [variant, setVariant] = useState<TicketVariant>('saved');
  const [isPassRevealed, setIsPassRevealed] = useState(false);

  // 이 기기에 저장된 탑승권이 있으면 바로 사용한다
  useEffect(() => {
    const stored = loadTicket();
    if (stored) {
      setTicket(stored);
      setVariant('saved');
    }
  }, []);

  const applyTicket = useCallback((nextTicket: RsvpTicket, nextVariant: TicketVariant) => {
    saveTicket(nextTicket);
    setTicket(nextTicket);
    setVariant(nextVariant);
  }, []);

  const setPassRevealed = useCallback((revealed: boolean) => {
    setIsPassRevealed(revealed);
  }, []);

  const revealPass = useCallback(() => {
    setIsPassRevealed(true);

    const target = document.getElementById(HERO_PASS_ELEMENT_ID);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const value = useMemo(
    () => ({ ticket, variant, applyTicket, isPassRevealed, setPassRevealed, revealPass }),
    [ticket, variant, applyTicket, isPassRevealed, setPassRevealed, revealPass]
  );

  return <RsvpTicketContext.Provider value={value}>{children}</RsvpTicketContext.Provider>;
};

export const useRsvpTicket = (): RsvpTicketContextValue => {
  const context = useContext(RsvpTicketContext);
  if (!context) {
    throw new Error('useRsvpTicket must be used within RsvpTicketProvider');
  }
  return context;
};
