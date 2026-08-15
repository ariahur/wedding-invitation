import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { useScrollLock } from '../hooks/useScrollLock';
import { sectionFadeInProps } from '../utils/animations';
import {
  buildGalleryBlocks,
  galleryImageUrl,
  galleryImages,
  GalleryBlock,
} from '../data/gallery';
import './GallerySection.css';

const SWIPE_THRESHOLD = 48;

const GallerySection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState(1);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const blocks = useMemo(() => buildGalleryBlocks(galleryImages), []);
  const total = galleryImages.length;

  useScrollLock(openIndex !== null);

  const close = useCallback(() => setOpenIndex(null), []);

  const go = useCallback(
    (delta: number) => {
      setSwipeDirection(delta);
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + total) % total;
      });
    },
    [total]
  );

  // 라이트박스가 열려 있을 때만 키보드 조작
  useEffect(() => {
    if (openIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openIndex, close, go]);

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    // 가로 스와이프만 사진 이동으로 인정한다
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  };

  const renderTile = (index: number, className: string) => (
    <button
      key={index}
      type="button"
      className={`gallery__tile ${className}`}
      onClick={() => setOpenIndex(index)}
      aria-label={`${t.gallery.photoLabel} ${index + 1}`}
    >
      <img
        src={galleryImageUrl(galleryImages[index])}
        alt={`${t.gallery.photoLabel} ${index + 1}`}
        className="gallery__tile-image"
        loading="lazy"
        decoding="async"
      />
    </button>
  );

  const renderBlock = (block: GalleryBlock, blockIndex: number) => {
    const [first, ...rest] = block.indexes;

    return (
      <motion.div
        key={blockIndex}
        className={`gallery__block gallery__block--${block.type}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {block.type === 'feature-left' || block.type === 'feature-right' ? (
          <>
            {renderTile(first, 'gallery__tile--tall')}
            <div className="gallery__stack">
              {rest.map((index) => renderTile(index, 'gallery__tile--stacked'))}
            </div>
          </>
        ) : (
          block.indexes.map((index) => renderTile(index, ''))
        )}
      </motion.div>
    );
  };

  return (
    <div className="section-wrapper section-wrapper--white">
      <div className="section-divider"></div>
      <div className="section-wave" aria-hidden="true" />
      <motion.div {...sectionFadeInProps}>
        <div className="gallery">
          <h2 className="gallery__title" lang={language}>
            {t.gallery.title}
          </h2>
          <p className="gallery__subtitle" lang={language}>
            {t.gallery.subtitle}
          </p>

          <div className="gallery__blocks">{blocks.map(renderBlock)}</div>
        </div>
      </motion.div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {openIndex !== null && (
              <motion.div
                className="gallery-lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={close}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                role="dialog"
                aria-modal="true"
              >
                <button
                  type="button"
                  className="gallery-lightbox__close"
                  onClick={close}
                  aria-label={t.gallery.close}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <div className="gallery-lightbox__stage" onClick={(e) => e.stopPropagation()}>
                  <AnimatePresence mode="wait" initial={false} custom={swipeDirection}>
                    <motion.img
                      key={openIndex}
                      src={galleryImageUrl(galleryImages[openIndex])}
                      alt={`${t.gallery.photoLabel} ${openIndex + 1}`}
                      className="gallery-lightbox__image"
                      custom={swipeDirection}
                      initial={{ opacity: 0, x: swipeDirection * 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: swipeDirection * -40 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      draggable={false}
                    />
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  className="gallery-lightbox__nav gallery-lightbox__nav--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label={t.gallery.prev}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  type="button"
                  className="gallery-lightbox__nav gallery-lightbox__nav--next"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label={t.gallery.next}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>

                <div className="gallery-lightbox__counter">
                  {String(openIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default GallerySection;
