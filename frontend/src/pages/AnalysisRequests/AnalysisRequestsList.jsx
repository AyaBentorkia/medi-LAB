import React, { useEffect, useState } from "react"
import "../Patients/PatientsList.css"
import { Eye } from "lucide-react"
import axios from "axios";
import AddAnalysisReqModal from "./AddAnalysisReqModal";
import AnalysisReqModal from "./AnalysisReqModal";

const AnalysisRequestsList = () => {
      const [searchTerm, setSearchTerm] = useState("")
      const [selectedRequest, setSelectedRequest] = useState([])
      const [requests, setRequests] = useState([])
     const token = localStorage.getItem("token");
        const [isModalAddReqOpen, setIsModalAddReqOpen] = useState(false);
        const [isModalViewOpen, setIsModalViewOpen] = useState(false);
      const [selectedRequestId, setSelectedRequestId] = useState(null);
    
      useEffect(()=>{
        const fetchRequests= async () => {
          try {
            const response = await axios.get("http://localhost:5000/Secretary/analysis-requests", {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 5000
            });
            console.log(response.data.analysisRequests)
            setRequests(response?.data?.analysisRequests);
          } catch (error) {
            console.error("Error fetching patients:", error);
          }
        }
        fetchRequests();
      },[])
    

      const filteredRequests = requests.filter((request) => {
        const fullName = `${request?.firstname} ${request?.lastname}`.toLowerCase()
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          request?.CIN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request?.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    
      // Sélection
      const handleSelectRequest = (requestId) => {
        setSelectedRequest((prev) =>
          prev.includes(requestId)
            ? prev.filter((id) => id !== requestId)
            : [...prev, requestId]
        )
      }
      const getStatusBadge = (status) => {
    const statusConfig = {
      "Terminé": { label: "Terminé", className: "status-active" },
      "En attente": { label: "En attente", className: "status-pending" },
      "En cours": { label: "En cours", className: "status-inactive" },
    }

    const config = statusConfig[status] || statusConfig.active

    return <span className={`status-badge ${config.className}`}>{status}</span>
  }
  return (
 <div className="patients-list-container">
      {/* Header */}
      <div className="patients-header">
        <div className="header-content">
          <h1 className="page-title">Liste des Demandes d'analyse</h1>
          <p className="page-subtitle">
            {filteredRequests.length} demande
            {filteredRequests.length > 1 ? "s" : ""} trouvé
          </p>
        </div>
        <button className="btn-primary-add" onClick={() => setIsModalAddReqOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nouvelle Demande
        </button>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
         <div className="filters">
          <select className="filter-select">
            <option value="">Tous les statuts</option>
            <option value="Terminé">Terminé</option>
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
          </select>
        </div>
        
      </div>

      {/* Tableau Patients */}
      <div className="table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom & Prénom</th>
              <th>ID du patient</th>
              <th>Date de création</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests?.map((request) => (
              <tr
                key={request?.id}
              >
                <td>{request?.id}</td>
                <td>
                  <div className="patient-info">
                    <div className="patient-avatar">
                      {`${request?.patient?.firstname[0]}${request?.patient?.lastname[0]}`}
                    </div>
                    <div className="patient-details">
                      <div className="patient-name">{`${request?.patient?.firstname} ${request?.patient?.lastname}`}</div>
                    </div>
                  </div>
                </td>
                <td>{request?.patient?.id}</td>
                <td>{request?.createdAt.split('T')[0]}</td>
                <td>{getStatusBadge(request?.status)}</td>
                <td>
                  <div className="actions">
                    <button className="btn-icon" onClick={() => {setSelectedRequestId(request?.id),setIsModalViewOpen(true)}}>
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
      {filteredRequests.length === 0 && (
        <div className="empty-state">
          <h3>Aucun patient trouvé</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </div>
      )}


      {isModalAddReqOpen && (
  <React.Suspense fallback={<div>Chargement...</div>}>
    <AddAnalysisReqModal 
      patientId={selectedRequestId} 
      onClose={() => setIsModalAddReqOpen(false)} 
      token={token}
    />
  </React.Suspense>
)}
{isModalViewOpen && (
  <React.Suspense fallback={<div>Chargement...</div>}>
    <AnalysisReqModal 
      requestId={selectedRequestId} 
      onClose={() => setIsModalViewOpen(false)} 
      token={token}
    />
  </React.Suspense>
)}
    </div>
  )
}

export default AnalysisRequestsList
