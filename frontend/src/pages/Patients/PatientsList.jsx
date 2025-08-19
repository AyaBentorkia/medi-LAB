import React, { useEffect, useState } from "react"
import "./PatientsList.css"
import { Eye } from "lucide-react"
import axios from "axios";
const ProfileModal = React.lazy(() => import('../Profile/ProfileModal'));

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatients, setSelectedPatients] = useState([])
  const [patients, setPatients] = useState([])
 const token = localStorage.getItem("token");
     const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(()=>{
    const fetchPatients= async () => {
      try {
        const response = await axios.get("http://localhost:5000/Secretary/users?role=Patient", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });
        console.log(response.data.users)
        setPatients(response?.data?.users);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    }
    fetchPatients();
  },[])


  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient?.firstname} ${patient?.lastname}`.toLowerCase()
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      patient?.CIN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Sélection
  const handleSelectPatient = (patientId) => {
    setSelectedPatients((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId]
    )
  }
 const changeProfileMode=(e,Id,role)=>{
      setUserId(Id);
      e.preventDefault();
        localStorage.setItem("PatientProfileId",Id);
        setTimeout(() => navigate("/patient-profile"), 1000);  
     
    }
  return (
    <div className="patients-list-container">
      {/* Header */}
      <div className="patients-header">
        <div className="header-content">
          <h1 className="page-title">Liste des Patients</h1>
          <p className="page-subtitle">
            {filteredPatients.length} patient
            {filteredPatients.length > 1 ? "s" : ""} trouvé
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, CIN ou téléphone..."
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
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedPatients(
                      e.target.checked ? filteredPatients.map((p) => p.id) : []
                    )
                  }
                  checked={
                    selectedPatients.length === filteredPatients.length &&
                    filteredPatients.length > 0
                  }
                />
              </th>
              <th>Nom & Prénom</th>
              <th>Date de Naissance</th>
              <th>Téléphone</th>
              <th>CIN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient?.id}
                className={selectedPatients.includes(patient?.id) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedPatients.includes(patient?.id)}
                    onChange={() => handleSelectPatient(patient.id)}
                  />
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
                    <button className="btn-icon" onClick={() => {setSelectedPatientId(patient?.id),setIsModalOpen(true)}}>
                      <Eye size={18} /> 
                    </button>
                  </div>
                </td>
              </tr>
              
            ))}
          </tbody>
        </table>
      </div>

      {/* État vide */}
      {filteredPatients.length === 0 && (
        <div className="empty-state">
          <h3>Aucun patient trouvé</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </div>
      )}

      {/* Actions groupées */}
      {selectedPatients.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">
            {selectedPatients.length} patient
            {selectedPatients.length > 1 ? "s" : ""} sélectionné
          </span>
          <div className="bulk-buttons">
            <button className="btn-secondary">Exporter</button>
          </div>
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

export default PatientsList
