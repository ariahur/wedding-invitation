import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './DirectionsSection.css';

const DirectionsSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    const address = language === 'ko' 
      ? '서울특별시 강남구 대치동 1004-3'
      : '1004-3 Daechi-dong, Gangnam-gu, Seoul';
    
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };



  return (
    <div className="section-wrapper" style={{ backgroundColor: '#FFFFFF' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="directions">
      <h2 className="directions__title" lang={language}>{t.directions.title}</h2>

      <div className="directions__address">
        <div className="address-content">
          <div className="address-venue">
            {t.directions.venue}
            <a 
              href={`tel:${t.directions.tel.replace(/[^0-9-]/g, '')}`}
              className="address-phone-icon"
              aria-label="전화하기"
            >
              <span className="material-symbols-outlined">call</span>
            </a>
          </div>
          <div className="address-text">{t.directions.address}</div>
          <div className="address-text">{t.directions.floor}</div>
        </div>
        
        {/* 지도 영역 */}
        <div className="directions__map">
          {language === 'ko' ? (
            <iframe
              src={`${process.env.PUBLIC_URL}/kakao-map.html`}
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen
              loading="lazy"
              title="카카오맵"
            />
          ) : (
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.079789985077!2d127.06414271122055!3d37.50603622747875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca447548b6c33%3A0xe8177a2e737683a9!2sGrand%20Hill%20Convention%2C%20Seoul!5e0!3m2!1sen!2skr!4v1767444168082!5m2!1sen!2skr`}
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            />
          )}
        </div>
      </div>

      <div className="directions__section">
        <h3 className="directions__subtitle">{t.directions.subway.title}</h3>
        <ul className="directions__list">
          <li className="directions__item">
            <span className="directions__circle directions__circle--green"></span>
            {t.directions.subway.line1}
          </li>
          <li className="directions__note">{t.directions.subway.note1}</li>
          <li className="directions__note">{t.directions.subway.note2}</li>
        </ul>
      </div>

      <div className="directions__divider"></div>

      <div className="directions__section">
        <h3 className="directions__subtitle">{t.directions.bus.title}</h3>
        <ul className="directions__list">
          <li className="directions__item">
            <span className="directions__circle directions__circle--blue"></span>
            {t.directions.bus.main}: 143, 146, 341, 360, 401
          </li>
          <li className="directions__item">
            <span className="directions__circle directions__circle--green"></span>
            {t.directions.bus.branch}: 2413, 3411, 3422, 4318, 11-3
          </li>
          <li className="directions__item">
            <span className="directions__circle directions__circle--red"></span>
            {t.directions.bus.express}: 9407, 6900
          </li>
        </ul>
      </div>

      <div className="directions__divider"></div>

      <div className="directions__section">
        <h3 className="directions__subtitle">{t.directions.car.title}</h3>
        <ul className="directions__list">
          <li className="directions__navigation-item">
            <span className="directions__navigation-text">
              {t.directions.car.addressBeforeSearch}
            </span>
            <span className="directions__search-group">
              <span>{t.directions.car.addressSearch}</span>
              <button 
                onClick={handleCopyAddress}
                className="directions__copy-button"
                aria-label={copied ? t.directions.copiedButton : t.directions.copyButton}
                title={copied ? t.directions.copiedButton : t.directions.copyButton}
              >
                <span className="material-symbols-outlined">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            </span>
          </li>
          <li>{t.directions.car.parking}</li>
        </ul>
      </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DirectionsSection;

