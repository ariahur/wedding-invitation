import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RsvpTicket } from '../../types/rsvp';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';
import { useScrollLock } from '../../hooks/useScrollLock';
import { renderMultilineText } from '../../utils/textUtils';
import { getLookupDigits } from '../../utils/rsvpStorage';
import { lookupRsvp } from '../../utils/rsvpApi';
import './RsvpLookupModal.css';

interface RsvpLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFound: (ticket: RsvpTicket) => void;
}

const RsvpLookupModal: React.FC<RsvpLookupModalProps> = ({ isOpen, onClose, onFound }) => {
  const language = useLanguage();
  const t = translations[language];
  const lookupText = t.rsvp.lookup;

  // 한국 번호는 뒤 4자리, 호주 번호는 뒤 3자리로 조회한다
  const digits = getLookupDigits(language);

  const [name, setName] = useState('');
  const [phoneTail, setPhoneTail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useScrollLock(isOpen);

  // 모달을 닫을 때 입력값 초기화
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setPhoneTail('');
      setErrorMessage('');
      setIsSearching(false);
    }
  }, [isOpen]);

  // 언어가 바뀌면 자릿수가 달라지므로 입력값을 맞춰 자른다
  useEffect(() => {
    setPhoneTail((prev) => prev.slice(0, digits));
  }, [digits]);

  const isSubmittable = name.trim().length > 0 && phoneTail.length === digits;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isSubmittable || isSearching) return;

    setIsSearching(true);
    setErrorMessage('');

    try {
      const found = await lookupRsvp(
        language,
        { name: name.trim(), phoneTail, digits },
        lookupText.error
      );

      if (!found) {
        setErrorMessage(lookupText.notFound);
        return;
      }

      onFound(found);
    } catch (error: any) {
      console.error('Error looking up RSVP:', error);
      setErrorMessage(error?.message || lookupText.error);
    } finally {
      setIsSearching(false);
    }
  };

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="rsvp-lookup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="rsvp-lookup-modal"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="rsvp-lookup-modal__close"
              onClick={onClose}
              aria-label={lookupText.close}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="rsvp-lookup-modal__label">{lookupText.modalLabel}</div>
            <h3 className="rsvp-lookup-modal__title" lang={language}>
              {lookupText.modalTitle}
            </h3>

            <form className="rsvp-lookup-modal__form" onSubmit={handleSubmit}>
              <div className="rsvp-lookup-modal__fields">
                <input
                  type="text"
                  className="rsvp-lookup-modal__input"
                  placeholder={lookupText.namePlaceholder}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={30}
                  autoComplete="name"
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  className="rsvp-lookup-modal__input"
                  placeholder={lookupText.phonePlaceholder}
                  value={phoneTail}
                  onChange={(event) =>
                    setPhoneTail(event.target.value.replace(/\D/g, '').slice(0, digits))
                  }
                  maxLength={digits}
                  autoComplete="off"
                />
              </div>

              {errorMessage && (
                <p className="rsvp-lookup-modal__error">{renderMultilineText(errorMessage)}</p>
              )}

              <button
                type="submit"
                className="rsvp-lookup-modal__submit"
                disabled={!isSubmittable || isSearching}
                lang={language}
              >
                {isSearching ? lookupText.submitting : lookupText.submit}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default RsvpLookupModal;
