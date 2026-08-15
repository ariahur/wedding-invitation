import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { sectionFadeInProps } from '../utils/animations';
import { renderMultilineText } from '../utils/textUtils';
import { singleSrc } from '../data/images';
import './ThankYouSection.css';

// CSS background라 srcset을 못 쓴다. 430px 컨테이너를 채울 한 장만 고른다.
const BACKGROUND_URL = singleSrc('footer/footer-couple', 960);

const ThankYouSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];

  return (
    <div className="section-wrapper">
      <motion.div {...sectionFadeInProps}>
        <div className="thank-you">
        <div
          className="thank-you__background"
          style={{
            backgroundImage: `url(${BACKGROUND_URL})`,
          }}
        />
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

