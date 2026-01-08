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
      {/* backgroundImage 스타일 주석처리 - 색상으로 변경 */}
      {/* style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/textures/paper1.jpg)`,
      }} */}
      <div className="boarding-pass__top-title">
        <span className="top-title-icon material-symbols-outlined">travel</span>
        <span className="top-title-text">{t.hero.topTitle}</span>
      </div>

      {/* 액센트 보더 */}
      <div className="boarding-pass__accent-border"></div>

      {/* 상단 헤더 영역 (베이지 배경) */}
      <div className="boarding-pass__header">
        <div className="header-date">{t.hero.date}</div>
      </div>

      {/* 메인 보딩 패스 (종이 텍스처 배경) */}
      {/* backgroundImage 스타일 주석처리 - 색상으로 변경 */}
      {/* style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/textures/paper1.jpg)`,
      }} */}
      <div className="boarding-pass__main">
        {/* 상단: 항공사 정보 */}
        <div className="main-top">
          <div className="main-top-left">
            {/* <span className="heart-icon">❤️</span> */}
            <div className="airline-info">
              <div className="airline-name">{t.hero.airline}</div>
              <div className="airline-flight">
                <span className="airline-flight-label">{t.hero.flightLabel}</span>
                <span className="airline-flight-number">{t.hero.flight}</span>
              </div>
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
            {language === 'ko' ? (
              <div className="route-city-ko">{t.hero.origin.cityKo}</div>
            ) : (
              <div className="route-city">{t.hero.origin.city}</div>
            )}
          </div>
          <div className="route-center">
            <div className="route-icon material-symbols-outlined">travel</div>
            <div className="route-separator"></div>
          </div>
          <div className="route-destination">
            <div className="route-code">{t.hero.destination.code}</div>
            {language === 'ko' ? (
              <div className="route-city-ko">{t.hero.destination.cityKo}</div>
            ) : (
              <div className="route-city">{t.hero.destination.city}</div>
            )}
          </div>
        </div>

        {/* 하단: 커플 이름 */}
        <div className="main-photo">
          <div className="couple-photo-container">
            <img 
              src={`${process.env.PUBLIC_URL}/couple.jpg`}
              alt="Couple"
              className="couple-photo-bg"
            />
            <div className="couple-photo-overlay"></div>
            
            {/* 스탬프 주석처리 */}
            {/* <div className="couple-stamp-container">
              <div className="couple-stamp" lang={language}>
                <svg viewBox="0 0 200 200" className="couple-stamp-svg">
                  <circle cx="100" cy="100" r="98" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="6 4" opacity="0.9" />
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.8" />
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                  
                  <text x="100" y="95" textAnchor="middle" fontSize="30" fill="#D4AF37" fontFamily="serif" fontWeight="400" letterSpacing="2">
                    {language === 'ko' ? '준용' : 'Daniel'}
                  </text>
                  <text x="100" y="110" textAnchor="middle" fontSize="22" fill="#D4AF37" fontFamily="serif" opacity="0.9">
                    &
                  </text>
                  <text x="100" y="130" textAnchor="middle" fontSize="30" fill="#D4AF37" fontFamily="serif" fontWeight="400" letterSpacing="2">
                    {language === 'ko' ? '다영' : 'Aria'}
                  </text>
                </svg>
              </div>
            </div> */}
          </div>
        </div>
        
        {/* 하단: 커플 사진 (이전 버전) */}
        {/* <div className="main-photo">
          <img 
            src={`${process.env.PUBLIC_URL}/couple-navy1.jpeg`}
            alt="Couple"
            className="couple-photo"
          />
        </div> */}
      </div>

      <div className="boarding-pass__message" lang={language}>
        <h3 className="message-title">{t.hero.invitationTitle}</h3>
        <div className="message-content">
          {t.hero.message.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < t.hero.message.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="boarding-pass__couple">
        <div className="couple-groom">
          <div className="couple-line">
            {language === 'ko' 
              ? (
                <>
                  {t.hero.groom.parents.father} · {t.hero.groom.parents.mother} 의 {t.hero.groom.relationship} <strong>{t.hero.groom.name}</strong>
                </>
              )
              : (
                <>
                  <strong>{t.hero.groom.name}</strong><br />
                  <span style={{ fontWeight: 'normal' }}>Eldest Son of {t.hero.groom.parents.father} & {t.hero.groom.parents.mother}</span>
                </>
              )
            }
          </div>
        </div>
        <div className="couple-bride">
          <div className="couple-line">
            {language === 'ko'
              ? (
                <>
                  {t.hero.bride.parents.father} · {t.hero.bride.parents.mother} 의 {t.hero.bride.relationship} <strong>{t.hero.bride.name}</strong>
                </>
              )
              : (
                <>
                  <strong>{t.hero.bride.name}</strong><br />
                  <span style={{ fontWeight: 'normal' }}>Eldest Daughter of {t.hero.bride.parents.father} & {t.hero.bride.parents.mother}</span>
                </>
              )
            }
          </div>
        </div>
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
            <div>{t.hero.details.address.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < t.hero.details.address.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}</div>
            <div>{t.hero.details.floor}</div>
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

