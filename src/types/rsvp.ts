export type Attendance = 'attending' | 'not_attending';

export interface RsvpFormData {
    name: string;
    phone: string;
    email?: string;
    attendance: Attendance;
    guestCount?: number;
    note?: string;
  }

  export interface RsvpResponse {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    attendance: Attendance;
    guest_count: number | null;
    note: string | null;
    created_at: string;
  }

  /** 발급된 탑승권 정보 (로컬 스토리지 저장 / 조회 결과 공통 형태) */
  export interface RsvpTicket {
    name: string;
    phone: string;
    email?: string;
    attendance: Attendance;
    guestCount?: number | null;
    hasChildren?: 'no' | 'yes';
    childrenAges?: string;
    note?: string;
    /** 최초 신청 시각 (ISO) */
    submittedAt?: string;
  }
