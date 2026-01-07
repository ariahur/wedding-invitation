import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import HeroBoardingPassSection from './sections/HeroBoardingPassSection';
import TimelineSection from './sections/TimelineSection';
import DirectionsSection from './sections/DirectionsSection';
import RsvpSection from './sections/RsvpSection';
import ThankYouSection from './sections/ThankYouSection';
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

const WeddingInvitation: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const language = (lang === 'en' ? 'en' : 'ko') as Language;
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const baseUrl = window.location.origin;
    const currentUrl = `${baseUrl}/${language}`;
    const imageUrl = `${baseUrl}/couple.jpg`;
    
    // 메타 태그 설정 (국문/영문 동일)
    const title = '조준용(Daniel) ❤️ 허다영(Aria)';
    const description = '2027/02/20 15:00';
    
    document.title = title;
    document.documentElement.lang = language;
    
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', imageUrl);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:locale', language === 'ko' ? 'ko_KR' : 'en_US');
    updateMetaTag('og:site_name', title);
    
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', imageUrl);
    
    updateMetaTag('description', description);
  }, [language]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
        <ThankYouSection />
        
        {/* Scroll to Top Button (Mobile Only) */}
        {showScrollTop && (
          <button 
            className="scroll-to-top-btn" 
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <span className="material-symbols-outlined">keyboard_arrow_up</span>
          </button>
        )}
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

