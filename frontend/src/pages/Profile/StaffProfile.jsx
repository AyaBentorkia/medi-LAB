import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { User, Mail, Phone, MapPin, Calendar, Users, Edit, Camera } from 'lucide-react';
import './StaffProfile.css';
import axios from "axios";
import EditProfileModal from './EditProfileModal';

const StaffProfile = () => {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/auth/users/profile', {
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
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [token])
    const handleSave = async(updatedData) => {
    try {
      const response = await axios.put('http://localhost:5000/auth/users', updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        setUserData(response.data.updatedUser);
      } else {
        throw new Error('Réponse inattendue');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
    } finally {
      setIsModalOpen(false);
    }
  };
  if (isLoading) return <div className="loading-spinner">Chargement...</div>;
  if (error) return <div className="error-message">Erreur: {error}</div>;
  if (!userData) return <div>Aucune donnée disponible</div>;

  return (
     <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1 className="page-title">Profil Personnel</h1>
          <p className="page-subtitle">Gérez vos informations personnelles</p>
        </div>
        <button className="edit-profile-btn" onClick={() => setIsModalOpen(true)}>
          <Edit size={16} />
          Modifier
        </button>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header-card">
          <div className="profile-avatar">
            {userData?.firstname?.charAt(0)}
            {userData?.lastname?.charAt(0)}
          </div>
          <div className="profile-info">
            <h2 className="profile-name">
              {userData.firstname} {userData.lastname}
            </h2>
            <span className="profile-role-badge">{userData.role}</span>
            <p className="profile-email">
              <Mail size={16} />
              {userData.email}
            </p>
          </div>
          <button className="avatar-edit-btn">
            <Camera size={14} />
          </button>
        </div>
      </div>

      {/* Grid Informations */}
      <div className="profile-grid">
        {/* Infos Perso */}
        <div className="profile-card">
          <div className="card-header">
            <User size={20} />
            <h3 className="card-title">Informations Personnelles</h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label>Prénom</label>
                <p>{userData.firstname}</p>
              </div>
              <div className="info-item">
                <label>Nom de famille</label>
                <p>{userData.lastname}</p>
              </div>
              <div className="info-item">
                <label>CIN</label>
                <p>{userData.CIN}</p>
              </div>
              <div className="info-item">
                <label>Sexe</label>
                <p>{userData.gender}</p>
              </div>
            </div>
            <div className="info-item full-width">
              <label>
                <Calendar size={14} /> Date de naissance
              </label>
              <p>{userData.birth_date}</p>
            </div>
          </div>
        </div>

        {/* Infos Contact */}
        <div className="profile-card">
          <div className="card-header">
            <Phone size={20} />
            <h3 className="card-title">Informations de Contact</h3>
          </div>
          <div className="card-content">
            <div className="info-item">
              <label>
                <Mail size={14} /> Email
              </label>
              <p>{userData.email}</p>
            </div>
            <div className="info-item">
              <label>
                <Phone size={14} /> Téléphone
              </label>
              <p>{userData.phoneNumber}</p>
            </div>
            <div className="info-item">
              <label>
                <MapPin size={14} /> Adresse
              </label>
              <p>{userData.adress}</p>
            </div>
            <div className="info-item">
              <label>Gouvernorat</label>
              <p>{userData.city}</p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EditProfileModal
          userData={userData}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StaffProfile;