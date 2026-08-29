import React from 'react';
import { motion } from 'framer-motion';
import { RsvpTicket as RsvpTicketData } from '../../types/rsvp';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';
import { TicketVariant } from '../../contexts/RsvpTicketContext';
import './RsvpIssuedPanel.css';

interface RsvpIssuedPanelProps {
  ticket: RsvpTicketData;
  variant: TicketVariant;
  /** 히어로 사진을 뒤집어 탑승권을 보여준다 */
  onView: () => void;
  onEdit: () => void;
}

/**
 * 이미 탑승권이 발급된 손님에게 RSVP 섹션에서 보여주는 안내.
 * 실제 탑승권은 히어로 사진을 눌러 뒤집으면 나온다.
 */
const RsvpIssuedPanel: React.FC<RsvpIssuedPanelProps> = ({ ticket, variant, onView, onEdit }) => {
  const language = useLanguage();
  const t = translations[language];
  const panel = t.rsvp.ticket.panel;

  const isAttending = ticket.attendance === 'attending';
  const title = !isAttending
    ? panel.absentTitle
    : variant === 'issued'
      ? panel.issuedTitle
      : panel.savedTitle;

  return (
    <motion.div
      className="rsvp-issued"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <span className="rsvp-issued__label">
        {isAttending ? panel.label : t.rsvp.ticket.absent.label}
      </span>

      <h3 className="rsvp-issued__title" lang={language}>
        {title}
      </h3>

      <button type="button" className="rsvp-issued__view" onClick={onView} lang={language}>
        <span className="rsvp-issued__view-icon material-symbols-outlined">travel</span>
        {panel.viewButton}
      </button>

      <button type="button" className="rsvp-issued__edit" onClick={onEdit} lang={language}>
        {t.rsvp.ticket.editButton}
      </button>
    </motion.div>
  );
};

export default RsvpIssuedPanel;
