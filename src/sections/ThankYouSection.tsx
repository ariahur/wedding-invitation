import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './ThankYouSection.css';

const ThankYouSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];

  return (
    <div className="section-wrapper" style={{ backgroundColor: '#FFFFFF' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="thank-you">
        <div 
          className="thank-you__background"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/couple2.jpeg)`
          }}
        ></div>
        <div className="thank-you__content">
          {/* 감사 메시지 */}
          <div className="thank-you__message" lang={language}>
            <p className="thank-you__line">
              {t.thankYou.message.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < t.thankYou.message.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default ThankYouSection;

