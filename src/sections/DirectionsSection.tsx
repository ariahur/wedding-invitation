import React, { useState } from 'react';
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
            <strong>{t.directions.bus.main}:</strong> 143, 146, 341, 360, 401
          </li>
          <li>
            <strong>{t.directions.bus.branch}:</strong> 2413, 3411, 3422, 4318, 11-3
          </li>
          <li>
            <strong>{t.directions.bus.express}:</strong> 9407, 6900
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
        <button 
          className="address-copy-btn"
          onClick={handleCopyAddress}
          aria-label={t.directions.copyButton}
        >
          {copied ? t.directions.copiedButton : t.directions.copyButton}
        </button>
      </div>
    </PaperCard>
  );
};

export default DirectionsSection;

