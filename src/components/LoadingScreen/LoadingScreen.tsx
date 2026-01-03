import React from 'react';
import { ReactTyped } from 'react-typed';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';
import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <ReactTyped
          strings={[t.loading.message]}
          typeSpeed={80}
          backSpeed={50}
          showCursor={true}
          cursorChar="|"
          className="loading-text"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;

