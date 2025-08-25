// StaffProfile.jsx
import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera } from 'lucide-react';
import './StaffProfile.css';
import { useFetchProfile } from '../../hooks/useFetchProfile';


const EditProfileModal = React.lazy(() => import('./EditProfileModal'));

const StaffProfile = () => {

  const {
    token,userData,setUserData,
    error,setError,
    isModalOpen,setIsModalOpen,
    patient,setPatient,
    handleSave
  } = useFetchProfile();

   if (error) return <div className="error-message">Erreur: {error}</div>;
  if (!userData) return <div>Aucune donnée disponible</div>;

  return (
    <div className="staff-profile-container">
      <div className="patients-header">
        <div className="header-content">
          <h1 className="page-title">Mon profile</h1>
        </div>
      </div>
      {/* Header Section */}
      <div className="profile-hero-section">
        <div className="profile-hero-content">
          <div className="profile-avatar-large">
            {userData?.firstname?.charAt(0)}
            {userData?.lastname?.charAt(0)}
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-hero-title">
              {userData.firstname} {userData.lastname}
            </h1>
            <div className="profile-role-badge">
              {userData.role}
            </div>
            <p className="profile-hero-subtitle">
              <Mail size={18} className="profile-icon" />
              {userData.email}
            </p>
          </div>
          <button 
            className="btn-outline"
            onClick={() => setIsModalOpen(true)}
          >
            <Edit size={18} />
            Modifier le profil
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content-grid">
        {/* Personal Information Card */}
        <div className="profile-info-card">
          <div className="profile-card-header">
            <User size={24} className="profile-card-icon" />
            <h2 className="profile-card-title">Informations Personnelles</h2>
          </div>
          <div className="profile-card-content">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Prénom</span>
                <span className="info-value">{userData.firstname}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nom de famille</span>
                <span className="info-value">{userData.lastname}</span>
              </div>
              <div className="info-item">
                <span className="info-label">CIN</span>
                <span className="info-value">{userData.CIN}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sexe</span>
                <span className="info-value">{userData.gender}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">
                  <Calendar size={16} className="info-icon" />
                  Date de naissance
                </span>
                <span className="info-value">{userData.birth_date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="profile-info-card">
          <div className="profile-card-header">
            <Phone size={24} className="profile-card-icon" />
            <h2 className="profile-card-title">Informations de Contact</h2>
          </div>
          <div className="profile-card-content">
            <div className="info-item">
              <span className="info-label">
                <Mail size={16} className="info-icon" />
                Email
              </span>
              <span className="info-value">{userData.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">
                <Phone size={16} className="info-icon" />
                Téléphone
              </span>
              <span className="info-value">{userData.phoneNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">
                <MapPin size={16} className="info-icon" />
                Adresse
              </span>
              <span className="info-value">{userData.adress}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gouvernorat</span>
              <span className="info-value">{userData.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <React.Suspense fallback={<div className="loading-modal">Chargement...</div>}>
          <EditProfileModal 
            userData={userData} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSave} 
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default React.memo(StaffProfile);