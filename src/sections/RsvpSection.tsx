import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PaperCard from '../components/PaperCard/PaperCard';
import { supabase } from '../lib/supabase';
import { Attendance } from '../types/rsvp';
import './RsvpSection.css';

const rsvpSchema = z.object({
  name: z.string().min(1, '성함을 입력해주세요').max(30, '성함은 30자 이하로 입력해주세요'),
  phone: z.string().min(10, '연락처를 올바르게 입력해주세요'),
  email: z.union([
    z.string().email('올바른 이메일 형식이 아닙니다'),
    z.literal(''),
  ]).optional(),
  attendance: z.enum(['attending', 'not_attending'], {
    message: '참석 여부를 선택해주세요',
  }),
  guestCount: z.number().min(1).max(10).optional().nullable(),
  note: z.string().optional(),
  honeypot: z.string().max(0, '스팸으로 감지되었습니다'),
}).refine((data) => {
  if (data.attendance === 'attending') {
    return data.guestCount !== undefined && data.guestCount !== null && data.guestCount >= 1 && data.guestCount <= 10;
  }
  return true;
}, {
  message: '동행 인원을 입력해주세요 (1-10명)',
  path: ['guestCount'],
});

type RsvpFormData = z.infer<typeof rsvpSchema>;

const RsvpSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attendance: undefined,
      honeypot: '',
    },
  });

  const attendance = watch('attendance') as Attendance | undefined;

  const onSubmit = async (data: RsvpFormData) => {
    // Honeypot check
    if (data.honeypot) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('rsvp_responses')
        .insert([
          {
            name: data.name,
            phone: data.phone,
            email: data.email || null,
            attendance: data.attendance,
            guest_count: data.attendance === 'attending' ? data.guestCount || 1 : null,
            note: data.note || null,
          },
        ]);

      if (error) {
        throw error;
      }

      setSubmitStatus('success');
      reset({
        name: '',
        phone: '',
        email: '',
        attendance: undefined,
        guestCount: null,
        note: '',
        honeypot: '',
      });
    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
      setSubmitStatus('error');
      setErrorMessage(error?.message || '제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PaperCard texture="paper3" className="rsvp">
      <h2 className="rsvp__title">참석 여부 전달하기</h2>
      <p className="rsvp__intro">
        참석 여부를 알려주시면 소중히 준비하겠습니다
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="rsvp__form">
        {/* Honeypot field */}
        <input
          type="text"
          {...register('honeypot')}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <span className="form-icon">👤</span>
            성함
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            placeholder="홍길동"
            className={`form-input ${errors.name ? 'form-input--error' : ''}`}
          />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            <span className="form-icon">📱</span>
            연락처
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="010-0000-0000"
            className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
          />
          {errors.phone && (
            <span className="form-error">{errors.phone.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <span className="form-icon">✉️</span>
            이메일 (선택)
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder="example@email.com"
            className={`form-input ${errors.email ? 'form-input--error' : ''}`}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="form-icon">✓</span>
            참석 여부
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="attending"
                {...register('attendance')}
                className="radio-input"
              />
              <span className="radio-text">참석합니다</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="not_attending"
                {...register('attendance')}
                className="radio-input"
              />
              <span className="radio-text">참석이 어렵습니다</span>
            </label>
          </div>
          {errors.attendance && (
            <span className="form-error">{errors.attendance.message}</span>
          )}
        </div>

        {attendance === 'attending' && (
          <div className="form-group">
            <label htmlFor="guestCount" className="form-label">
              <span className="form-icon">👥</span>
              동행 인원 (본인 포함)
            </label>
            <input
              id="guestCount"
              type="number"
              min="1"
              max="10"
              {...register('guestCount', { valueAsNumber: true })}
              placeholder="1"
              className={`form-input ${errors.guestCount ? 'form-input--error' : ''}`}
            />
            {errors.guestCount && (
              <span className="form-error">{errors.guestCount.message}</span>
            )}
            <span className="form-hint">최소 1명, 최대 10명</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="note" className="form-label">
            <span className="form-icon">📝</span>
            요청사항 (선택)
          </label>
          <textarea
            id="note"
            {...register('note')}
            placeholder="음식 알러지, 휠체어 필요 등 요청사항을 입력해주세요"
            rows={4}
            className="form-textarea"
          />
        </div>

        {submitStatus === 'success' && (
          <div className="form-message form-message--success">
            제출이 완료되었습니다
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="form-message form-message--error">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="form-submit"
        >
          {isSubmitting ? '제출 중...' : '❤️ RSVP 제출하기'}
        </button>
      </form>

      <div className="rsvp__footer">
        문의: 신랑 010-1234-5678 | 신부 010-9876-5432
      </div>
    </PaperCard>
  );
};

export default RsvpSection;

