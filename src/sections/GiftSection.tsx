import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, GiftAccount, GiftSide } from '../data/translations';
import { sectionFadeInProps } from '../utils/animations';
import './GiftSection.css';

/** 복사 완료 표시가 유지되는 시간 (ms) */
const COPIED_RESET_MS = 2000;

interface AccountRowProps {
  account: GiftAccount;
  copyLabel: string;
  copiedLabel: string;
  language: string;
}

const AccountRow: React.FC<AccountRowProps> = ({ account, copyLabel, copiedLabel, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${account.bank} ${account.account}`);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="gift__account">
      <div className="gift__holder" lang={language}>
        <span className="gift__role">{account.role}</span>
        <span className="gift__name">{account.name}</span>
      </div>
      <div className="gift__number" lang={language}>
        <span className="gift__bank">{account.bank}</span>
        <span className="gift__digits">{account.account}</span>
      </div>
      <button
        type="button"
        className={`gift__copy${copied ? ' gift__copy--done' : ''}`}
        onClick={handleCopy}
        aria-live="polite"
        lang={language}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {copied ? 'check' : 'content_copy'}
        </span>
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
};

interface SidePanelProps {
  side: GiftSide;
  copyLabel: string;
  copiedLabel: string;
  language: string;
  reduceMotion: boolean;
}

/** 접었다 펴는 묶음 하나 (신랑측 / 신부측). 처음에는 접힌 상태 */
const SidePanel: React.FC<SidePanelProps> = ({ side, copyLabel, copiedLabel, language, reduceMotion }) => {
  const [open, setOpen] = useState(false);
  const panelId = `gift-panel-${side.label}`;

  return (
    <div className={`gift__side${open ? ' gift__side--open' : ''}`}>
      <button
        type="button"
        className="gift__side-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        lang={language}
      >
        <span className="gift__side-label">{side.label}</span>
        <span className="material-symbols-outlined gift__side-chevron" aria-hidden="true">
          expand_more
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className="gift__side-body"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="gift__side-inner">
              {side.accounts.map((account) => (
                <AccountRow
                  key={`${account.name}-${account.account}`}
                  account={account}
                  copyLabel={copyLabel}
                  copiedLabel={copiedLabel}
                  language={language}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GiftSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const reduceMotion = useReducedMotion() ?? false;

  // 계좌 안내는 국문 청첩장에서만 보여준다
  if (language !== 'ko') return null;

  return (
    <div className="section-wrapper section-wrapper--white">
      <div className="section-divider"></div>
      <div className="section-wave" aria-hidden="true" />
      <motion.div {...sectionFadeInProps}>
        <div className="gift">
          <h2 className="gift__title" lang={language}>
            {t.gift.title}
          </h2>
          <p className="gift__subtitle" lang={language}>
            {t.gift.subtitle}
          </p>

          <div className="gift__sides">
            {t.gift.sides.map((side) => (
              <SidePanel
                key={side.label}
                side={side}
                copyLabel={t.gift.copyButton}
                copiedLabel={t.gift.copiedButton}
                language={language}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GiftSection;
