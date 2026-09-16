import React from 'react';
import { motion } from 'framer-motion';
import { RsvpTicket as RsvpTicketData } from '../../types/rsvp';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';
import { renderMultilineText } from '../../utils/textUtils';
import { phoneLast4 } from '../../utils/rsvpStorage';
import './RsvpTicket.css';

interface RsvpTicketProps {
  ticket: RsvpTicketData;
  /** issued: 방금 신청 완료 / saved: 저장·조회된 탑승권 */
  variant: 'issued' | 'saved';
  onEdit: () => void;
}

const RsvpTicket: React.FC<RsvpTicketProps> = ({ ticket, variant, onEdit }) => {
  const language = useLanguage();
  const t = translations[language];
  const ticketText = t.rsvp.ticket;

  const companions = Math.max((ticket.guestCount || 1) - 1, 0);
  const passengerName =
    companions > 0
      ? `${ticket.name} ${ticketText.passengerSuffix.replace('{count}', String(companions))}`
      : ticket.name;

  const isAttending = ticket.attendance === 'attending';

  const containerProps = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  };

  if (!isAttending) {
    return (
      <motion.div className="rsvp-ticket-area" {...containerProps}>
        <div className="open-ticket">
          <div className="open-ticket__label">{ticketText.absent.label}</div>
          <div className="open-ticket__icon material-symbols-outlined">travel</div>
          <h3 className="open-ticket__title" lang={language}>
            {renderMultilineText(ticketText.absent.title.replace('{name}', ticket.name))}
          </h3>
          <p className="open-ticket__message" lang={language}>
            {renderMultilineText(ticketText.absent.message)}
          </p>
          <div className="open-ticket__divider" />
          <div className="open-ticket__footer">{ticketText.absent.footer}</div>
        </div>

        <button type="button" className="rsvp-ticket__edit" onClick={onEdit} lang={language}>
          {ticketText.editButton}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div className="rsvp-ticket-area" {...containerProps}>
      <div className="rsvp-ticket">
        <div className="rsvp-ticket__header">
          <div className="rsvp-ticket__header-top">
            <span className="rsvp-ticket__label">{ticketText.label}</span>
            <span className="rsvp-ticket__status">{ticketText.status}</span>
          </div>
          <div className="rsvp-ticket__route">
            <span className="rsvp-ticket__route-code">{t.hero.origin.code}</span>
            <span className="rsvp-ticket__route-icon material-symbols-outlined">travel</span>
            <span className="rsvp-ticket__route-code">{t.hero.destination.code}</span>
          </div>
        </div>

        <div className="rsvp-ticket__body">
          <div className="rsvp-ticket__grid">
            <div className="rsvp-ticket__field">
              <span className="rsvp-ticket__field-label">{ticketText.passenger}</span>
              <span className="rsvp-ticket__field-value" lang={language}>{passengerName}</span>
            </div>
            <div className="rsvp-ticket__field">
              <span className="rsvp-ticket__field-label">{ticketText.seats}</span>
              <span className="rsvp-ticket__field-value">{ticket.guestCount || 1}</span>
            </div>
            <div className="rsvp-ticket__field">
              <span className="rsvp-ticket__field-label">{ticketText.date}</span>
              <span className="rsvp-ticket__field-value rsvp-ticket__field-value--mono">
                {ticketText.dateValue}
              </span>
            </div>
            <div className="rsvp-ticket__field">
              <span className="rsvp-ticket__field-label">{ticketText.boarding}</span>
              <span className="rsvp-ticket__field-value rsvp-ticket__field-value--mono">
                {ticketText.boardingValue}
              </span>
            </div>
            <div className="rsvp-ticket__field">
              <span className="rsvp-ticket__field-label">{ticketText.gate}</span>
              <span className="rsvp-ticket__field-value rsvp-ticket__field-value--mono">
                {ticketText.gateValue}
              </span>
            </div>
            <div className="rsvp-ticket__field">
              <span className="rsvp-ticket__field-label">{ticketText.classLabel}</span>
              <span className="rsvp-ticket__field-value rsvp-ticket__field-value--mono">
                {ticketText.classValue}
              </span>
            </div>
          </div>

          <div className="rsvp-ticket__perforation" aria-hidden="true" />

          <div className="rsvp-ticket__barcode">
            <div className="rsvp-ticket__barcode-lines" aria-hidden="true" />
            <div className="rsvp-ticket__barcode-text">
              {t.hero.flight} · {phoneLast4(ticket.phone) || '0000'} · {t.hero.origin.code}
              <span aria-hidden="true">→</span>
              {t.hero.destination.code}
            </div>
          </div>
        </div>
      </div>

      <p className="rsvp-ticket__message" lang={language}>
        {renderMultilineText(variant === 'issued' ? ticketText.issuedMessage : ticketText.savedMessage)}
      </p>

      <button type="button" className="rsvp-ticket__edit" onClick={onEdit} lang={language}>
        {ticketText.editButton}
      </button>
    </motion.div>
  );
};

export default RsvpTicket;
