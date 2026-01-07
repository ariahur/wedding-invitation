import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import PaperCard from '../components/PaperCard/PaperCard';
import { supabase } from '../lib/supabase';
import { Attendance } from '../types/rsvp';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './RsvpSection.css';

const createRsvpSchema = (language: 'ko' | 'en') => {
  const t = translations[language].rsvp.form;
  
  return z.object({
    name: z.string().min(1, language === 'ko' ? '성함을 입력해주세요' : 'Please enter your name').max(30, language === 'ko' ? '성함은 30자 이하로 입력해주세요' : 'Name must be 30 characters or less'),
    phone: z.string().min(10, language === 'ko' ? '연락처를 올바르게 입력해주세요' : 'Please enter a valid phone number'),
    email: z.union([
      z.string().email(language === 'ko' ? '올바른 이메일 형식이 아닙니다' : 'Please enter a valid email address'),
      z.literal(''),
    ]).optional(),
    attendance: z.enum(['attending', 'not_attending'], {
      message: language === 'ko' ? '참석 여부를 선택해주세요' : 'Please select your attendance',
    }),
    guestCount: z.number().min(1).max(10).optional().nullable(),
    hasChildren: z.enum(['no', 'yes']).optional(),
    childrenAges: z.string().optional(),
    note: z.string().optional(),
    honeypot: z.string().max(0, language === 'ko' ? '스팸으로 감지되었습니다' : 'Spam detected'),
  }).refine((data) => {
    if (data.attendance === 'attending') {
      return data.guestCount !== undefined && data.guestCount !== null && data.guestCount >= 1 && data.guestCount <= 10;
    }
    return true;
  }, {
    message: language === 'ko' ? '동행 인원을 입력해주세요 (1-10명)' : 'Please enter number of guests (1-10)',
    path: ['guestCount'],
  });
};

const RsvpSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const rsvpSchema = createRsvpSchema(language);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof rsvpSchema>>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attendance: 'attending',
      hasChildren: 'no',
      honeypot: '',
    },
  });

  const attendance = watch('attendance') as Attendance | undefined;
  const hasChildren = watch('hasChildren');

  const onSubmit = async (data: z.infer<typeof rsvpSchema>) => {
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
            has_children: data.hasChildren || null,
            children_ages: data.childrenAges || null,
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
        hasChildren: undefined,
        childrenAges: '',
        note: '',
        honeypot: '',
      });
    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
      setSubmitStatus('error');
      setErrorMessage(error?.message || t.rsvp.form.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <PaperCard texture="paper3" className="rsvp">
      <h2 className="rsvp__title" lang={language}>{t.rsvp.title}</h2>
      <p className="rsvp__intro">
        {t.rsvp.intro.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < t.rsvp.intro.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
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
            {t.rsvp.form.name} <span className="form-required">*</span>
          </label>
          <div className="form-input-wrapper">
            <input
              id="name"
              type="text"
              {...register('name')}
              placeholder={language === 'ko' ? '홍길동' : 'John Doe'}
              className={`form-input ${errors.name ? 'form-input--error' : ''}`}
            />
          </div>
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            {t.rsvp.form.phone} <span className="form-required">*</span>
          </label>
          <div className="form-input-wrapper">
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder={t.rsvp.form.phonePlaceholder}
              className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
            />
          </div>
          {errors.phone && (
            <span className="form-error">{errors.phone.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            {t.rsvp.form.email} {t.rsvp.form.emailOptional}
          </label>
          <div className="form-input-wrapper">
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="example@email.com"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
            />
          </div>
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group form-group--column">
          <label className="form-label">
            {t.rsvp.form.attendance}
          </label>
          <div className="radio-group">
            <label className={`radio-label ${attendance === 'attending' ? 'radio-label--active' : ''}`}>
              <input
                type="radio"
                value="attending"
                {...register('attendance')}
                className="radio-input"
              />
              <span className="radio-icon">✓</span>
              <span className="radio-text">{t.rsvp.form.attending}</span>
            </label>
            <label className={`radio-label ${attendance === 'not_attending' ? 'radio-label--active' : ''}`}>
              <input
                type="radio"
                value="not_attending"
                {...register('attendance')}
                className="radio-input"
              />
              <span className="radio-icon">✕</span>
              <span className="radio-text">{t.rsvp.form.notAttending}</span>
            </label>
          </div>
          {errors.attendance && (
            <span className="form-error">{errors.attendance.message}</span>
          )}
        </div>

        {attendance === 'attending' && (
          <div className="form-group">
            <label htmlFor="guestCount" className="form-label">
              {t.rsvp.form.guestCount}
            </label>
            <div className="form-input-wrapper">
              <input
                id="guestCount"
                type="number"
                min="1"
                max="10"
                {...register('guestCount', { valueAsNumber: true })}
                placeholder="1"
                className={`form-input ${errors.guestCount ? 'form-input--error' : ''}`}
              />
            </div>
            {errors.guestCount && (
              <span className="form-error">{errors.guestCount.message}</span>
            )}
            <span className="form-hint">
              {t.rsvp.form.guestCountHint.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < t.rsvp.form.guestCountHint.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          </div>
        )}

        {attendance === 'attending' && (
          <div className="form-group form-group--column">
            <label className="form-label">
              {t.rsvp.form.hasChildren}
            </label>
            <div className="radio-group">
              <label className={`radio-label ${hasChildren === 'no' ? 'radio-label--active' : ''}`}>
                <input
                  type="radio"
                  value="no"
                  {...register('hasChildren')}
                  className="radio-input"
                />
                <span className="radio-icon">✕</span>
                <span className="radio-text">{t.rsvp.form.hasChildrenNo}</span>
              </label>
              <label className={`radio-label ${hasChildren === 'yes' ? 'radio-label--active' : ''}`}>
                <input
                  type="radio"
                  value="yes"
                  {...register('hasChildren')}
                  className="radio-input"
                />
                <span className="radio-icon">✓</span>
                <span className="radio-text">{t.rsvp.form.hasChildrenYes}</span>
              </label>
            </div>
            {hasChildren === 'yes' && (
              <div style={{ marginTop: '12px' }}>
                <label htmlFor="childrenAges" className="form-label" style={{ marginBottom: '8px', fontSize: '12px' }}>
                  {t.rsvp.form.childrenAges}
                </label>
                <div className="form-input-wrapper">
                  <input
                    id="childrenAges"
                    type="text"
                    {...register('childrenAges')}
                    placeholder={t.rsvp.form.childrenAgesPlaceholder}
                    className="form-input"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="form-group form-group--column">
          <label htmlFor="note" className="form-label">
            {t.rsvp.form.note}
          </label>
          <div className="form-input-wrapper">
            <textarea
              id="note"
              {...register('note')}
              placeholder={t.rsvp.form.notePlaceholder}
              rows={4}
              className="form-textarea"
            />
          </div>
        </div>

        {submitStatus === 'success' && (
          <div className="form-message form-message--success">
            {t.rsvp.form.success}
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
          lang={language}
        >
          {isSubmitting ? t.rsvp.form.submitting : t.rsvp.form.submit}
        </button>
      </form>
    </PaperCard>
    </motion.div>
  );
};

export default RsvpSection;
