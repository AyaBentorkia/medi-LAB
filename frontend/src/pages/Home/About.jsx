import React from 'react';
import team from '../../assets/team.jpg'; // Remplacez par votre image
import lab from '../../assets/lab.jpg'; // Remplacez par votre image
import { Award, Clock, Heart, Microscope, Shield } from 'lucide-react';
import labTeam from "../../assets/medical-lab-team.png"

const About = () => {
  const values = [
    {
      icon: Microscope,
      title: "Précision",
      description: "Des résultats d'analyse d'une exactitude irréprochable grâce à nos équipements de pointe.",
    },
    {
      icon: Clock,
      title: "Rapidité",
      description: "Délais d'exécution parmi les plus courts du secteur pour un diagnostic rapide.",
    },
    {
      icon: Heart,
      title: "Empathie",
      description: "Une approche humaine et bienveillante pour accompagner chaque patient.",
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Respect strict des protocoles sanitaires et confidentialité garantie.",
    },
  ]
  return (
      <section id="about" className="about-section">
      <div className="container-about">
        {/* Header */}
        <div className="header-about">
          <h2>À Propos de Notre Laboratoire</h2>
          <p>
            Excellence médicale depuis 2010, nous nous engageons à fournir des
            analyses de qualité supérieure avec un service personnalisé.
          </p>
        </div>

        {/* Contenu principal */}
        <div className="content-grid-about">
          {/* Texte */}
          <div className="content-about">
            <div>
              <h3>Notre Histoire</h3>
              <p>
                Fondé en 2010, notre laboratoire s'est rapidement imposé comme
                un leader dans le domaine des analyses médicales grâce à notre
                engagement envers la précision, l'innovation et le service
                patient.
              </p>
            </div>

            <div>
              <h3>Notre Mission</h3>
              <p>
                Fournir des résultats d'analyses rapides, fiables et précis pour
                faciliter le diagnostic et le traitement, tout en offrant une
                expérience patient exceptionnelle.
              </p>
            </div>

            <div className="stats-about">
              <div>
                <div className="number-about">15+</div>
                <div className="label-about">Années d'expérience</div>
              </div>
              <div>
                <div className="number-about">50+</div>
                <div className="label-about">Professionnels</div>
              </div>
              <div>
                <div className="number-about">200+</div>
                <div className="label-about">Types d'analyses</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="image-wrapper-about">
            <img
              src={labTeam}
              alt="Notre équipe de laboratoire"
            />
            <div className="badge-about">
              <Award className="icon-about" />
              <div>Certifié ISO</div>
            </div>
          </div>
        </div>

        {/* Valeurs */}
        <div className="values-about">
          <h3>Nos Valeurs</h3>
          <div className="values-grid-about">
            {values.map((value, index) => (
              <div key={index} className="value-card-about">
                <div className="icon-circle-about">
                  <value.icon className="value-icon-about" />
                </div>
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;