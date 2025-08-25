import React, { useEffect, useState, useMemo } from "react"
import { GetAllPatients } from "../../apis/UsersApi";
import "./PatientsList.css"
import { Eye } from "lucide-react"
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { useSearchFilter } from "../../hooks/useSerachFilter";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
const ProfileModal = React.lazy(() => import('../Profile/ProfileModal'));

// Création d'un composant 
const PatientRow = React.memo(({ 
  patient, 
  onViewPatient 
}) => {
  return (
    <tr >
      <td>
        {patient?.id}
      </td>
      <td>
        <div className="patient-info">
          <div className="patient-avatar">
            {`${patient?.firstname[0]}${patient?.lastname[0]}`}
          </div>
          <div className="patient-details">
            <div className="patient-name">{`${patient?.firstname} ${patient?.lastname}`}</div>
          </div>
        </div>
      </td>
      <td>{patient?.birth_date}</td>
      <td>{patient?.phoneNumber}</td>
      <td>{patient?.CIN}</td>
      <td>
        <div className="actions">
          <button 
            className="btn-icon" 
            onClick={() => onViewPatient(patient?.id)}
          >
            <Eye size={18} /> 
          </button>
        </div>
      </td>
    </tr>
  );
});

const PatientsList = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedPatientId, setSelectedPatientId] = useState(null);

      const {
        users,setUsers,
        token,isLoading,setIsLoading,role
      }= useFetchUsers();
  
         const {
          data: filteredPatients,
          currentPage,
          totalPages,
          totalItems,
          goToPage,
          searchTerm,
          setSearch,
          selectedFilter,
          setFilter,
          hasNextPage,
          hasPrevPage
        } = usePagination(users, 10);

  const handleViewPatient = React.useCallback((patientId) => {
    setSelectedPatientId(patientId);
    setIsModalOpen(true);
    console.log("Patient ID sélectionné :", patientId)
  }, []);

  return (
    <div className="patients-list-container">
      {/* Header */}
      <div className="patients-header">
        <div className="header-content">
          <h1 className="page-title">Liste des Patients</h1>
          <p className="page-subtitle">
            {totalItems} patients {totalItems !== 1 ? "s" : ""} trouvé
            {isLoading ? " (chargement...)" : ""}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, CIN ou téléphone"
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tableau Patients */}
      <div className="table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>
                ID
              </th>
              <th>Nom & Prénom</th>
              <th>Date de Naissance</th>
              <th>Téléphone</th>
              <th>CIN</th>
              <th>Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="loading-skeleton">
                  Chargement des données...
                </td>
              </tr>
            ) : filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  Aucun patient trouvé
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <PatientRow
                  key={patient?.id}
                  patient={patient}
                  onViewPatient={handleViewPatient}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* État vide */}
      {!isLoading && filteredPatients.length === 0 && searchTerm && (
        <div className="empty-state">
          <p>Essayez de modifier vos critères de recherche</p>
        </div>
      )}
      
      {isModalOpen && (
        <React.Suspense fallback={<div>Chargement...</div>}>
          <ProfileModal 
            patientId={selectedPatientId} 
            onClose={() => setIsModalOpen(false)} 
            token={token}
          />
        </React.Suspense>
      )}
       {!isLoading && totalPages > 1 && (
       <Pagination
       hasPrevPage={hasPrevPage}
       currentPage={currentPage}
       goToPage={goToPage}
       totalPages={totalPages}
       hasNextPage={hasNextPage}
       />
      )}
    </div>
  )
}

export default PatientsList;