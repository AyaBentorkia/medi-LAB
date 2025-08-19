import { X , User} from 'lucide-react';
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const ProfileModal = ({patientId,onClose,token}) => {
    const [userData, setUserData] = useState({});
    const [error, setError] = useState(null);
    useEffect(() => {
    const fetchProfile = async () => {
      try {
        // setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/Secretary/users/${patientId}`, {
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
        <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2 className="modal-title">Modifier le profil</h2>
        
        <div className="form-grid">
            <div className="form-group">
            <label>Identifiant</label>
            {userData?.id}
          </div>
          <div className="form-group">
            <label><User size={14} /> Prénom</label>
            {userData?.firstname}
          </div>
          
          <div className="form-group">
            <label>Nom de famille</label>
            {userData?.lastname}
          </div>
          <div className="form-group">
            <label>Email</label>
            {userData?.email}
          </div>
          
           <div className="form-group">
            <label><User size={14} /> CIN</label>
            {userData?.CIN}
          </div>
          <div className="form-group">
            <label>Numéro de téléphone</label>
            {userData?.phoneNumber}
            </div>
            <div className="form-group">
            <label><User size={14} /> Date de naissance</label>
            {userData?.birth_date}
          </div>
          <div className="form-group">
            <label><User size={14} /> Sexe</label>
            {userData?.gender}
          </div>
          <div className="form-group">
            <label>Addresse</label>
            {userData?.address}
          </div>
          <div className="form-group">
            <label><User size={14} /> Gouvernorat</label>
            {userData?.governorate}
          </div>
          
                    
        </div>
      </div>
    </div>
    )
}


export default ProfileModal
