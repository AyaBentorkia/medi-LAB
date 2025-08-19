import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, X } from 'lucide-react';

const EditProfileModal = ({ userData, onClose, onSave }) => {
  const [formData, setFormData] = React.useState(userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2 className="modal-title">Modifier le profil</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label><User size={14} /> Prénom</label>
            <input 
              type="text" 
              name="firstname" 
              value={formData.firstname || ''} 
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Nom de famille</label>
            <input 
              type="text" 
              name="lastname" 
              value={formData.lastname || ''} 
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label><User size={14} /> Mot de passe</label>
            <input 
              type="password" 
              name="password" 
            //   value={formData.password || ''} 
              onChange={handleChange}
            />
          </div>
           <div className="form-group">
            <label><User size={14} /> CIN</label>
            <input 
              type="text" 
              name="CIN" 
              value={formData.CIN || ''} 
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Numéro de téléphone</label>
            <input 
              type="text" 
              name="phoneNumber" 
              value={formData.phoneNumber || ''} 
              onChange={handleChange}
            />
            </div>
            <div className="form-group">
            <label><User size={14} /> Date de naissance</label>
            <input 
              type="date" 
              name="birth_date" 
              value={formData.birth_date || ''} 
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Addresse</label>
            <input 
              type="text" 
              name="adress" 
              value={formData.adress || ''} 
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label><User size={14} /> Gouvernorat</label>
            <input 
              type="text" 
              name="city" 
              value={formData.city || ''} 
              onChange={handleChange}
            />
          </div>
          
          
          
          {/* Ajoutez tous les autres champs ici */}
          
          <div className="form-actions">
            <button className="cancel-btn" onClick={onClose}>
              Annuler
            </button>
            <button className="save-btn" onClick={() => onSave(formData)}>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditProfileModal);
