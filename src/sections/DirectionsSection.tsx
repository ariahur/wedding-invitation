import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PaperCard from '../components/PaperCard/PaperCard';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './DirectionsSection.css';

const DirectionsSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  
  const fullAddress = language === 'ko'
    ? `${t.directions.venue} ${t.directions.address} ${t.directions.floor}`
    : `${t.directions.venue} ${t.directions.address} ${t.directions.floor}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <PaperCard texture="paper2" className="directions">
      <h2 className="directions__title">{t.directions.title}</h2>

      <div className="directions__section">
        <h3 className="directions__subtitle">{t.directions.subway.title}</h3>
        <ul className="directions__list">
          <li>{t.directions.subway.line1}</li>
          <li className="directions__note">{t.directions.subway.note1}</li>
          <li className="directions__note">{t.directions.subway.note2}</li>
        </ul>
      </div>

      <div className="directions__section">
        <h3 className="directions__subtitle">{t.directions.bus.title}</h3>
        <ul className="directions__list">
          <li>
            {t.directions.bus.main}: 143, 146, 341, 360, 401
          </li>
          <li>
            {t.directions.bus.branch}: 2413, 3411, 3422, 4318, 11-3
          </li>
          <li>
            {t.directions.bus.express}: 9407, 6900
          </li>
        </ul>
      </div>

      <div className="directions__section">
        <h3 className="directions__subtitle">{t.directions.car.title}</h3>
        <ul className="directions__list">
          <li>{t.directions.car.address}</li>
          <li>{t.directions.car.parking}</li>
        </ul>
      </div>

      <div className="directions__address">
        <div className="address-content">
          <div className="address-venue">{t.directions.venue}</div>
          <div className="address-text">{t.directions.address}</div>
          <div className="address-text">{t.directions.floor}</div>
          <div className="address-text">{t.directions.tel}</div>
        </div>
        
        {/* 지도 영역 */}
        <div className="directions__map">
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
        </div>
        
        <button 
          className="address-copy-btn"
          onClick={handleCopyAddress}
          aria-label={t.directions.copyButton}
          lang={language}
        >
          {copied ? t.directions.copiedButton : t.directions.copyButton}
        </button>
      </div>
    </PaperCard>
    </motion.div>
  );
};

export default DirectionsSection;

