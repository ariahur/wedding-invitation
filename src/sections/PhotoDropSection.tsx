import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BagTag as BagTagData, PhotoItem } from '../types/photoDrop';
import { useLanguage } from '../contexts/LanguageContext';
import { useRsvpTicket } from '../contexts/RsvpTicketContext';
import { translations } from '../data/translations';
import { sectionFadeInProps } from '../utils/animations';
import { renderMultilineText } from '../utils/textUtils';
import { phoneLast4 } from '../utils/rsvpStorage';
import { getCounterStatus, getDaysUntilOpen } from '../utils/photoDropSchedule';
import { buildTagNo, loadBagTag, saveBagTag } from '../utils/photoDropStorage';
import { uploadPhoto } from '../utils/photoDropApi';
import BagTag from '../components/BagTag/BagTag';
import './PhotoDropSection.css';

/** 한 번에 부칠 수 있는 사진 수 */
const MAX_PHOTOS = 10;
/** 압축 전 원본 한 장의 최대 크기 */
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const createId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const PhotoDropSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const text = t.photoDrop;
  const { ticket } = useRsvpTicket();

  const status = useMemo(() => getCounterStatus(), []);
  const daysUntilOpen = useMemo(() => getDaysUntilOpen(), []);

  const [bagTag, setBagTag] = useState<BagTagData | null>(null);
  const [isAddingMore, setIsAddingMore] = useState(false);
  const [items, setItems] = useState<PhotoItem[]>([]);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  // 언마운트 시 미리보기 URL을 정리하기 위해 최신 목록을 참조로 들고 있는다
  const itemsRef = useRef<PhotoItem[]>([]);
  itemsRef.current = items;

  // 이 기기에 이미 발급된 수하물 태그가 있으면 불러온다
  useEffect(() => {
    const stored = loadBagTag();
    if (stored) {
      setBagTag(stored);
    }
  }, []);

  useEffect(
    () => () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    },
    []
  );

  // 메시지 textarea 자동 높이 조절 (RSVP 전달사항과 동일한 동작)
  useEffect(() => {
    const textarea = messageRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [message]);

  /** 탑승권이 있으면 이름을 자동으로 채운다 */
  const ticketName = ticket?.name || '';
  const resolvedName = (ticketName || guestName).trim();

  const handleFilesSelected = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      setErrorMessage('');

      const incoming = Array.from(fileList);
      const accepted: PhotoItem[] = [];
      let rejectedSize = false;
      let rejectedType = false;

      incoming.forEach((file) => {
        if (!file.type.startsWith('image/') && !/\.(hei[cf]|jpe?g|png|webp)$/i.test(file.name)) {
          rejectedType = true;
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          rejectedSize = true;
          return;
        }
        accepted.push({
          id: createId(),
          file,
          previewUrl: URL.createObjectURL(file),
          status: 'pending',
        });
      });

      setItems((prev) => {
        const room = MAX_PHOTOS - prev.length;
        if (room <= 0) {
          setErrorMessage(text.open.tooMany.replace('{max}', String(MAX_PHOTOS)));
          accepted.forEach((item) => URL.revokeObjectURL(item.previewUrl));
          return prev;
        }

        if (accepted.length > room) {
          setErrorMessage(text.open.tooMany.replace('{max}', String(MAX_PHOTOS)));
          accepted.slice(room).forEach((item) => URL.revokeObjectURL(item.previewUrl));
        } else if (rejectedSize) {
          setErrorMessage(text.open.tooLarge);
        } else if (rejectedType) {
          setErrorMessage(text.open.invalidType);
        }

        return [...prev, ...accepted.slice(0, room)];
      });
    },
    [text.open]
  );

  const handleRemove = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleAddMore = () => {
    setIsAddingMore(true);
    setErrorMessage('');
    setUploadedCount(0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isUploading) return;

    // 봇이 채운 필드가 있으면 조용히 무시한다
    if (honeypot) return;

    if (!resolvedName) {
      setErrorMessage(text.open.needName);
      return;
    }
    if (items.length === 0) {
      setErrorMessage(text.open.noFiles);
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setUploadedCount(0);

    const acceptedAt = new Date();
    // 이미 태그가 있으면 같은 번호에 장수만 더한다
    const tagNo = bagTag?.tagNo || buildTagNo(t.hero.flight, resolvedName, acceptedAt);
    const batchId = createId();
    const meta = {
      name: resolvedName,
      phoneTail: ticket ? phoneLast4(ticket.phone) : '',
      message: message.trim(),
      batchId,
      tagNo,
    };

    let succeeded = 0;

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      setItems((prev) =>
        prev.map((entry) => (entry.id === item.id ? { ...entry, status: 'uploading' } : entry))
      );

      try {
        await uploadPhoto(language, item.file, meta, i + 1, items.length, text.open.error);
        succeeded += 1;
        setUploadedCount(succeeded);
        setItems((prev) =>
          prev.map((entry) => (entry.id === item.id ? { ...entry, status: 'done' } : entry))
        );
      } catch (error) {
        console.error('Error uploading photo:', error);
        setItems((prev) =>
          prev.map((entry) => (entry.id === item.id ? { ...entry, status: 'error' } : entry))
        );
      }
    }

    setIsUploading(false);

    if (succeeded === 0) {
      setErrorMessage(text.open.error);
      return;
    }

    const nextTag: BagTagData = {
      tagNo,
      name: resolvedName,
      photoCount: (bagTag?.photoCount || 0) + succeeded,
      acceptedAt: bagTag?.acceptedAt || acceptedAt.toISOString(),
    };
    saveBagTag(nextTag);
    setBagTag(nextTag);

    if (succeeded < items.length) {
      setErrorMessage(
        text.open.partial
          .replace('{done}', String(succeeded))
          .replace('{failed}', String(items.length - succeeded))
      );
    }

    // 성공한 항목만 정리하고 실패분은 남겨 다시 시도할 수 있게 한다
    setItems((prev) => {
      prev.filter((entry) => entry.status === 'done').forEach((entry) => URL.revokeObjectURL(entry.previewUrl));
      return prev.filter((entry) => entry.status === 'error');
    });
    setMessage('');
    setIsAddingMore(false);
  };

  const renderClosed = (copy: { label: string; title: string; message: string }, extra?: string) => (
    <div className="photo-drop__notice">
      <span className="photo-drop__notice-label">{copy.label}</span>
      <span className="photo-drop__notice-icon material-symbols-outlined">luggage</span>
      <h3 className="photo-drop__notice-title" lang={language}>
        {renderMultilineText(copy.title)}
      </h3>
      <p className="photo-drop__notice-message" lang={language}>
        {renderMultilineText(copy.message)}
      </p>
      {extra && <div className="photo-drop__countdown">{extra}</div>}
    </div>
  );

  const showTag = bagTag !== null && !isAddingMore;

  const renderBody = () => {
    if (status === 'closed') {
      return renderClosed(
        text.closed,
        daysUntilOpen > 0 ? text.closed.countdown.replace('{days}', String(daysUntilOpen)) : undefined
      );
    }

    if (status === 'archived') {
      return renderClosed(text.archived);
    }

    if (showTag) {
      return <BagTag key="tag" tag={bagTag} onAddMore={handleAddMore} />;
    }

    return (
      <motion.form
        key="form"
        className="photo-drop__form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Honeypot field */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        {ticketName ? (
          <div className="photo-drop__passenger">
            <span className="photo-drop__passenger-label">{text.open.label}</span>
            <span className="photo-drop__passenger-name" lang={language}>
              {text.open.passengerPrefix.replace('{name}', ticketName)}
            </span>
          </div>
        ) : (
          <div className="form-group form-group--column">
            <label htmlFor="photo-drop-name" className="form-label">
              {text.open.nameLabel} <span className="form-required">*</span>
            </label>
            <div className="form-input-wrapper">
              <input
                id="photo-drop-name"
                type="text"
                className="form-input"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={text.open.namePlaceholder}
                maxLength={30}
              />
            </div>
          </div>
        )}

        <div className="photo-drop__dropzone">
          <input
            ref={fileInputRef}
            id="photo-drop-files"
            type="file"
            accept="image/*"
            multiple
            className="photo-drop__file-input"
            onChange={(e) => {
              handleFilesSelected(e.target.files);
              // 같은 파일을 다시 고를 수 있도록 값을 비운다
              e.target.value = '';
            }}
          />
          <label htmlFor="photo-drop-files" className="photo-drop__dropzone-label">
            <span className="photo-drop__dropzone-icon material-symbols-outlined">add_a_photo</span>
            <span className="photo-drop__dropzone-title" lang={language}>
              {text.open.dropTitle}
            </span>
            <span className="photo-drop__dropzone-hint" lang={language}>
              {text.open.dropHint.replace('{max}', String(MAX_PHOTOS))}
            </span>
          </label>
        </div>

        {items.length > 0 && (
          <>
            <div className="photo-drop__counter">
              {text.open.counter
                .replace('{count}', String(items.length))
                .replace('{max}', String(MAX_PHOTOS))}
            </div>
            <ul className="photo-drop__preview">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`photo-drop__thumb photo-drop__thumb--${item.status}`}
                >
                  <img src={item.previewUrl} alt="" className="photo-drop__thumb-image" />
                  {item.status === 'uploading' && (
                    <span className="photo-drop__thumb-spinner" aria-hidden="true" />
                  )}
                  {item.status === 'done' && (
                    <span className="photo-drop__thumb-badge material-symbols-outlined">check</span>
                  )}
                  {item.status === 'error' && (
                    <span className="photo-drop__thumb-badge material-symbols-outlined">close</span>
                  )}
                  {!isUploading && (
                    <button
                      type="button"
                      className="photo-drop__thumb-remove"
                      onClick={() => handleRemove(item.id)}
                      aria-label={text.open.removeLabel}
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="form-group form-group--column">
          <label htmlFor="photo-drop-message" className="form-label">
            {text.open.messageLabel}
            <span className="form-optional">{text.open.messageOptional}</span>
          </label>
          <div className="form-input-wrapper">
            <textarea
              id="photo-drop-message"
              ref={messageRef}
              className="form-textarea form-textarea--auto-resize"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={text.open.messagePlaceholder}
              rows={1}
              maxLength={300}
            />
          </div>
        </div>

        {errorMessage && <div className="form-message form-message--error">{errorMessage}</div>}

        <button
          type="submit"
          className="form-submit"
          disabled={isUploading}
          lang={language}
        >
          {isUploading
            ? text.open.submitting
                .replace('{done}', String(uploadedCount))
                .replace('{total}', String(items.length))
            : text.open.submit}
        </button>
      </motion.form>
    );
  };

  return (
    <div className="section-wrapper" id="baggage-drop">
      <div className="section-divider"></div>
      <motion.div {...sectionFadeInProps}>
        <div className="photo-drop">
          <h2 className="photo-drop__title" lang={language}>
            {text.title}
          </h2>
          <p className="photo-drop__intro">{renderMultilineText(text.intro)}</p>

          <AnimatePresence mode="wait" initial={false}>
            {renderBody()}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoDropSection;
