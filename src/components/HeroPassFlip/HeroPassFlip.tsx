import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';
import { HERO_PASS_ELEMENT_ID, useRsvpTicket } from '../../contexts/RsvpTicketContext';
import { phoneLast4 } from '../../utils/rsvpStorage';
import { imageProps } from '../../data/images';
import './HeroPassFlip.css';

/**
 * 히어로 청첩장의 커플 사진.
 * 탑승권이 발급된 손님(이 기기에 저장/조회된 손님)에게는
 * 사진을 누르면 뒤집히며 탑승권 뒷면이 나타난다.
 */
/** 430px 컨테이너를 가로로 꽉 채우는 사진 */
const heroPhoto = imageProps('hero/hero', '(max-width: 430px) 100vw, 430px');

const HeroPassFlip: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const ticketText = t.rsvp.ticket;
  const { ticket, isPassRevealed, setPassRevealed } = useRsvpTicket();

  // 불참으로 응답한 손님에게는 발급된 탑승권이 없으므로 사진을 뒤집지 않는다
  const isAttending = ticket?.attendance === 'attending';
  const canFlip = ticket !== null && isAttending;
  const isFlipped = canFlip && isPassRevealed;

  const companions = Math.max((ticket?.guestCount || 1) - 1, 0);
  const passengerName =
    ticket && companions > 0
      ? `${ticket.name} ${ticketText.passengerSuffix.replace('{count}', String(companions))}`
      : ticket?.name ?? '';

  return (
    <div
      id={HERO_PASS_ELEMENT_ID}
      className={`hero-flip ${canFlip ? 'hero-flip--interactive' : ''}`}
    >
      <div className={`hero-flip__inner ${isFlipped ? 'hero-flip__inner--flipped' : ''}`}>
        {/* 앞면: 커플 사진 */}
        <div className="hero-flip__face hero-flip__face--front" aria-hidden={isFlipped}>
          {heroPhoto && (
            <img
              {...heroPhoto}
              alt="Couple"
              className="hero-flip__photo"
              // 첫 화면에 보이는 사진이라 지연 없이 먼저 받는다
              decoding="async"
            />
          )}
          {canFlip && (
            <button
              type="button"
              className="hero-flip__surface"
              onClick={() => setPassRevealed(true)}
              tabIndex={isFlipped ? -1 : 0}
              aria-label={t.hero.flip.toPass}
              lang={language}
            >
              <span className="hero-flip__hint">
                <span className="hero-flip__hint-icon material-symbols-outlined">touch_app</span>
                {t.hero.flip.toPass}
              </span>
            </button>
          )}
        </div>

        {/* 뒷면: 발급된 탑승권 */}
        <div className="hero-flip__face hero-flip__face--back" aria-hidden={!isFlipped}>
          {ticket && isAttending && (
            <button
              type="button"
              className="hero-flip__surface hero-flip__surface--back"
              onClick={() => setPassRevealed(false)}
              tabIndex={isFlipped ? 0 : -1}
              aria-label={t.hero.flip.toPhoto}
              lang={language}
            >
              <span className="hero-pass">
                <span className="hero-pass__top">
                  <span className="hero-pass__label">{ticketText.label}</span>
                  <span className="hero-pass__status">{ticketText.status}</span>
                </span>

                <span className="hero-pass__grid">
                  <span className="hero-pass__field hero-pass__field--wide">
                    <span className="hero-pass__field-label">{ticketText.passenger}</span>
                    <span className="hero-pass__field-value" lang={language}>
                      {passengerName}
                    </span>
                  </span>
                  <span className="hero-pass__field hero-pass__field--wide">
                    <span className="hero-pass__field-label">{ticketText.flight}</span>
                    <span className="hero-pass__field-value hero-pass__field-value--mono">
                      {ticketText.flightValue}
                    </span>
                  </span>
                  <span className="hero-pass__field hero-pass__field--wide">
                    <span className="hero-pass__field-label">{ticketText.date}</span>
                    <span className="hero-pass__field-value hero-pass__field-value--mono">
                      {ticketText.dateValue}
                    </span>
                  </span>
                  <span className="hero-pass__field">
                    <span className="hero-pass__field-label">{ticketText.boarding}</span>
                    <span className="hero-pass__field-value hero-pass__field-value--mono">
                      {ticketText.boardingValue}
                    </span>
                  </span>
                  <span className="hero-pass__field">
                    <span className="hero-pass__field-label">{ticketText.gate}</span>
                    <span className="hero-pass__field-value hero-pass__field-value--mono">
                      {ticketText.gateValue}
                    </span>
                  </span>
                </span>

                {/* 바코드는 앞면 footer 에 이미 있어 여기서는 절취선 스텁으로 마감한다 */}
                <span className="hero-pass__stub">
                  <span className="hero-pass__perforation" aria-hidden="true" />
                  <span className="hero-pass__stub-text">
                    {t.hero.airline} · {ticketText.seq}{' '}
                    {phoneLast4(ticket.phone) || '0000'}
                  </span>
                </span>
              </span>

              <span className="hero-flip__hint hero-flip__hint--back">
                <span className="hero-flip__hint-icon material-symbols-outlined">
                  flip_camera_android
                </span>
                {t.hero.flip.toPhoto}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroPassFlip;
