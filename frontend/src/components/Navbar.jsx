import React, {useState, useEffect} from "react";
import medicalTeam from "../assets/medical-lab-team.png";
import labInterior from "../assets/modern-medical-lab.png";
import { Award, Users, Target, Heart } from "lucide-react";
import labLogo from "../assets/Lab-logo.png"
import "./Navbar.css";
import { useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <img src={labLogo} alt="Laboratoire Médical" className="logo-img" />
          <div className="logo-text">
            <h1>LabMédical</h1>
            <p>Excellence & Précision</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <button onClick={() => scrollToSection("hero")}>Accueil</button>
          <button onClick={() => scrollToSection("about")}>À Propos</button>
          <button onClick={() => scrollToSection("services")}>Services</button>
          <button onClick={() => scrollToSection("contact")}>Contact</button>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <button className="btn-outline" onClick={() => navigate("/login")}>
            Se connecter
          </button>
          <button className="btn-primary" onClick={() => navigate("/register")}>
            S'inscrire
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="menu-btn-navbar" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <button onClick={() => scrollToSection("hero")}>Accueil</button>
          <button onClick={() => scrollToSection("about")}>À Propos</button>
          <button onClick={() => scrollToSection("services")}>Services</button>
          <button onClick={() => scrollToSection("contact")}>Contact</button>
          <div className="mobile-auth">
            <button className="btn-navbar-outline" onClick={() => navigate("/login")}>
              Se connecter
            </button>
            <button className="btn-primary" onClick={() => navigate("/register")}>
              S'inscrire
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;