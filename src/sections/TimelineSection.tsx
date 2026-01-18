import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './TimelineSection.css';

const TimelineSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollPositionRef = React.useRef(0);
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
    if (selectedImage) {
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      const scrollY = scrollPositionRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
    }
  }, [selectedImage]);

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

  const handleImageClick = (imageUrl: string) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const formatTimeString = () => {
    if (language === 'ko') {
      return (
        <>
          <span className="counter-number">{timeTogether.years}</span>년{' '}
          <span className="counter-number">{timeTogether.months}</span>개월{' '}
          <span className="counter-number">{timeTogether.days}</span>일{' '}
          <span className="counter-number">{timeTogether.hours}</span>시간{' '}
          <span className="counter-number">{timeTogether.minutes}</span>분{' '}
          <span className="counter-number">{timeTogether.seconds}</span>초
        </>
      );
    } else {
      return (
        <>
          <span className="counter-number">{timeTogether.years}</span> years{' '}
          <span className="counter-number">{timeTogether.months}</span> months{' '}
          <span className="counter-number">{timeTogether.days}</span> days<br />
          <span className="counter-number">{timeTogether.hours}</span> hours{' '}
          <span className="counter-number">{timeTogether.minutes}</span> minutes{' '}
          <span className="counter-number">{timeTogether.seconds}</span> seconds
        </>
      );
    }
  };

  return (
    <div className="section-wrapper" style={{ backgroundColor: '#FFFFFF' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="timeline">
      <h2 className="timeline__title" lang={language}>{t.timeline.title}</h2>
      
      <div className="timeline__counter">
        <div className="counter-text">
          &quot;{formatTimeString()}&quot;
        </div>
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
                    onClick={() => handleImageClick(event.image!)}
                    style={{ cursor: 'pointer' }}
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
                        onClick={() => handleImageClick(event.image!)}
                        style={{ cursor: 'pointer' }}
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
      </div>
      </motion.div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="timeline-image-modal-overlay"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="timeline-image-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="timeline-image-modal__close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <img 
                  src={selectedImage}
                  alt="Timeline event"
                  className="timeline-image-modal__image"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default TimelineSection;

