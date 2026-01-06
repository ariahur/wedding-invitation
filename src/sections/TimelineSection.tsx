import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PaperCard from '../components/PaperCard/PaperCard';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './TimelineSection.css';

const TimelineSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const startDate = new Date('2013-06-02T00:00:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let diff = now.getTime() - startDate.getTime();

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      diff = diff % (1000 * 60 * 60 * 24 * 365.25);

      const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
      diff = diff % (1000 * 60 * 60 * 24 * 30.44);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff = diff % (1000 * 60 * 60 * 24);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff = diff % (1000 * 60 * 60);

      const minutes = Math.floor(diff / (1000 * 60));
      diff = diff % (1000 * 60);

      const seconds = Math.floor(diff / 1000);

      setTimeTogether({ years, months, days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeString = () => {
    if (language === 'ko') {
      return `${timeTogether.years}년 ${timeTogether.months}개월 ${timeTogether.days}일 ${timeTogether.hours}시간 ${timeTogether.minutes}분 ${timeTogether.seconds}초`;
    } else {
      return (
        <>
          {timeTogether.years} years {timeTogether.months} months {timeTogether.days} days<br />
          {timeTogether.hours} hours {timeTogether.minutes} minutes {timeTogether.seconds} seconds
        </>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <PaperCard texture="paper2" className="timeline">
      <h2 className="timeline__title">{t.timeline.title}</h2>
      
      <div className="timeline__counter">
        <div className="counter-text">"{formatTimeString()}"</div>
      </div>

      <div className="timeline__events">
        {t.timeline.events.map((event, index) => {
          // 홀수번째(1,3,5): 사진 왼쪽, 글 오른쪽
          // 짝수번째(2,4): 사진 오른쪽, 글 왼쪽
          const isOdd = (index + 1) % 2 === 1; // 홀수번째
          return (
            <div 
              key={index} 
              className={`timeline__event ${isOdd ? 'timeline__event--left' : 'timeline__event--right'}`}
            >
              {isOdd ? (
                <>
                  <div className="timeline__event-image">
                    {event.image ? (
                      <img 
                        src={event.image}
                        alt={event.title}
                        className="event-image"
                      />
                    ) : (
                      <div className="event-image-placeholder">
                        <div className="placeholder-icon">📸</div>
                        <div className="placeholder-text">{event.title}</div>
                      </div>
                    )}
                  </div>
                  <div className="timeline__event-text">
                    <div className="event-label">{event.title}</div>
                    <p className="event-description">
                      {event.description}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="timeline__event-text">
                    <div className="event-label">{event.title}</div>
                    <p className="event-description">
                      {event.description}
                    </p>
                  </div>
                  <div className="timeline__event-image">
                    {event.image ? (
                      <img 
                        src={event.image}
                        alt={event.title}
                        className="event-image"
                      />
                    ) : (
                      <div className="event-image-placeholder">
                        <div className="placeholder-icon">📸</div>
                        <div className="placeholder-text">{event.title}</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </PaperCard>
    </motion.div>
  );
};

export default TimelineSection;

