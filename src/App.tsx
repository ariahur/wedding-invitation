import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import HeroBoardingPassSection from './sections/HeroBoardingPassSection';
import TimelineSection from './sections/TimelineSection';
import DirectionsSection from './sections/DirectionsSection';
import RsvpSection from './sections/RsvpSection';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Language } from './types/language';
import { translations } from './data/translations';
import './App.css';

const updateMetaTag = (property: string, content: string) => {
  // Open Graph 태그
  if (property.startsWith('og:')) {
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }
  // Twitter Card 태그
  else if (property.startsWith('twitter:')) {
    let element = document.querySelector(`meta[name="${property}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('name', property);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }
  // 일반 메타 태그
  else {
    let element = document.querySelector(`meta[name="${property}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('name', property);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }
};

const Footer: React.FC = () => {
  const language = useLanguage();
  const t = translations[language];

  return (
    <div className="app-footer">
      <div className="app-footer__thank-you">
        {language === 'ko' ? '감사합니다 ❤️' : 'Thank you ❤️'}
      </div>
      <div className="app-footer__inquiry">
        {t.rsvp.footer.inquiry}: {t.rsvp.footer.groom} | {t.rsvp.footer.bride}
      </div>
    </div>
  );
};

const WeddingInvitation: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const language = (lang === 'en' ? 'en' : 'ko') as Language;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const baseUrl = window.location.origin;
    const currentUrl = `${baseUrl}/${language}`;
    const imageUrl = `${baseUrl}/couple.jpg`;
    
    if (language === 'ko') {
      document.title = '조준용 ❤️ 허다영 결혼합니다';
      document.documentElement.lang = 'ko';
      
      // 메타 태그 설정
      updateMetaTag('og:title', '조준용 ❤️ 허다영 결혼합니다');
      updateMetaTag('og:description', '2월 20일 토요일 오후 3시\n그랜드힐 1층 플로리아');
      updateMetaTag('og:image', imageUrl);
      updateMetaTag('og:url', currentUrl);
      updateMetaTag('og:type', 'website');
      updateMetaTag('og:locale', 'ko_KR');
      
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:title', '조준용 ❤️ 허다영 결혼합니다');
      updateMetaTag('twitter:description', '2월 20일 토요일 오후 3시\n그랜드힐 1층 플로리아');
      updateMetaTag('twitter:image', imageUrl);
      
      updateMetaTag('description', '2월 20일 토요일 오후 3시\n그랜드힐 1층 플로리아');
    } else {
      document.title = 'Daniel ❤️ Aria Wedding';
      document.documentElement.lang = 'en';
      
      // 메타 태그 설정
      updateMetaTag('og:title', 'Daniel ❤️ Aria Wedding');
      updateMetaTag('og:description', 'February 20, Saturday 3:00 PM\nGrand Hill 1F Floria');
      updateMetaTag('og:image', imageUrl);
      updateMetaTag('og:url', currentUrl);
      updateMetaTag('og:type', 'website');
      updateMetaTag('og:locale', 'en_US');
      
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:title', 'Daniel ❤️ Aria Wedding');
      updateMetaTag('twitter:description', 'February 20, Saturday 3:00 PM\nGrand Hill 1F Floria');
      updateMetaTag('twitter:image', imageUrl);
      
      updateMetaTag('description', 'February 20, Saturday 3:00 PM\nGrand Hill 1F Floria');
    }
  }, [language]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

  return (
    <LanguageProvider language={language}>
      {isLoading && <LoadingScreen />}
      <div className="App" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
        <HeroBoardingPassSection />
        
        {/* Gallery section removed for this version */}
        {/* <GallerySection /> */}
        
        <TimelineSection />
        <DirectionsSection />
        <RsvpSection />
        <Footer />
      </div>
    </LanguageProvider>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ko" replace />} />
      <Route path="/:lang" element={<WeddingInvitation />} />
    </Routes>
  );
}

export default App;

