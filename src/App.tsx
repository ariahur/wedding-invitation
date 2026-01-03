import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import HeroBoardingPassSection from './sections/HeroBoardingPassSection';
import TimelineSection from './sections/TimelineSection';
import DirectionsSection from './sections/DirectionsSection';
import RsvpSection from './sections/RsvpSection';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { LanguageProvider } from './contexts/LanguageContext';
import { Language } from './types/language';
import './App.css';

const WeddingInvitation: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const language = (lang === 'en' ? 'en' : 'ko') as Language;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (language === 'ko') {
      document.title = '조준용 ❤️ 허다영 결혼';
    } else {
      document.title = 'Daniel ❤️ Aria Wedding';
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

