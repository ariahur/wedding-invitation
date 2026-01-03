import React from 'react';
import HeroBoardingPassSection from './sections/HeroBoardingPassSection';
import DirectionsSection from './sections/DirectionsSection';
import RsvpSection from './sections/RsvpSection';
import './App.css';

function App() {
  return (
    <div className="App">
      <HeroBoardingPassSection />
      
      {/* Gallery section removed for this version */}
      {/* <GallerySection /> */}
      
      <DirectionsSection />
      <RsvpSection />
    </div>
  );
}

export default App;

