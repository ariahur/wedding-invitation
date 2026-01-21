import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './HeroBoardingPassSection.css';

const HeroBoardingPassSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];

  return (
    <div style={{ backgroundColor: '#FAF8F3' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={language}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="boarding-pass-wrapper"
          style={{ backgroundColor: '#FAF8F3' }}
        >
      <div className="boarding-pass" >
      <div className="boarding-pass__top-title">
        <span className="top-title-icon material-symbols-outlined">travel</span>
        <span className="top-title-text">{t.hero.topTitle}</span>
      </div>

      <div className="boarding-pass__accent-border"></div>

      <div className="boarding-pass__header">
        <div className="header-date">{t.hero.date}</div>
      </div>

      <div className="boarding-pass__main">
        <div className="main-top">
          <div className="main-top-left">
            <div className="airline-info">
              <div className="airline-name">{t.hero.airline}</div>
              <div className="airline-flight">
                <span className="airline-flight-label">{t.hero.flightLabel}</span>
                <span className="airline-flight-number">{t.hero.flight}</span>
              </div>
            </div>
          </div>
          <div className="main-top-right">
            <div className="class-label">CLASS</div>
            <div className="class-value">{t.hero.class}</div>
          </div>
        </div>

        <div className="main-route">
          <div className="route-origin">
            <div className="route-code">{t.hero.origin.code}</div>
            {language === 'ko' ? (
              <div className="route-city-ko">{t.hero.origin.cityKo}</div>
            ) : (
            <div className="route-city">{t.hero.origin.city}</div>
            )}
          </div>
          <div className="route-center">
            <div className="route-icon material-symbols-outlined">travel</div>
            <div className="route-separator"></div>
          </div>
          <div className="route-destination">
            <div className="route-code">{t.hero.destination.code}</div>
            {language === 'ko' ? (
              <div className="route-city-ko">{t.hero.destination.cityKo}</div>
            ) : (
            <div className="route-city">{t.hero.destination.city}</div>
            )}
          </div>
        </div>

        <div className="main-photo">
          <div className="couple-photo-container">
          <img 
              src={`${process.env.PUBLIC_URL}/couple.jpg`}
            alt="Couple"
              className="couple-photo-bg"
          />
          </div>
        </div>
      </div>

      <div className="boarding-pass__message" lang={language}>
        <h3 className="message-title">{t.hero.invitationTitle}</h3>
        <div className="message-content">
          {t.hero.message.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < t.hero.message.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="boarding-pass__couple">
        <div className="couple-groom">
          <div className="couple-line">
            {language === 'ko' 
              ? (
                <>
                  {t.hero.groom.parents.father} · {t.hero.groom.parents.mother} 의 {t.hero.groom.relationship} <strong>{t.hero.groom.name}</strong>
                </>
              )
              : (
                <>
                  <strong>{t.hero.groom.name}</strong><br />
                  <span style={{ fontWeight: 'normal' }}>Eldest Son of {t.hero.groom.parents.father} & {t.hero.groom.parents.mother}</span>
                </>
              )
            }
          </div>
        </div>
        <div className="couple-bride">
          <div className="couple-line">
            {language === 'ko'
              ? (
                <>
                  {t.hero.bride.parents.father} · {t.hero.bride.parents.mother} 의 {t.hero.bride.relationship} <strong>{t.hero.bride.name}</strong>
                </>
              )
              : (
                <>
                  <strong>{t.hero.bride.name}</strong><br />
                  <span style={{ fontWeight: 'normal' }}>Eldest Daughter of {t.hero.bride.parents.father} & {t.hero.bride.parents.mother}</span>
                </>
              )
            }
          </div>
        </div>
      </div>

      <div className="boarding-pass__details">
        <div className="detail-row">
          <div className="detail-item">
            <span className="detail-label">{t.hero.details.date}</span>
            <span className="detail-value">
              {t.hero.date} {language === 'ko' ? '토요일' : 'Saturday'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t.hero.details.time}</span>
            <span className="detail-value">
              {t.hero.time}
            </span>
          </div>
        </div>
        <div className="detail-row detail-row--column">
          <span className="detail-label">{t.hero.details.venue}</span>
          <div className="detail-value-block">
            <div>{t.directions.venue}</div>
            <div>{t.hero.details.address.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < t.hero.details.address.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}</div>
            <div>{t.hero.details.floor}</div>
          </div>
        </div>
      </div>

      <div className="boarding-pass__footer">
        <div className="footer-info">
          <span>{t.hero.footer.gate}</span>
          <span>{t.hero.footer.boarding}</span>
        </div>
        <div className="barcode">
          <div className="barcode-lines"></div>
          <div className="barcode-text">{t.hero.barcode}</div>
        </div>
      </div>
      </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroBoardingPassSection;

