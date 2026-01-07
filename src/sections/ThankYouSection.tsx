import React from 'react';
import { motion } from 'framer-motion';
import PaperCard from '../components/PaperCard/PaperCard';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './ThankYouSection.css';

const ThankYouSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <PaperCard texture="paper3" className="thank-you">
        <div 
          className="thank-you__background"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/couple2.jpeg)`
          }}
        ></div>
        <div className="thank-you__content">
          {/* 감사 메시지 */}
          <div className="thank-you__message">
            <p className="thank-you__line">
              {language === 'ko' ? '감사합니다 ❤️' : 'Thank you ❤️'}
            </p>
          </div>
        </div>
      </PaperCard>
    </motion.div>
  );
};

export default ThankYouSection;

