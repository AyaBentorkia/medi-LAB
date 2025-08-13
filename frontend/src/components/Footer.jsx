import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section Logo et description */}
        <div className="footer-section">
          <div className="footer-logo">
            <img src="/logo-white.png" alt="Laboratoire Logo" />
            <h3>Laboratoire Médical</h3>
          </div>
          <p className="footer-description">
            Nous fournissons des services d'analyses médicales de haute qualité avec des résultats rapides et fiables.
          </p>
          {/* <div className="social-links">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div> */}
        </div>

        {/* Liens rapides */}
        <div className="footer-section">
          <h4>Liens rapides</h4>
          <ul className="footer-links">
            <li><a href="/">Accueil</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/about">À propos</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Nos Services</h4>
          <ul className="footer-links">
            <li><a href="/services/analyses">Analyses sanguines</a></li>
            <li><a href="/services/imagerie">Imagerie médicale</a></li>
            <li><a href="/services/genetique">Tests génétiques</a></li>
            <li><a href="/services/bacteriologie">Bactériologie</a></li>
            <li><a href="/services/urgences">Services d'urgence</a></li>
            <li><a href="/services/domicile">Prélèvements à domicile</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contactez-nous</h4>
          <ul className="footer-contact">
            <li>
              {/* <FaMapMarkerAlt className="contact-icon" /> */}
              <span>123 Rue du Laboratoire, 75000 Paris</span>
            </li>
            <li>
              {/* <FaPhone className="contact-icon" /> */}
              <span>+33 1 23 45 67 89</span>
            </li>
            <li>
              {/* <FaEnvelope className="contact-icon" /> */}
              <span>contact@laboratoire.com</span>
            </li>
            <li>
              {/* <FaClock className="contact-icon" /> */}
              <div>
                <p>Lun-Ven: 8h-19h</p>
                <p>Sam: 9h-17h</p>
                <p>Dim: Urgences</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; {new Date().getFullYear()} Laboratoire Médical. Tous droits réservés.</p>
          <div className="legal-links">
            <a href="/privacy">Confidentialité</a>
            <a href="/terms">Conditions d'utilisation</a>
            <a href="/cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;