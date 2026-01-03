import React from 'react';
import { motion } from 'framer-motion';
import PaperCard from '../components/PaperCard/PaperCard';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './HeroBoardingPassSection.css';

const HeroBoardingPassSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <PaperCard texture="paper1" className="boarding-pass" >
      {/* 최상단 타이틀 */}
      <div className="boarding-pass__top-title" 
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/textures/paper1.jpg)`,
        }}>
        <span className="top-title-icon">✈</span>
        <span className="top-title-text">{t.hero.topTitle}</span>
      </div>

      {/* 상단 헤더 영역 (베이지 배경) */}
      <div className="boarding-pass__header">
        <div className="header-date">{t.hero.date}</div>
      </div>

      {/* 메인 보딩 패스 (종이 텍스처 배경) */}
      <div 
        className="boarding-pass__main"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/textures/paper1.jpg)`,
        }}
      >
        {/* 상단: 항공사 정보 */}
        <div className="main-top">
          <div className="main-top-left">
            {/* <span className="heart-icon">❤️</span> */}
            <div className="airline-info">
              <div className="airline-name">{t.hero.airline}</div>
              <div className="airline-tagline">{t.hero.tagline} <span className="small-heart">❤️</span></div>
            </div>
          </div>
          <div className="main-top-right">
            <div className="class-label">CLASS</div>
            <div className="class-value">{t.hero.class}</div>
          </div>
        </div>

        {/* 중앙: 항공편 정보 */}
        <div className="main-route">
          <div className="route-origin">
            <div className="route-code">{t.hero.origin.code}</div>
            <div className="route-city">{t.hero.origin.city}</div>
            <div className="route-city-ko">{t.hero.origin.cityKo}</div>
          </div>
          <div className="route-center">
            <div className="route-icon">✈️</div>
            <div className="route-label">{t.hero.flight}</div>
          </div>
          <div className="route-destination">
            <div className="route-code">{t.hero.destination.code}</div>
            <div className="route-city">{t.hero.destination.city}</div>
            <div className="route-city-ko">{t.hero.destination.cityKo}</div>
          </div>
        </div>

        {/* 하단: 커플 사진 */}
        <div className="main-photo">
          <img 
            src={`${process.env.PUBLIC_URL}/couple-navy.jpeg`}
            alt="Couple"
            className="couple-photo"
          />
        </div>
      </div>

      <div className="boarding-pass__couple">
        <div className="couple-groom">
          <div className="couple-name">
            {language === 'ko' 
              ? `${t.hero.groom.name} (${t.hero.groom.nameEn})`
              : t.hero.groom.nameEn
            }
          </div>
        </div>
        <div className="couple-heart">
          <img 
            src={`${process.env.PUBLIC_URL}/heart.png`}
            alt="Heart"
            className="heart-image"
          />
        </div>
        <div className="couple-bride">
          <div className="couple-name">
            {language === 'ko'
              ? `${t.hero.bride.name} (${t.hero.bride.nameEn})`
              : t.hero.bride.nameEn
            }
          </div>
        </div>
      </div>

      <div className="boarding-pass__message">
        {t.hero.message.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < t.hero.message.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
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
            <div>{t.hero.details.address}</div>
            <div>{t.hero.details.floor}</div>
            <div>{t.hero.details.tel}</div>
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
    </PaperCard>
    </motion.div>
  );
};

export default HeroBoardingPassSection;

