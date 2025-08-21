import React from "react";
import heroImage from "../assets/modern-medical-lab.png";
import { ArrowRight, Microscope, Shield, Clock } from "lucide-react";


const WelcomePart = () => {
  const scrollToContact = () => {
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
       <section id="hero" className="hero">
      <div className="hero-bg">
        <img src={heroImage} alt="Laboratoire médical moderne" />
        <div className="overlay"></div>
      </div>

      <div className="hero-content">
        <div className="badge">Laboratoire certifié ISO 15189</div>
        <h1>
          Analyses Médicales
          <span className="gradient-text"> de Précision</span>
        </h1>
        <p>
          Des résultats fiables et rapides pour accompagner vos professionnels
          de santé dans leurs diagnostics les plus exigeants.
        </p>
        <div className="stats">
          <div>
            <h3>15k+</h3>
            <p>Analyses/mois</p>
          </div>
          <div>
            <h3>24h</h3>
            <p>Délai moyen</p>
          </div>
          <div>
            <h3>99.8%</h3>
            <p>Précision</p>
          </div>
          <div>
            <h3>25</h3>
            <p>Ans d'expérience</p>
          </div>
        </div>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={scrollToContact}>
            Prendre Rendez-vous <ArrowRight size={18} />
          </button>
          <button
            className="btn-outline"
            onClick={() => {
              const section = document.getElementById("services");
              if (section) section.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Nos Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default WelcomePart;