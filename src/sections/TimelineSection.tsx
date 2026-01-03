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
      return `${timeTogether.years} years ${timeTogether.months} months ${timeTogether.days} days ${timeTogether.hours} hours ${timeTogether.minutes} minutes ${timeTogether.seconds} seconds`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <PaperCard texture="paper2" className="timeline">
      <h2 className="timeline__title">{t.timeline.title}</h2>
      
      <div className="timeline__counter">
        <div className="counter-text">"{formatTimeString()}"</div>
      </div>

      <div className="timeline__events">
        {t.timeline.events.map((event, index) => (
          <div 
            key={index} 
            className={`timeline__event ${index % 2 === 0 ? 'timeline__event--left' : 'timeline__event--right'}`}
          >
            <div className="timeline__event-content">
              <div className="timeline__event-image">
                {event.image ? (
                  <img 
                    src={`${process.env.PUBLIC_URL}${event.image}`}
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
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">
                  {(() => {
                    const highlightPatterns = [
                      /\d+년/g,
                      /\d+ years?/g,
                      /함께한 \d+년/g,
                      /함께한 \d+ years?/g,
                      /\d+ year together/g,
                      /\d+ years together/g,
                    ];
                    const highlightWords = ['처음', 'first', '결혼해요', 'get married'];
                    
                    let text = event.description;
                    const parts: (string | JSX.Element)[] = [];
                    let lastIndex = 0;
                    
                    // Find all matches
                    const matches: Array<{ start: number; end: number; text: string }> = [];
                    
                    highlightPatterns.forEach(pattern => {
                      let match;
                      while ((match = pattern.exec(text)) !== null) {
                        matches.push({
                          start: match.index,
                          end: match.index + match[0].length,
                          text: match[0],
                        });
                      }
                    });
                    
                    highlightWords.forEach(word => {
                      const index = text.indexOf(word);
                      if (index !== -1) {
                        matches.push({
                          start: index,
                          end: index + word.length,
                          text: word,
                        });
                      }
                    });
                    
                    // Sort matches by start position
                    matches.sort((a, b) => a.start - b.start);
                    
                    // Remove overlapping matches
                    const filteredMatches: Array<{ start: number; end: number; text: string }> = [];
                    matches.forEach(match => {
                      const overlaps = filteredMatches.some(
                        existing => 
                          (match.start >= existing.start && match.start < existing.end) ||
                          (match.end > existing.start && match.end <= existing.end) ||
                          (match.start <= existing.start && match.end >= existing.end)
                      );
                      if (!overlaps) {
                        filteredMatches.push(match);
                      }
                    });
                    
                    // Build parts array
                    filteredMatches.forEach((match, i) => {
                      // Add text before match
                      if (match.start > lastIndex) {
                        parts.push(text.substring(lastIndex, match.start));
                      }
                      // Add highlighted match
                      parts.push(
                        <span key={`highlight-${i}`} className="highlight">
                          {match.text}
                        </span>
                      );
                      lastIndex = match.end;
                    });
                    
                    // Add remaining text
                    if (lastIndex < text.length) {
                      parts.push(text.substring(lastIndex));
                    }
                    
                    return parts.length > 0 ? parts : text;
                  })()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PaperCard>
    </motion.div>
  );
};

export default TimelineSection;

