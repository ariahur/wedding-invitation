import React, { useState } from 'react';
import PaperCard from '../components/PaperCard/PaperCard';
import './DirectionsSection.css';

const DirectionsSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  const address = '서울특별시 강남구 테헤란로 123';
  const venueName = '더 클래식 웨딩홀';

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${venueName} ${address}`);
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
          <li>2호선 강남역 3번 출구 도보 5분</li>
          <li>신분당선 강남역 5번 출구 도보 7분</li>
        </ul>
      </div>

      <div className="directions__section">
        <h3 className="directions__subtitle">버스</h3>
        <ul className="directions__list">
          <li>
            <strong>간선:</strong> 146, 360, 740
          </li>
          <li>
            <strong>지선:</strong> 3011, 4318, 6411
          </li>
          <li>강남역 정류장 하차</li>
        </ul>
      </div>

      <div className="directions__section">
        <h3 className="directions__subtitle">자가용</h3>
        <ul className="directions__list">
          <li>내비게이션: "{venueName}" 검색</li>
          <li>건물 지하 1~3층 주차 가능 (3시간 무료)</li>
        </ul>
        <div className="directions__parking-note">
          주차 안내: 건물 후면 주차장 이용 가능하며, 웨딩홀 이용 고객은 3시간 무료 주차가 제공됩니다. 만차 시 인근 강남역 공영주차장을 이용해 주세요.
        </div>
      </div>

      <div className="directions__address">
        <div className="address-content">
          <div className="address-venue">{venueName}</div>
          <div className="address-text">{address}</div>
          <div className="address-text">3층 그랜드볼룸</div>
          <div className="address-text">Tel. 02-1234-5678</div>
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

