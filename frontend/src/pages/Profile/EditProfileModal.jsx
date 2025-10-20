import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, X } from 'lucide-react';
import "../AnalysisResults/AddResultModal.css"

const EditProfileModal = ({ userData, onClose, onSave }) => {
  const [formData, setFormData] = React.useState(userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
   <div className="modal-add-result-overlay analysis-request-modal">
      <div className="modal-add-result-content">
        {/* Header */}
        <div className="modal-add-result-header">
          <h2 className="modal-add-result-title">
            <span className="icon-add-result">👤</span>
            Modifier le profil
          </h2>
          <button
            type="button"
            className="modal-add-result-close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-add-result-body">
          <div className="form-add-result-section">
            <h3 className="section-add-result-title">
              <span className="icon-add-result">📝</span>
              Informations personnelles
            </h3>

            <div className="form-add-result-group">
              <label><User size={14} /> Prénom</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-add-result-group">
              <label>Nom de famille</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-add-result-group">
              <label><User size={14} /> Mot de passe</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
              />
            </div>

            <div className="form-add-result-group">
              <label><User size={14} /> CIN</label>
              <input
                type="text"
                name="CIN"
                value={formData.CIN || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-add-result-group">
              <label>Numéro de téléphone</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-add-result-group">
              <label><User size={14} /> Date de naissance</label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-add-result-group">
              <label>Adresse</label>
              <input
                type="text"
                name="adress"
                value={formData.adress || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-add-result-group">
              <label><User size={14} /> Gouvernorat</label>
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-add-result-footer">
          <button
            type="button"
            className="cancel-add-result-btn btn-add-result"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="button"
            className="submit-add-result-btn btn-add-result"
            onClick={() => onSave(formData)}
          >
             Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditProfileModal);
