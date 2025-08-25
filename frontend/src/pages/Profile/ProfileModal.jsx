import { X , User, IdCard, Phone, Calendar, MapPin, Mail} from 'lucide-react';
import React, { useEffect, useState } from 'react'
import "../AnalysisResults/AddResultModal.css"
import axios from 'axios';

const ProfileModal = ({patientId,onClose,token}) => {
      console.log("Patient ID sélectionné :", patientId)

    const [userData, setUserData] = useState({});
    const [error, setError] = useState(null);
    useEffect(() => {
    const fetchProfile = async () => {
      try {
        // setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/Auth/users/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000 // 5s timeout
        });
        console.log("Réponse brute :", response.data);
        if (response.status === 200) {
          setUserData(response.data.user);
        } else {
          throw new Error('Réponse inattendue');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
      }
      //  finally {
      //   setIsLoading(false);
      // }
    }
    fetchProfile();
  }, [token])
    return (
         <div className="modal-add-result-overlay analysis-request-modal">
      <div className="modal-add-result-content">
        
        {/* Header */}
        <div className="modal-add-result-header">
          <h2 className="modal-add-result-title">
            <span className="icon-add-result">👤</span>
            Profil du patient
          </h2>
          <button type="button" className="modal-add-result-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-add-result-body">
          {/* Section Informations Générales */}
          <div className="form-add-result-section patient-info-add-result">
            <h3 className="section-add-result-title">
              <span className="icon-add-result">📝</span>
              Informations Générales
            </h3>

            <div className="form-add-result-group">
              <label><IdCard size={14} className="icon-add-result" /> Identifiant</label>
              <input type="text" value={userData?.id || ""} disabled />
            </div>

            <div className="form-add-result-group">
              <label><User size={14} className="icon-add-result" /> Prénom</label>
              <input type="text" value={userData?.firstname || ""} disabled />
            </div>

            <div className="form-add-result-group">
              <label><User size={14} className="icon-add-result" /> Nom de famille</label>
              <input type="text" value={userData?.lastname || ""} disabled />
            </div>

            <div className="form-add-result-group">
              <label><Mail size={14} className="icon-add-result" /> Email</label>
              <input type="text" value={userData?.email || ""} disabled />
            </div>
          </div>

          {/* Section Infos Personnelles */}
          <div className="form-add-result-section analyses-add-result-section">
            <h3 className="section-add-result-title">
              <span className="icon-add-result">📋</span>
              Informations Personnelles
            </h3>

            <div className="form-add-result-group">
              <label><IdCard size={14} className="icon-add-result" /> CIN</label>
              <input type="text" value={userData?.CIN || ""} disabled />
            </div>

            <div className="form-add-result-group">
              <label><Phone size={14} className="icon-add-result" /> Téléphone</label>
              <input type="text" value={userData?.phoneNumber || ""} disabled />
            </div>

            <div className="form-add-result-group">
              <label><Calendar size={14} className="icon-add-result" /> Date de naissance</label>
              <input type="text" value={userData?.birth_date || ""} disabled />
            </div>

            <div className="form-add-result-group">
              <label><User size={14} className="icon-add-result" /> Sexe</label>
              <input type="text" value={userData?.gender || ""} disabled />
            </div>
          </div>

          {/* Section Localisation */}
          <div className="form-add-result-section">
            <h3 className="section-add-result-title">
              <span className="icon-add-result">📍</span>
              Localisation
            </h3>

            <div className="form-add-result-group">
              <label><MapPin size={14} className="icon-add-result" /> Adresse</label>
              <input type="text" value={userData?.address || ""} disabled />
            </div>

            <div className="form-add-result-group">
              <label><MapPin size={14} className="icon-add-result" /> Gouvernorat</label>
              <input type="text" value={userData?.governorate || ""} disabled />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-add-result-footer">
          <button type="button" className="cancel-add-result-btn btn-add-result" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
    )
}


export default ProfileModal
