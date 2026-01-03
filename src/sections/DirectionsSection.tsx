import React, { useState } from 'react';
import PaperCard from '../components/PaperCard/PaperCard';
import './DirectionsSection.css';

const DirectionsSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  const address = '서울시 강남구 역삼로 607(대치동)';
  const venueName = '그랜드힐컨벤션';
  const fullAddress = `${venueName} ${address} 1층 플로리아`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <PaperCard texture="paper2" className="directions">
      <h2 className="directions__title">오시는 길</h2>

      <div className="directions__section">
        <h3 className="directions__subtitle">지하철</h3>
        <ul className="directions__list">
          <li>2호선 삼성역 1번 출구</li>
          <li className="directions__note">1번 출구인 경우 셔틀버스가 대기</li>
          <li className="directions__note">2번 출구인 경우 도보로 5분 소요</li>
        </ul>
      </div>

      <div className="directions__section">
        <h3 className="directions__subtitle">버스</h3>
        <ul className="directions__list">
          <li>
            <strong>간선:</strong> 143, 146, 341, 360, 401
          </li>
          <li>
            <strong>지선:</strong> 2413, 3411, 3422, 4318, 11-3
          </li>
          <li>
            <strong>광역:</strong> 9407, 6900
          </li>
        </ul>
      </div>

      <div className="directions__section">
        <h3 className="directions__subtitle">자가용</h3>
        <ul className="directions__list">
          <li>서울특별시 강남구 대치동 1004-3 네비게이션 검색 시 입구 안내</li>
          <li>건물 주차타워 주차 가능 (3시간 무료)</li>
        </ul>
      </div>

      <div className="directions__address">
        <div className="address-content">
          <div className="address-venue">{venueName}</div>
          <div className="address-text">{address}</div>
          <div className="address-text">1층 플로리아</div>
          <div className="address-text">Tel. 02-6964-7889</div>
        </div>
        <button 
          className="address-copy-btn"
          onClick={handleCopyAddress}
          aria-label="주소 복사"
        >
          {copied ? '✓ 복사됨' : '주소 복사'}
        </button>
      </div>
    </PaperCard>
  );
};

export default DirectionsSection;

