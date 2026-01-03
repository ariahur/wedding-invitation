import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PaperCard from '../components/PaperCard/PaperCard';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './DirectionsSection.css';

const DirectionsSection: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapLoaded = useRef(false);
  
  const fullAddress = language === 'ko'
    ? `${t.directions.venue} ${t.directions.address} ${t.directions.floor}`
    : `${t.directions.venue} ${t.directions.address} ${t.directions.floor}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  // 카카오맵 초기화
  useEffect(() => {
    if (language !== 'ko' || !mapRef.current) return;

    const initializeMap = () => {
      if (!mapRef.current) return;

      const container = mapRef.current;
      const defaultCoords = new window.kakao.maps.LatLng(37.5013, 127.0574); // 대치동 근처 좌표
      
      const options = {
        center: defaultCoords,
        level: 3,
      };
      
      const map = new window.kakao.maps.Map(container, options);
      
      // 주소로 좌표 검색
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(t.directions.address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          map.setCenter(coords);
          
          // 마커 표시
          const marker = new window.kakao.maps.Marker({
            position: coords,
          });
          marker.setMap(map);
        } else {
          // 주소 검색 실패 시 기본 좌표에 마커 표시
          const marker = new window.kakao.maps.Marker({
            position: defaultCoords,
          });
          marker.setMap(map);
        }
      });
    };

    // 이미 스크립트가 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initializeMap);
      return;
    }

    // 스크립트가 이미 존재하는지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      // 스크립트가 이미 로드된 경우 바로 초기화 시도
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(initializeMap);
      } else {
        // 스크립트가 아직 로드 중인 경우
        existingScript.addEventListener('load', () => {
          if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(initializeMap);
          }
        });
      }
      return;
    }

    // 새 스크립트 로드
    const script = document.createElement('script');
    const apiKey = process.env.REACT_APP_KAKAO_MAP_API_KEY || '';
    if (!apiKey) {
      console.warn('카카오맵 API 키가 설정되지 않았습니다.');
      setMapError(true);
      return;
    }
    
    const scriptUrl = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.src = scriptUrl;
    script.async = true;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(initializeMap);
      } else {
        console.error('카카오맵 스크립트 로드 실패: window.kakao가 없습니다.');
        setMapError(true);
      }
    };
    
    script.onerror = (error) => {
      console.error('카카오맵 스크립트 로드 중 오류 발생:', error);
      console.error('스크립트 URL:', scriptUrl);
      console.error('API 키 확인:', apiKey ? `${apiKey.substring(0, 10)}...` : '없음');
      console.error('도메인 설정 확인 필요: 카카오 개발자 콘솔에서 현재 도메인을 등록했는지 확인하세요.');
      setMapError(true);
    };
    
    document.head.appendChild(script);
  }, [language, t.directions.address]);

  const handleKakaoMapClick = () => {
    const searchQuery = encodeURIComponent(t.directions.address);
    window.open(`https://map.kakao.com/link/search/${searchQuery}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <PaperCard texture="paper2" className="directions">
      <h2 className="directions__title">{t.directions.title}</h2>

      <div className="directions__section">
        <h3 className="directions__subtitle">{t.directions.subway.title}</h3>
        <ul className="directions__list">
          <li>{t.directions.subway.line1}</li>
          <li className="directions__note">{t.directions.subway.note1}</li>
          <li className="directions__note">{t.directions.subway.note2}</li>
        </ul>
      </div>

      <div className="directions__section">
        <h3 className="directions__subtitle">{t.directions.bus.title}</h3>
        <ul className="directions__list">
          <li>
            <strong>{t.directions.bus.main}:</strong> 143, 146, 341, 360, 401
          </li>
          <li>
            <strong>{t.directions.bus.branch}:</strong> 2413, 3411, 3422, 4318, 11-3
          </li>
          <li>
            <strong>{t.directions.bus.express}:</strong> 9407, 6900
          </li>
        </ul>
      </div>

      <div className="directions__section">
        <h3 className="directions__subtitle">{t.directions.car.title}</h3>
        <ul className="directions__list">
          <li>{t.directions.car.address}</li>
          <li>{t.directions.car.parking}</li>
        </ul>
      </div>

      <div className="directions__address">
        <div className="address-content">
          <div className="address-venue">{t.directions.venue}</div>
          <div className="address-text">{t.directions.address}</div>
          <div className="address-text">{t.directions.floor}</div>
          <div className="address-text">{t.directions.tel}</div>
        </div>
        
        {/* 지도 영역 */}
        <div className="directions__map">
          {language === 'ko' ? (
            mapError ? (
              <div className="map-error-container">
                <div className="map-error-content">
                  <div className="map-error-icon">📍</div>
                  <div className="map-error-message">
                    <p className="map-error-title">지도를 불러올 수 없습니다</p>
                    <p className="map-error-description">
                      카카오맵에서 위치를 확인하세요
                    </p>
                  </div>
                  <button 
                    className="map-link-button"
                    onClick={handleKakaoMapClick}
                  >
                    <span className="map-link-icon">🗺️</span>
                    카카오맵에서 보기
                  </button>
                </div>
              </div>
            ) : (
              <div ref={mapRef} className="kakao-map-container" />
            )
          ) : (
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(t.directions.address)}`}
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            />
          )}
        </div>
        
        <button 
          className="address-copy-btn"
          onClick={handleCopyAddress}
          aria-label={t.directions.copyButton}
        >
          {copied ? t.directions.copiedButton : t.directions.copyButton}
        </button>
      </div>
    </PaperCard>
    </motion.div>
  );
};

export default DirectionsSection;

