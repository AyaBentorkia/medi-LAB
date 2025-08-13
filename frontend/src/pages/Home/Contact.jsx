import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous ajouterez la logique d'envoi du formulaire
    console.log('Formulaire soumis:', formData);
    alert('Message envoyé avec succès!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="section-title">Contactez-nous</h2>
          <p className="section-subtitle">Nous sommes à votre écoute pour toute question ou demande de renseignement</p>
        </div>

        <div className="contact-content">
          {/* Formulaire de contact */}
          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Nom complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Sujet</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">Envoyer le message</button>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="contact-info-container">
            <div className="contact-info">
              <div className="info-item">
                <div className="info-icon">
                </div>
                <div className="info-content">
                  <h3>Adresse</h3>
                  <p>123 Rue du Laboratoire, 75000 Paris</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                </div>
                <div className="info-content">
                  <h3>Téléphone</h3>
                  <p>+33 1 23 45 67 89</p>
                  <p>+33 6 12 34 56 78 (Urgences)</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                </div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>contact@laboratoire-exemple.com</p>
                  <p>urgence@laboratoire-exemple.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                </div>
                <div className="info-content">
                  <h3>Horaires d'ouverture</h3>
                  <p>Lundi - Vendredi: 8h - 19h</p>
                  <p>Samedi: 9h - 17h</p>
                  <p>Dimanche: Urgences seulement</p>
                </div>
              </div>
            </div>

            {/* Carte (intégration Google Maps) */}
            <div className="contact-map">
              <iframe
                title="Localisation du laboratoire"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615509614!3d48.8583700792875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1623251234567!5m2!1sfr!2sfr"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;