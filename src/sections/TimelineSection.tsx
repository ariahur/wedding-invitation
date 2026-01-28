import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { useScrollLock } from '../hooks/useScrollLock';
import { sectionFadeInProps } from '../utils/animations';
import './TimelineSection.css';

const startDate = new Date('2013-06-02T00:00:00');

const TimelineSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useScrollLock(!!selectedImage);

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
    <div className="section-wrapper section-wrapper--white">
      <div className="section-divider"></div>
      <div className="section-wave" aria-hidden="true" />
      <motion.div {...sectionFadeInProps}>
        <div className="timeline">
          <h2 className="timeline__title" lang={language}>{t.timeline.title}</h2>
      
      <div className="timeline__counter">
        <div className="counter-text">
          &quot;{formatTimeString()}&quot;
        </div>
      </div>

      <div className="timeline__events">
        {/* Timeline line - animated on scroll */}
        <motion.div 
          className="timeline__line-container"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 3, ease: "easeInOut" }}
        >
          <div className="timeline__line" />
        </motion.div>

        {t.timeline.events.map((event, index) => {
          // Odd indices (1,3,5): image left, text right
          // Even indices (2,4): image right, text left
          const isOdd = (index + 1) % 2 === 1;
          return (
          <motion.div 
            key={index} 
            className={`timeline__event ${isOdd ? 'timeline__event--left' : 'timeline__event--right'}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
              {isOdd ? (
                <>
              <div className="timeline__event-image">
                {event.image ? (
                  <img 
                    src={event.image}
                    alt={event.title}
                    className={`event-image${(event.image.includes('2013') || event.image.includes('2025')) ? ' event-image--pos-left' : ''}${event.image.includes('2018') ? ' event-image--pos-right' : ''}`}
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
                        className={`event-image${(event.image.includes('2013') || event.image.includes('2025')) ? ' event-image--pos-left' : ''}${event.image.includes('2018') ? ' event-image--pos-right' : ''}`}
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
            </motion.div>
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

