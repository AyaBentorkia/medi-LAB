import React, { useState, useEffect } from 'react';
import labCover1 from '../assets/labCover.jpg';
import labCover2 from '../assets/labCover2.jpg';

// Tableau des images de fond
const backgroundImages = [
  `url(${labCover1})`,
  `url(${labCover2})`,
  `url(${labCover1})`,
  `url(${labCover1})`
];

const WelcomePart = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      // Change l'image toutes les 300px de scroll
      const newBgIndex = Math.floor(window.scrollY / 300) % backgroundImages.length;
      setCurrentBg(newBgIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id='welcomepart'
      className='welcome-part-wrapper'
      style={{ 
        backgroundImage: backgroundImages[currentBg],
        // Effet de parallaxe léger
        backgroundPosition: `center ${scrollY * 0.3}px`
      }}
    >
      <div className='welcome-overlay'>
        <div className='welcome-content'>
          <h1 className='welcome-title'>Bienvenue dans notre Laboratoire</h1>
          <p className='welcome-subtitle'>Des analyses médicales précises et fiables</p>
          <button className='cta-button'>Commencer</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePart;