import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TimelineEvent } from '../data/translations';
import { useScrollLock } from '../hooks/useScrollLock';
import { sectionFadeInProps } from '../utils/animations';
import { imageProps, findImage } from '../data/images';
import './TimelineSection.css';

const startDate = new Date('2013-06-02T00:00:00');

/** 가로 인화지는 최대 300px, 430px 이하에서는 화면의 78% */
const PRINT_SIZES = '(max-width: 430px) 78vw, 300px';

/** 세로 인화지는 폭을 200px 로 좁혀 높이(3:4)가 가로 인화지와 크게 벌어지지 않게 한다 */
const PORTRAIT_PRINT_SIZES = '200px';

/** 원본이 세로로 긴 사진은 세로 인화지(3:4)로 찍는다 — 매니페스트의 원본 크기로 판별 */
const isPortrait = (image: string | undefined): boolean => {
  const found = findImage(image);
  return !!found && found.height > found.width;
};

const printClassName = (image: string | undefined, extra = ''): string =>
  `story-print${isPortrait(image) ? ' story-print--portrait' : ''}${extra}`;

/** 4:3 인화지로 잘릴 때 인물이 잘리지 않도록 사진마다 보여줄 자리를 정한다 */
const IMAGE_POSITIONS: Record<string, string> = {
  'timeline/2013': ' story-print__image--pos-left',
  'timeline/2018': ' story-print__image--pos-right',
  'timeline/2025': ' story-print__image--pos-left',
  'timeline/2027': ' story-print__image--pos-top',
};

const eventImagePosition = (image: string | undefined): string =>
  (image && IMAGE_POSITIONS[image]) ?? '';

/** 인화지가 겹칠 때 살짝 어긋나 보이도록 장마다 고정 회전값을 준다 */
const PRINT_ROTATIONS = [-2.4, 1.8, -1.2, 2.2, -1.6, 1.4];

/** 이미지 키 "timeline/2013" 에서 연도를 꺼낸다 — 인화지 하단 캡션용 */
const eventYear = (image: string | undefined): string => {
  const match = image?.match(/(\d{4})$/);
  return match ? match[1] : '';
};

/** 스크롤 한 단계(다음 인화지가 올라오는 거리)를 뷰포트 높이 대비 비율로 둔다 */
const STEP_VH = 65;

/** 인화지가 무대 아래에서 올라오기 시작하는 거리(px). 모바일 뷰포트 밖이면 충분하다 */
const ENTER_DISTANCE = 900;

/** 쌓인 인화지가 위로 밀려나는 간격(px)과 축소 비율. 네 장까지만 밀린다 */
const STACK_SHIFT = 9;
const STACK_SCALE = 0.035;
const STACK_DEPTH_MAX = 4;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

interface StoryChapterProps {
  event: TimelineEvent;
  index: number;
  chapterLabel: string;
  language: string;
  /** 0 → count-1 로 흐르는 "현재 장" 위치 */
  position: MotionValue<number>;
}

/** 무대 상단의 장 설명. 자기 차례 ±0.2 에서는 완전히 보이고 ±0.5 에서 사라진다 */
const StoryChapter: React.FC<StoryChapterProps> = ({ event, index, chapterLabel, language, position }) => {
  const opacity = useTransform(position, (t) => clamp01(1 - (Math.abs(t - index) - 0.2) / 0.3));
  const y = useTransform(position, (t) => (t - index) * -12);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? 'auto' : 'none'));

  return (
    <motion.div
      className="story-chapter"
      style={{ opacity, y, pointerEvents }}
    >
      <div className="story-chapter__index" lang={language}>
        {chapterLabel} {index + 1}
      </div>
      <h3 className="story-chapter__title" lang={language}>{event.title}</h3>
      <p className="story-chapter__description" lang={language}>{event.description}</p>
    </motion.div>
  );
};

interface StoryPrintProps {
  event: TimelineEvent;
  index: number;
  position: MotionValue<number>;
  onOpen: (image: string) => void;
}

/**
 * 인화지 한 장. 자기 차례 직전 구간(index-0.9 → index-0.2)에 아래에서 올라와 멈추고,
 * 다음 장이 올라올수록 위로 조금씩 밀리며 작아진다.
 */
const StoryPrint: React.FC<StoryPrintProps> = ({ event, index, position, onOpen }) => {
  const y = useTransform(position, (t) => {
    const arrive = index === 0 ? 1 : easeOutCubic(clamp01((t - (index - 1) - 0.1) / 0.7));
    const depth = Math.min(Math.max(0, t - index), STACK_DEPTH_MAX);
    return (1 - arrive) * ENTER_DISTANCE - depth * STACK_SHIFT;
  });
  const scale = useTransform(position, (t) => {
    const depth = Math.min(Math.max(0, t - index), STACK_DEPTH_MAX);
    return 1 - depth * STACK_SCALE;
  });
  const rotate = PRINT_ROTATIONS[index % PRINT_ROTATIONS.length];

  return (
    <motion.div
      className={printClassName(event.image)}
      style={{ y, scale, rotate, zIndex: index + 1 }}
    >
      <PrintBody event={event} onOpen={onOpen} />
    </motion.div>
  );
};

interface PrintBodyProps {
  event: TimelineEvent;
  onOpen: (image: string) => void;
}

/** 인화지 내용(사진 + 연도 캡션). 스크롤 연출과 정적 레이아웃이 함께 쓴다 */
const PrintBody: React.FC<PrintBodyProps> = ({ event, onOpen }) => {
  const props = imageProps(event.image, isPortrait(event.image) ? PORTRAIT_PRINT_SIZES : PRINT_SIZES);
  const year = eventYear(event.image);

  return (
    <button
      type="button"
      className="story-print__paper"
      onClick={() => event.image && onOpen(event.image)}
      disabled={!props}
      aria-label={event.title}
    >
      <div className="story-print__photo">
        {props ? (
          <img
            {...props}
            alt={event.title}
            className={`story-print__image${eventImagePosition(event.image)}`}
            loading="eager"
            decoding="async"
            draggable={false}
          />
        ) : (
          <div className="story-print__placeholder">
            <span className="material-symbols-outlined">photo_camera</span>
          </div>
        )}
      </div>
      <div className="story-print__caption">{year}</div>
    </button>
  );
};

const TimelineSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const events = t.timeline.events;
  const count = events.length;

  // 트랙(긴 래퍼)의 위가 화면 위에 닿을 때 0, 아래가 화면 아래에 닿을 때 1
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  // 0 → count-1 : 지금 몇 번째 장이 무대 위에 있는지 (소수점은 전환 중)
  const position = useTransform(scrollYProgress, (p) => p * Math.max(count - 1, 0));

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

  const title = <h2 className="timeline__title" lang={language}>{t.timeline.title}</h2>;

  const counter = (
    <div className="timeline__counter">
      <div className="counter-text" lang={language}>
        &quot;{formatTimeString()}&quot;
      </div>
    </div>
  );

  return (
    <div className="section-wrapper section-wrapper--white">
      <div className="section-divider"></div>
      <div className="section-wave" aria-hidden="true" />
      {/* 트랙이 화면 몇 배 높이라 기본 amount(0.15)로는 한참 뒤에야 나타난다 → 한 픽셀만 보여도 시작 */}
      <motion.div {...sectionFadeInProps} viewport={{ once: true, amount: 'some' }}>
        <div className="timeline">
          {reduceMotion ? (
            /* 움직임 줄이기: 고정 무대 없이 장 설명과 인화지를 차례로 나열한다 */
            <>
              {title}
              {counter}
              <ol className="story-list">
                {events.map((event, index) => (
                  <li key={index} className="story-list__item">
                    <div className="story-chapter">
                      <div className="story-chapter__index" lang={language}>
                        {t.timeline.chapterLabel} {index + 1}
                      </div>
                      <h3 className="story-chapter__title" lang={language}>{event.title}</h3>
                      <p className="story-chapter__description" lang={language}>{event.description}</p>
                    </div>
                    <div
                      className={printClassName(event.image, ' story-print--static')}
                      style={{ transform: `rotate(${PRINT_ROTATIONS[index % PRINT_ROTATIONS.length]}deg)` }}
                    >
                      <PrintBody event={event} onOpen={handleImageClick} />
                    </div>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <>
              <div
                ref={trackRef}
                className="story-track"
                style={{ '--story-steps': Math.max(count - 1, 0), '--story-step-vh': STEP_VH } as React.CSSProperties}
              >
                <div className="story-stage">
                  {title}
                  {counter}
                  <div className="story-chapters">
                    {events.map((event, index) => (
                      <StoryChapter
                        key={index}
                        event={event}
                        index={index}
                        chapterLabel={t.timeline.chapterLabel}
                        language={language}
                        position={position}
                      />
                    ))}
                  </div>
                  <div className="story-stack">
                    {events.map((event, index) => (
                      <StoryPrint
                        key={index}
                        event={event}
                        index={index}
                        position={position}
                        onOpen={handleImageClick}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
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
                  {...imageProps(selectedImage, '100vw')}
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
