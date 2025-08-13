import React from 'react';
import team from '../../assets/team.jpg'; // Remplacez par votre image
import lab from '../../assets/lab.jpg'; // Remplacez par votre image

const About = () => {
  return (
    <section id='about' className="about-section">
      <div className="about-container">
        <div className="about-header">
          <h2 className="section-title">À Propos de Notre Laboratoire</h2>
          <p className="section-subtitle">Excellence médicale depuis 2010</p>
        </div>

        <div className="about-content">
          <div className="about-text">
            <h3>Notre Histoire</h3>
            <p>
              Fondé en 2010, notre laboratoire s'est rapidement imposé comme un leader
              dans le domaine des analyses médicales grâce à notre engagement envers
              la précision, l'innovation et le service patient.
            </p>
            
            <h3>Notre Mission</h3>
            <p>
              Fournir des résultats d'analyses rapides, fiables et précis pour
              faciliter le diagnostic et le traitement, tout en offrant une
              expérience patient exceptionnelle.
            </p>

            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">10 000+</span>
                <span className="stat-label">Patients par mois</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24h</span>
                <span className="stat-label">Délai moyen</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Professionnels</span>
              </div>
            </div>
          </div>

          <div className="about-images">
            <img src={team} alt="Notre équipe" className="about-img about-img-1" />
            <img src={lab} alt="Notre laboratoire" className="about-img about-img-2" />
          </div>
        </div>

        <div className="values-section">
          <h3>Nos Valeurs</h3>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🔬</div>
              <h4>Précision</h4>
              <p>Des résultats d'analyse d'une exactitude irréprochable</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⏱️</div>
              <h4>Rapidité</h4>
              <p>Délais d'exécution parmi les plus courts du secteur</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💙</div>
              <h4>Empathie</h4>
              <p>Une approche humaine et bienveillante</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h4>Sécurité</h4>
              <p>Respect strict des protocoles sanitaires</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;