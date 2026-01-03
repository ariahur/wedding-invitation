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