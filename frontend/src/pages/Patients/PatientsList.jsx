import React, { useEffect, useState, useMemo } from "react"
import "./PatientsList.css"
import { Eye } from "lucide-react"
import axios from "axios";
const ProfileModal = React.lazy(() => import('../Profile/ProfileModal'));

// Création d'un composant mémoïsé pour les lignes du tableau
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
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState([])
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      // Vérifier si les données sont déjà en cache
      const cacheKey = 'patients_data';
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      const now = new Date().getTime();
      console.log("cached data : ", JSON.parse(cachedData));
      // Utiliser les données en cache si elles existent et sont récentes (moins de 5 minutes)
      if (cachedData && cacheTimestamp && now - cacheTimestamp < 300000) {
        setPatients(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/Auth/users?role=Patient", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });
        
        // const patientsData = response?.data?.users || [];
        setPatients(response?.data?.users);
        
        // Mettre en cache les données (Solution 5)
        localStorage.setItem(cacheKey, JSON.stringify(response?.data?.users));
        localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
        
      } catch (error) {
        console.error("Error fetching patients:", error);
        
        // En cas d'erreur, essayer d'utiliser les données en cache si disponibles
        if (cachedData) {
          setPatients(JSON.parse(cachedData));
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPatients();
  }, [token]);

  // Solution 6: Utilisation de useMemo pour optimiser le filtrage
  const filteredPatients = useMemo(() => {
    if (!patients.length) return [];
    
    return patients.filter((patient) => {
      const fullName = `${patient?.firstname || ''} ${patient?.lastname || ''}`.toLowerCase();
      const cin = patient?.CIN || '';
      const phone = patient?.phoneNumber || '';
      
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        cin.includes(searchTerm) ||
        phone.includes(searchTerm)
      );
    });
  }, [patients, searchTerm]);

  // Mémoriser la fonction de sélection pour éviter des rendus inutiles


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
            {filteredPatients.length} patient
            {filteredPatients.length !== 1 ? "s" : ""} trouvé
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
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* État vide (version alternative) */}
      {!isLoading && filteredPatients.length === 0 && searchTerm && (
        <div className="empty-state">
          <h3>Aucun patient trouvé</h3>
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
    </div>
  )
}

export default PatientsList;