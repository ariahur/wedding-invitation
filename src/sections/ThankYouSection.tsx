import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { sectionFadeInProps } from '../utils/animations';
import { renderMultilineText } from '../utils/textUtils';
import './ThankYouSection.css';

const ThankYouSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];

  return (
    <div className="section-wrapper">
      <motion.div {...sectionFadeInProps}>
        <div className="thank-you">
        <div className="thank-you__wave" aria-hidden="true" />
        <div className="thank-you__content">
          {/* Thank you message */}
          <div className="thank-you__message" lang={language}>
            <p className="thank-you__line">
              {renderMultilineText(t.thankYou.message)}
            </p>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default ThankYouSection;

