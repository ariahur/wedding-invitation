import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import HeroBoardingPassSection from './sections/HeroBoardingPassSection';
import TimelineSection from './sections/TimelineSection';
import DirectionsSection from './sections/DirectionsSection';
import RsvpSection from './sections/RsvpSection';
import { LanguageProvider } from './contexts/LanguageContext';
import { Language } from './types/language';
import './App.css';

const WeddingInvitation: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const language = (lang === 'en' ? 'en' : 'ko') as Language;

  useEffect(() => {
    if (language === 'ko') {
      document.title = '조준용 ❤️ 허다영 결혼';
    } else {
      document.title = 'Daniel ❤️ Aria Wedding';
    }
  }, [language]);

  return (
    <LanguageProvider language={language}>
      <div className="App">
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

