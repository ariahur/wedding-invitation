import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';
import './LoadingScreen.css';

// 별 파티클 타입
interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const LoadingScreen: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const message = t.loading.message;
  const [stars, setStars] = useState<Star[]>([]);

  // 별 파티클 생성 (15개)
  useEffect(() => {
    const starCount = 15;
    const newStars: Star[] = [];
    
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100, // 0-100%
        y: Math.random() * 100, // 0-100%
        size: Math.random() * 6 + 4, // 4-10px (더 크게)
        delay: Math.random() * 1.5, // 0-1.5초 지연
        duration: Math.random() * 1.5 + 2, // 2-3.5초 애니메이션
      });
    }
    
    setStars(newStars);
  }, []);
  
  // 메시지를 3줄로 분리: "We're", "getting", "married!"
  const words = message.split(' ');
  const lines = [
    words[0] || '',      // "We're"
    words[1] || '',      // "getting"
    words.slice(2).join(' ') || ''  // "married!" (나머지 단어들)
  ].filter(line => line.length > 0);

  // 모든 글자를 하나의 배열로 평탄화하되, 줄 정보 유지
  const allCharacters: Array<{ char: string; lineIndex: number; isNewLine: boolean }> = [];
  lines.forEach((line, lineIndex) => {
    line.split('').forEach((char) => {
      allCharacters.push({ char, lineIndex, isNewLine: false });
    });
    // 줄 끝에 줄바꿈 마커 추가 (마지막 줄 제외)
    if (lineIndex < lines.length - 1) {
      allCharacters.push({ char: '\n', lineIndex, isNewLine: true });
    }
  });

  // 전체 컨테이너 애니메이션 - 한 글자씩 순차적으로
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const characterVariants = {
    hidden: { 
      opacity: 0, 
      y: 15,
      rotate: -2,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
    },
  };

  return (
    <div className="loading-screen">
      {/* 별 파티클 배경 */}
      <div className="stars-container">
        <AnimatePresence>
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                scale: [0, 1.2, 1, 0.8],
              }}
              transition={{
                duration: star.duration,
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="loading-content">
        <motion.div
          className="loading-text-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allCharacters.map((item, index) => {
            if (item.isNewLine) {
              return <br key={`br-${index}`} />;
            }
            return (
              <motion.span
                key={`${item.lineIndex}-${index}`}
                className="loading-char"
                variants={characterVariants}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
                style={{
                  display: 'inline-block',
                }}
              >
                {item.char === ' ' ? '\u00A0' : item.char}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;

