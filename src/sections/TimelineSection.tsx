import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
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

/** 가로 사진은 최대 280px, 430px 이하에서는 화면의 72% */
const PRINT_SIZES = '(max-width: 430px) 72vw, 280px';

/** 세로 사진은 폭을 190px 로 좁혀 높이(3:4)가 가로 사진과 크게 벌어지지 않게 한다 */
const PORTRAIT_PRINT_SIZES = '190px';

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

/** 레일 위에 놓인 사진이 살짝 어긋나 보이도록 장마다 고정 회전값을 준다 */
const PRINT_ROTATIONS = [-1.6, 1.2, -0.9, 1.5, -1.2, 1.0];

/** 이미지 키 "timeline/2013" 에서 연도를 꺼낸다 — 타임라인 점 아래 라벨용 */
const eventYear = (image: string | undefined): string => {
  const match = image?.match(/(\d{4})$/);
  return match ? match[1] : '';
};

/** 스크롤 한 단계(다음 장이 가운데로 오는 거리)를 뷰포트 높이 대비 비율로 둔다 */
const STEP_VH = 65;

/** 가운데에서 벗어난 장의 축소·흐림 정도 */
const SIDE_SCALE = 0.94;
const SIDE_OPACITY = 0.55;
/** 가운데 장이 레일에서 살짝 떠오르는 높이(px) */
const ACTIVE_LIFT = 10;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

interface StoryCardProps {
  event: TimelineEvent;
  index: number;
  language: string;
  /** 0 → count-1 로 흐르는 "현재 장" 위치 */
  position: MotionValue<number>;
  /** 첫 장만 받는다: 자기 점에서 현재 장까지 이어지는 골드 진행선의 길이(px) */
  progressWidth?: MotionValue<number>;
  onOpen: (image: string) => void;
}

/**
 * 레일 위의 장 하나: 사진 + 제목/설명 + 타임라인 점·연도 라벨.
 * 자기 차례(position ≈ index)에서 또렷하게 떠오르고, 옆으로 밀려나면 작아지며 흐려진다.
 */
const StoryCard: React.FC<StoryCardProps> = ({
  event,
  index,
  language,
  position,
  progressWidth,
  onOpen,
}) => {
  // 가운데와의 거리 0 → 1 (한 장 이상 떨어지면 1)
  const distance = useTransform(position, (t) => clamp01(Math.abs(t - index)));
  const scale = useTransform(distance, (d) => 1 - d * (1 - SIDE_SCALE));
  const opacity = useTransform(distance, (d) => 1 - d * (1 - SIDE_OPACITY));
  const y = useTransform(distance, (d) => -ACTIVE_LIFT * (1 - d));
  const dotScale = useTransform(distance, (d) => 1.4 - d * 0.4);
  const dotBackground = useTransform(distance, (d) => (d < 0.5 ? '#1A2F4A' : '#FFFFFF'));
  const labelColor = useTransform(distance, (d) => (d < 0.5 ? '#1A2F4A' : '#999999'));

  return (
    <li className="story-card">
      <motion.div className="story-card__body" style={{ scale, opacity, y }}>
        <div
          className={printClassName(event.image)}
          style={{ transform: `rotate(${PRINT_ROTATIONS[index % PRINT_ROTATIONS.length]}deg)` }}
        >
          <PrintBody event={event} onOpen={onOpen} />
        </div>
        <div className="story-chapter">
          <h3 className="story-chapter__title" lang={language}>{event.title}</h3>
          <p className="story-chapter__description" lang={language}>{event.description}</p>
        </div>
      </motion.div>
      {progressWidth && (
        <motion.span className="story-card__progress" aria-hidden="true" style={{ width: progressWidth }} />
      )}
      <span className="story-card__tick" aria-hidden="true" />
      <motion.span
        className="story-card__dot"
        aria-hidden="true"
        style={{ scale: dotScale, backgroundColor: dotBackground }}
      />
      <motion.div className="story-card__label" style={{ color: labelColor }}>
        {eventYear(event.image)}
      </motion.div>
    </li>
  );
};

interface PrintBodyProps {
  event: TimelineEvent;
  onOpen: (image: string) => void;
}

/** 사진 버튼. 스크롤 연출과 정적 레이아웃이 함께 쓴다 */
const PrintBody: React.FC<PrintBodyProps> = ({ event, onOpen }) => {
  const props = imageProps(event.image, isPortrait(event.image) ? PORTRAIT_PRINT_SIZES : PRINT_SIZES);

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
    </button>
  );
};

const TimelineSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLOListElement>(null);
  const [step, setStep] = useState(0);
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
  // 0 → count-1 : 지금 몇 번째 장이 가운데에 있는지 (소수점은 전환 중).
  // 스프링으로 살짝 늦춰 손가락을 떼도 레일이 부드럽게 따라오게 한다
  const rawPosition = useTransform(scrollYProgress, (p) => p * Math.max(count - 1, 0));
  const position = useSpring(rawPosition, { stiffness: 170, damping: 30, mass: 0.6, restDelta: 0.001 });
  // 레일을 왼쪽으로 민다: 한 장 넘어갈 때마다 (카드 폭 + 간격) 만큼
  const railX = useTransform(position, (t) => -t * step);
  // 첫 점에서 현재 장까지 이어지는 골드 진행선 (첫 장 안에 그린다)
  const progressWidth = useTransform(position, (t) => t * step);

  // 카드 폭·간격은 CSS(뷰포트)에 달려 있으므로 실제 배치에서 잰다
  useLayoutEffect(() => {
    if (reduceMotion) return;
    const measure = () => {
      const cards = railRef.current?.querySelectorAll<HTMLElement>('.story-card');
      if (!cards || cards.length < 2) return;
      setStep(cards[1].offsetLeft - cards[0].offsetLeft);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [reduceMotion, count, language]);

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
                      <div className="story-chapter__index">{eventYear(event.image)}</div>
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
            <div
              ref={trackRef}
              className="story-track"
              style={{ '--story-steps': Math.max(count - 1, 0), '--story-step-vh': STEP_VH } as React.CSSProperties}
            >
              <div className="story-stage">
                {title}
                {counter}
                <div className="story-viewport">
                  <div className="story-rail-box">
                    {/* 화면을 가로지르는 기준선. 점·라벨은 레일과 함께 움직이고 이 선만 제자리에 있다 */}
                    <span className="story-rail-box__line" aria-hidden="true" />
                    <motion.ol ref={railRef} className="story-rail" style={{ x: railX }}>
                      {events.map((event, index) => (
                        <StoryCard
                          key={index}
                          event={event}
                          index={index}
                          language={language}
                          position={position}
                          progressWidth={index === 0 ? progressWidth : undefined}
                          onOpen={handleImageClick}
                        />
                      ))}
                    </motion.ol>
                  </div>
                </div>
              </div>
            </div>
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
