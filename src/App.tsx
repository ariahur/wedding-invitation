import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import HeroBoardingPassSection from './sections/HeroBoardingPassSection';
import AboutUsSection from './sections/AboutUsSection';
import TimelineSection from './sections/TimelineSection';
import DirectionsSection from './sections/DirectionsSection';
import RsvpSection from './sections/RsvpSection';
import ThankYouSection from './sections/ThankYouSection';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import PaperCard from './components/PaperCard/PaperCard';
import { LanguageProvider } from './contexts/LanguageContext';
import { Language } from './types/language';
import './App.css';

const updateMetaTag = (property: string, content: string) => {
  // Open Graph tags
  if (property.startsWith('og:')) {
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }
  // Twitter Card tags
  else if (property.startsWith('twitter:')) {
    let element = document.querySelector(`meta[name="${property}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('name', property);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }
  // Standard meta tags
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

const LanguageToggle: React.FC<{ language: Language }> = ({ language }) => {
  const navigate = useNavigate();

  const handleLanguageChange = () => {
    const newLang = language === 'ko' ? 'en' : 'ko';
    navigate(`/${newLang}`);
  };

  return (
    <button 
      className="language-toggle-button"
      onClick={handleLanguageChange}
      aria-label={language === 'ko' ? 'Switch to English' : '한국어로 전환'}
      title={language === 'ko' ? 'Switch to English' : '한국어로 전환'}
    >
      <span className="material-symbols-outlined">language</span>
      <span className="language-code">{language === 'ko' ? 'EN' : 'KO'}</span>
    </button>
  );
};

const WeddingInvitation: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const language = (lang === 'en' ? 'en' : 'ko') as Language;
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const baseUrl = window.location.origin;
    const currentUrl = `${baseUrl}/${language}`;
    const imageUrl = `${baseUrl}/hero/hero-couple.jpg`;
    
    // Set meta tags (same for both languages)
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
    }, 4000);

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
        <div className="app-header">
          <LanguageToggle language={language} />
        </div>
        <PaperCard texture="paper1" className="main-content-card">
          <HeroBoardingPassSection />
          <div className="paper-container">
            <AboutUsSection />
            <TimelineSection />
            <DirectionsSection />
            <RsvpSection />
          </div>
          <ThankYouSection />
        </PaperCard>
        
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

