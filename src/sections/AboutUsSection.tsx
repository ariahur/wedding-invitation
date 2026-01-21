import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './AboutUsSection.css';

const AboutUsSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (isContactModalOpen) {
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      const scrollY = scrollPositionRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
    }
  }, [isContactModalOpen]);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsContactModalOpen(false);
  };

  const handlePhoneClick = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  return (
    <div className="section-wrapper" style={{ backgroundColor: '#F0E8DC' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="about-us">
          <h2 className="about-us__title" lang={language}>{t.aboutUs.title}</h2>
          
          <div className="about-us__cards">
            {/* 신랑 카드 */}
            <div className="about-us__card">
              {t.aboutUs.groom.image ? (
                <>
                  <div className="about-us__photo">
                    <img 
                      src={t.aboutUs.groom.image}
                      alt={t.aboutUs.groom.name}
                      className="about-us__photo-img"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const photoDiv = target.parentElement;
                        const placeholder = photoDiv?.parentElement?.querySelector('.about-us__photo-placeholder') as HTMLElement;
                        if (photoDiv) photoDiv.style.display = 'none';
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                  </div>
                  <div className="about-us__photo-placeholder" style={{ display: 'none' }}>
                    <span className="about-us__photo-emoji">{t.aboutUs.groom.emoji}</span>
                  </div>
                </>
              ) : (
                <div className="about-us__photo-placeholder">
                  <span className="about-us__photo-emoji">{t.aboutUs.groom.emoji}</span>
                </div>
              )}
              <div className="about-us__info">
                <h3 className="about-us__name">
                  <span className="about-us__name-label">{t.aboutUs.groom.nameLabel}</span>
                  <span className="about-us__name-text">{t.aboutUs.groom.name}</span>
                </h3>
                <p className="about-us__keyword">{t.aboutUs.groom.keyword}</p>
                <p className="about-us__birth">{t.aboutUs.groom.birth}</p>
                <p className="about-us__description">
                  {t.aboutUs.groom.description.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < t.aboutUs.groom.description.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>

            {/* 신부 카드 */}
            <div className="about-us__card">
              {t.aboutUs.bride.image ? (
                <>
                  <div className="about-us__photo">
                    <img 
                      src={t.aboutUs.bride.image}
                      alt={t.aboutUs.bride.name}
                      className="about-us__photo-img"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const photoDiv = target.parentElement;
                        const placeholder = photoDiv?.parentElement?.querySelector('.about-us__photo-placeholder') as HTMLElement;
                        if (photoDiv) photoDiv.style.display = 'none';
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                  </div>
                  <div className="about-us__photo-placeholder" style={{ display: 'none' }}>
                    <span className="about-us__photo-emoji">{t.aboutUs.bride.emoji}</span>
                  </div>
                </>
              ) : (
                <div className="about-us__photo-placeholder">
                  <span className="about-us__photo-emoji">{t.aboutUs.bride.emoji}</span>
                </div>
              )}
              <div className="about-us__info">
                <h3 className="about-us__name">
                  <span className="about-us__name-label">{t.aboutUs.bride.nameLabel}</span>
                  <span className="about-us__name-text">{t.aboutUs.bride.name}</span>
                </h3>
                <p className="about-us__keyword">{t.aboutUs.bride.keyword}</p>
                <p className="about-us__birth">{t.aboutUs.bride.birth}</p>
                <p className="about-us__description">
                  {t.aboutUs.bride.description.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < t.aboutUs.bride.description.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className="about-us__contact-button-wrapper">
            <button 
              className="about-us__contact-button"
              onClick={handleContactClick}
            >
              {t.aboutUs.contactButton}
            </button>
          </div>
        </div>
      </motion.div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isContactModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="contact-modal-overlay"
              onClick={handleCloseModal}
            >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="contact-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="contact-modal__close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <h2 className="contact-modal__title" lang={language}>
                {language === 'ko' ? t.aboutUs.contactModal.titleKo : t.aboutUs.contactModal.title}
              </h2>

              <div className="contact-modal__sections">
                {/* 신랑측 */}
                <div className="contact-modal__section">
                  <h3 className="contact-modal__section-title" lang={language}>
                    {t.aboutUs.contactModal.groom.label}
                  </h3>
                  
                  <div className="contact-modal__list">
                    <div className="contact-modal__item">
                      <span className="contact-modal__item-label" lang={language}>{t.aboutUs.contactModal.groom.labels.groom}</span>
                      <span className="contact-modal__item-name" lang={language}>{t.aboutUs.contactModal.groom.groom.name}</span>
                      <div className="contact-modal__item-actions">
                        <button 
                          className="contact-modal__action-button"
                          onClick={() => handlePhoneClick(t.aboutUs.contactModal.groom.groom.phone)}
                          aria-label="Call"
                        >
                          <span className="material-symbols-outlined">call</span>
                        </button>
                      </div>
                    </div>

                    <div className="contact-modal__item">
                      <span className="contact-modal__item-label" lang={language}>{t.aboutUs.contactModal.groom.labels.father}</span>
                      <span className="contact-modal__item-name" lang={language}>{t.aboutUs.contactModal.groom.father.name}</span>
                      <div className="contact-modal__item-actions">
                        <button 
                          className="contact-modal__action-button"
                          onClick={() => handlePhoneClick(t.aboutUs.contactModal.groom.father.phone)}
                          aria-label="Call"
                        >
                          <span className="material-symbols-outlined">call</span>
                        </button>
                      </div>
                    </div>

                    <div className="contact-modal__item">
                      <span className="contact-modal__item-label" lang={language}>{t.aboutUs.contactModal.groom.labels.mother}</span>
                      <span className="contact-modal__item-name" lang={language}>{t.aboutUs.contactModal.groom.mother.name}</span>
                      <div className="contact-modal__item-actions">
                        <button 
                          className="contact-modal__action-button"
                          onClick={() => handlePhoneClick(t.aboutUs.contactModal.groom.mother.phone)}
                          aria-label="Call"
                        >
                          <span className="material-symbols-outlined">call</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 신부측 */}
                <div className="contact-modal__section">
                  <h3 className="contact-modal__section-title" lang={language}>
                    {t.aboutUs.contactModal.bride.label}
                  </h3>
                  
                  <div className="contact-modal__list">
                    <div className="contact-modal__item">
                      <span className="contact-modal__item-label" lang={language}>{t.aboutUs.contactModal.bride.labels.bride}</span>
                      <span className="contact-modal__item-name" lang={language}>{t.aboutUs.contactModal.bride.bride.name}</span>
                      <div className="contact-modal__item-actions">
                        <button 
                          className="contact-modal__action-button"
                          onClick={() => handlePhoneClick(t.aboutUs.contactModal.bride.bride.phone)}
                          aria-label="Call"
                        >
                          <span className="material-symbols-outlined">call</span>
                        </button>
                      </div>
                    </div>

                    <div className="contact-modal__item">
                      <span className="contact-modal__item-label" lang={language}>{t.aboutUs.contactModal.bride.labels.father}</span>
                      <span className="contact-modal__item-name" lang={language}>{t.aboutUs.contactModal.bride.father.name}</span>
                      <div className="contact-modal__item-actions">
                        <button 
                          className="contact-modal__action-button"
                          onClick={() => handlePhoneClick(t.aboutUs.contactModal.bride.father.phone)}
                          aria-label="Call"
                        >
                          <span className="material-symbols-outlined">call</span>
                        </button>
                      </div>
                    </div>

                    <div className="contact-modal__item">
                      <span className="contact-modal__item-label" lang={language}>{t.aboutUs.contactModal.bride.labels.mother}</span>
                      <span className="contact-modal__item-name" lang={language}>{t.aboutUs.contactModal.bride.mother.name}</span>
                      <div className="contact-modal__item-actions">
                        <button 
                          className="contact-modal__action-button"
                          onClick={() => handlePhoneClick(t.aboutUs.contactModal.bride.mother.phone)}
                          aria-label="Call"
                        >
                          <span className="material-symbols-outlined">call</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </div>
  );
};

export default AboutUsSection;
