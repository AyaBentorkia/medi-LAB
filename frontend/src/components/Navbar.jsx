import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from "../assets/Lab-logo.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
 const scrollToSection = (sectionId) => {
    if (window.location.pathname === '/') {
      // Si nous sommes déjà sur la page d'accueil, faites simplement défiler
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Sinon, naviguez vers la page d'accueil puis faites défiler
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Petit délai pour laisser le temps à la page de charger
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo à gauche */}
        <div className="logo-container">
          <img src={Logo} className="logo" alt="Logo" onClick={() => navigate('/')} />
        </div>

        {/* Menu Burger - Mobile seulement */}
        <button 
          className={`burger-menu ${isMenuOpen ? "open" : ""}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Contenu central - Liens de navigation */}
        <div className={`navbar-center ${isMenuOpen ? "open" : ""}`}>
          <nav className="navbar-links">
            <NavLink className="navbar-link" to="/" onClick={() => {closeMenu();scrollToSection('welcomepart')}}>Accueil</NavLink>
            <NavLink className="navbar-link" onClick={() => {closeMenu();scrollToSection('about')}} >A propos</NavLink>
            <NavLink className="navbar-link"  onClick={() => {closeMenu();scrollToSection('contact')}}>Contacts</NavLink>
          </nav>
        </div>

        {/* Boutons Auth à droite */}
        <div className="auth-buttons">
          <button className="btn login" onClick={() => { navigate('/login'); closeMenu(); }}>Se connecter</button>
          <button className="btn signup" onClick={() => { navigate('/register'); closeMenu(); }}>S'inscrire</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;