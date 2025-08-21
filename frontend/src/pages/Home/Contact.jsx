import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message envoyé !");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
 <section id="contact" className="contact">
      <h2>Contactez-Nous</h2>
      <div className="contact-grid">
        <form onSubmit={handleSubmit} className="contact-form">
          <input 
            type="text" 
            name="name" 
            placeholder="Nom complet *" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email *" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="subject" 
            placeholder="Sujet *" 
            value={formData.subject} 
            onChange={handleChange} 
            required 
          />
          <textarea 
            name="message" 
            placeholder="Votre message *" 
            value={formData.message} 
            onChange={handleChange} 
            required 
          />
          <button type="submit" className="btn-primary">
            Envoyer le message
          </button>
        </form>
        
        <div className="contact-details">
          <div className="contact-info">
            <p><MapPin size={20} /> 123 Avenue des Sciences, Paris</p>
            <p><Phone size={20} /> +33 1 42 86 15 39</p>
            <p><Mail size={20} /> contact@labmedical.fr</p>
            <p><Clock size={20} /> Lun-Ven: 7h-19h, Sam: 8h-16h</p>
          </div>
          
          <div className="contact-map">
            <iframe
              title="Localisation"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.5!2d2.3!3d48.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1"
              width="100%"
              height="200"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
