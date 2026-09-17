import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { sectionFadeInProps } from '../utils/animations';
import './__Name__Section.css';

const __Name__Section: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];

  return (
    /* 흰 배경 섹션이면 "section-wrapper section-wrapper--white" 로 바꾸고 section-wave 주석을 푼다 */
    <div className="section-wrapper">
      <div className="section-divider"></div>
      {/* <div className="section-wave" aria-hidden="true" /> */}
      <motion.div {...sectionFadeInProps}>
        <div className="__block__">
          <h2 className="__block____title" lang={language}>
            {t.__key__.title}
          </h2>
          <p className="__block____subtitle" lang={language}>
            {t.__key__.subtitle}
          </p>
          {/* 본문 */}
        </div>
      </motion.div>
    </div>
  );
};

export default __Name__Section;
