import React from 'react';
import { motion } from 'framer-motion';
import { BagTag as BagTagData } from '../../types/photoDrop';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';
import { renderMultilineText } from '../../utils/textUtils';
import { useFitText } from '../../hooks/useFitText';
import './BagTag.css';

interface BagTagProps {
  tag: BagTagData;
  /** 사진을 더 부치러 폼으로 돌아간다 */
  onAddMore: () => void;
}

const formatAccepted = (iso: string, language: 'ko' | 'en'): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';

  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return language === 'ko'
    ? `${day} ${month} ${hours}:${minutes}`
    : `${day} ${month} ${hours}:${minutes}`;
};

/**
 * 사진 접수 완료 후 발급되는 수하물 태그.
 * 탑승권(RsvpTicket)과 같은 조판을 쓰되 세로로 긴 태그 형태로 보여준다.
 */
const BagTag: React.FC<BagTagProps> = ({ tag, onAddMore }) => {
  const language = useLanguage();
  const t = translations[language];
  const tagText = t.photoDrop.tag;
  // 태그 번호는 어떤 기기/글자 크기에서도 한 줄에 들어가도록 폭에 맞춰 축소한다
  const tagNoRef = useFitText<HTMLDivElement>(tag.tagNo, { max: 24, min: 12 });

  return (
    <motion.div
      className="bag-tag-area"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="bag-tag">
        <div className="bag-tag__hole" aria-hidden="true" />

        <div className="bag-tag__header">
          <div className="bag-tag__header-top">
            <span className="bag-tag__label">{tagText.label}</span>
            <span className="bag-tag__status">{tagText.status}</span>
          </div>
          <div className="bag-tag__number" ref={tagNoRef}>
            {tag.tagNo}
          </div>
          <div className="bag-tag__route">
            <span className="bag-tag__route-code">{t.hero.origin.code}</span>
            <span className="bag-tag__route-icon material-symbols-outlined">luggage</span>
            <span className="bag-tag__route-code">{t.hero.destination.code}</span>
          </div>
        </div>

        <div className="bag-tag__body">
          <div className="bag-tag__grid">
            <div className="bag-tag__field">
              <span className="bag-tag__field-label">{tagText.passenger}</span>
              <span className="bag-tag__field-value" lang={language}>
                {tag.name}
              </span>
            </div>
            <div className="bag-tag__field">
              <span className="bag-tag__field-label">{tagText.items}</span>
              <span className="bag-tag__field-value bag-tag__field-value--mono">
                {tag.photoCount} {tagText.itemsUnit}
              </span>
            </div>
            <div className="bag-tag__field">
              <span className="bag-tag__field-label">{tagText.accepted}</span>
              <span className="bag-tag__field-value bag-tag__field-value--mono">
                {formatAccepted(tag.acceptedAt, language)}
              </span>
            </div>
            <div className="bag-tag__field">
              <span className="bag-tag__field-label">{tagText.flight}</span>
              <span className="bag-tag__field-value bag-tag__field-value--mono">
                {t.hero.flight}
              </span>
            </div>
          </div>

          <div className="bag-tag__perforation" aria-hidden="true" />

          <div className="bag-tag__barcode">
            <div className="bag-tag__barcode-lines" aria-hidden="true" />
            <div className="bag-tag__barcode-text">{tag.tagNo}</div>
          </div>
        </div>
      </div>

      <p className="bag-tag__message" lang={language}>
        {renderMultilineText(tagText.message)}
      </p>

      <button type="button" className="bag-tag__add-more" onClick={onAddMore} lang={language}>
        {tagText.addMore}
      </button>
    </motion.div>
  );
};

export default BagTag;
