import React from 'react';
import { MapPin, Phone, Mail, Clock, TestTubes, Shield, Award, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Accueil", href: "#hero" },
    { name: "À Propos", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" }
  ];

  const services = [
    { name: "Analyses Sanguines", href: "#services" },
    { name: "Microbiologie", href: "#services" },
    { name: "Génétique Moléculaire", href: "#services" },
    { name: "Cardiologie", href: "#services" },
    { name: "Neurologie", href: "#services" },
    { name: "Urgences 24/7", href: "#services" }
  ];

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId.replace('#', ''));
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-medical">

      {/* Main Footer */}
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-company">
              <div className="footer-logo-container">
                <div className="footer-logo">
                  <img src="/lab-logo.png" alt="LabMédical" />
                </div>
                <div>
                  <h3 className="footer-company-name">LabMédical</h3>
                  <p className="footer-company-tagline">Excellence & Précision</p>
                </div>
              </div>
              <p className="footer-description">
                Laboratoire médical de référence depuis 25 ans, nous offrons des analyses 
                de haute qualité avec des technologies de pointe.
              </p>
              <div className="footer-badges">
                {[
                  { icon: Shield, label: "ISO 15189" },
                  { icon: Award, label: "Certifié" },
                  { icon: TestTubes, label: "500+ Tests" }
                ].map((item, index) => (
                  <div key={index} className="footer-badge" title={item.label}>
                    <item.icon size={20} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="footer-title">Navigation</h4>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index} className="footer-link-item">
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="footer-link"
                    >
                      <ArrowRight size={16} className="footer-link-arrow" />
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="footer-title">Nos Services</h4>
              <ul className="footer-links">
                {services.map((service, index) => (
                  <li key={index} className="footer-link-item">
                    <button
                      onClick={() => scrollToSection(service.href)}
                      className="footer-link"
                    >
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="footer-title">Contact</h4>
              <div>
                <div className="footer-contact-item">
                  <MapPin size={20} className="footer-contact-icon" />
                  <div className="footer-contact-text">
                    123 Avenue des Sciences<br />
                    75015 Paris, France
                  </div>
                </div>
                <div className="footer-contact-item">
                  <Phone size={20} className="footer-contact-icon" />
                  <div className="footer-contact-text">+33 1 42 86 15 39</div>
                </div>
                <div className="footer-contact-item">
                  <Mail size={20} className="footer-contact-icon" />
                  <div className="footer-contact-text">contact@labmedical.fr</div>
                </div>
                <div className="footer-contact-item">
                  <Clock size={20} className="footer-contact-icon" />
                  <div className="footer-contact-text footer-contact-hours">
                    Lun-Ven: 7h00 - 19h00<br />
                    Sam: 8h00 - 16h00<br />
                    <span className="footer-contact-emergency">Urgences 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="footer-newsletter-container">
          <div className="footer-newsletter-content">
            <div className="footer-newsletter-text">
              <h4 className="footer-newsletter-title">Restez Informé</h4>
              <p>
                Recevez nos actualités et conseils santé directement dans votre boîte mail.
              </p>
            </div>
            <div className="footer-newsletter-form">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="footer-newsletter-input"
              />
              <button className="footer-newsletter-button">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              © {currentYear} LabMédical. Tous droits réservés.
            </div>
            <div className="footer-legal">
              <button className="footer-legal-link">
                Confidentialité
              </button>
              <button className="footer-legal-link">
                Conditions d'utilisation
              </button>
              <button className="footer-legal-link">
                Mentions légales
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;