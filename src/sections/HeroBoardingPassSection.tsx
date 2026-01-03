import React from 'react';
import PaperCard from '../components/PaperCard/PaperCard';
import './HeroBoardingPassSection.css';

const HeroBoardingPassSection: React.FC = () => {
  return (
    <PaperCard texture="paper1" className="boarding-pass">
      {/* 최상단 타이틀 */}
      <div className="boarding-pass__top-title">
        <span className="top-title-icon">✈️</span>
        <span className="top-title-text">WEDDING BOARDING PASS</span>
      </div>

      {/* 상단 헤더 영역 (흰색 배경) */}
      <div className="boarding-pass__header">
        <div className="header-logo-circle">
          <div className="logo-text-top">wedding</div>
          <div className="logo-letter">W</div>
          <div className="logo-text-bottom">invitation</div>
        </div>
        <div className="header-date-label">
          <div className="date-label-text">DATE</div>
          <div className="date-value">2027.02.20</div>
        </div>
      </div>

      {/* 메인 보딩 패스 (종이 텍스처 배경) */}
      <div 
        className="boarding-pass__main"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/textures/paper1.jpg)`,
        }}
      >
        {/* 상단: 항공사 정보 */}
        <div className="main-top">
          <div className="main-top-left">
            <span className="heart-icon">❤️</span>
            <div className="airline-info">
              <div className="airline-name">WEDDING AIRLINES</div>
              <div className="airline-tagline">Forever Together <span className="small-heart">❤️</span></div>
            </div>
          </div>
          <div className="main-top-right">
            <div className="class-label">CLASS</div>
            <div className="class-value">FIRST</div>
          </div>
        </div>

        {/* 중앙: 항공편 정보 */}
        <div className="main-route">
          <div className="route-origin">
            <div className="route-code">SYD</div>
            <div className="route-city">Sydney</div>
            <div className="route-city-ko">시드니</div>
          </div>
          <div className="route-center">
            <div className="route-icon">✈️</div>
            <div className="route-label">Flight</div>
          </div>
          <div className="route-destination">
            <div className="route-code">ICN</div>
            <div className="route-city">Seoul</div>
            <div className="route-city-ko">서울</div>
          </div>
        </div>

        {/* 하단: 커플 사진 */}
        <div className="main-photo">
          <div className="photo-placeholder">
            <div className="photo-icon">👫</div>
            <div className="photo-text">Couple Photo</div>
          </div>
        </div>
      </div>

      <div className="boarding-pass__couple">
        <div className="couple-groom">
          <div className="couple-name">김지훈 (Kim Jihoon)</div>
          <div className="couple-parents">김철수·이영희의 장남</div>
        </div>
        <div className="couple-heart">❤️</div>
        <div className="couple-bride">
          <div className="couple-name">박수민 (Park Sumin)</div>
          <div className="couple-parents">박영수·최미희의 장녀</div>
        </div>
      </div>

      <div className="boarding-pass__message">
        시드니에서 시작된 인연이 이제 서울에서 아름다운 열매를 맺습니다.
        <br />
        새로운 여정의 시작을 축복해 주시면 감사하겠습니다.
      </div>

      <div className="boarding-pass__details">
        <div className="detail-row">
          <span className="detail-label">날짜 DATE</span>
          <span className="detail-value">2026.03.21 토요일</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">시간 TIME</span>
          <span className="detail-value">14:00 오후 2시</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">장소 VENUE</span>
          <div className="detail-value-block">
            <div>더 클래식 웨딩홀</div>
            <div>서울특별시 강남구 테헤란로 123</div>
            <div>3층 그랜드볼룸</div>
            <div>Tel. 02-1234-5678</div>
          </div>
        </div>
      </div>

      <div className="boarding-pass__footer">
        <div className="footer-info">
          <span>GATE 3F</span>
          <span>BOARDING 13:30</span>
          <span>SEAT ❤️</span>
        </div>
        <div className="barcode">
          <div className="barcode-lines"></div>
          <div className="barcode-text">&lt;WEDDING2926032114KJ08PS&gt;</div>
        </div>
      </div>
    </PaperCard>
  );
};

export default HeroBoardingPassSection;

