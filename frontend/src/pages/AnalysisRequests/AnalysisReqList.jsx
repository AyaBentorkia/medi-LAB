import React, { useEffect, useMemo, useState } from "react";
import "../Patients/PatientsList.css";
import { Eye, FilePlus } from "lucide-react";
import axios from "axios";

const AddAnalysisReqModal = React.lazy(() => import("./AddAnalysisReqModal"));
const AnalysisReqModal = React.lazy(() => import("./AnalysisReqModal"));
const AddResultModal = React.lazy(() => import("../AnalysisResults/AddResultModal"));

const AnalysisReqRow= React.memo(({
  request,
  role,
  handleStatusChange,
  getStatusBadge,
  onViewRequest,
  onAddResult,
  onAddRequest,

}) => {
  return (
    <tr key={request?.id}>
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
                <td>{request?.createdAt.split("T")[0]}</td>
                <td>
                  {" "}
                  {role === "Technicien de laboratoire" ? (
                    <select
                      value={request?.status}
                      onChange={(e) =>
                        handleStatusChange(request?.id, e.target.value)
                      }
                    >
                      <option value="En attente">En attente</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                    </select>
                  ) : (
                    getStatusBadge(request?.status)
                  )}
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-icon"
                      onClick={() => {
                        onAddRequest(false);
                        onAddResult(false);
                        onViewRequest(true);
                      }}
                    >
                      <Eye size={18} />
                    </button>
                    {role === "Technicien de laboratoire" ? (
                      <button className="btn-icon-add-file">
                        <FilePlus
                        size={18}
                          onClick={() => {
                            onViewRequest(false);
                            onAddRequest(false);
                            onAddResult(true);
                          }}
                    />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
  );
});

const AnalysisReqList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [isModalAddReqOpen, setIsModalAddReqOpen] = useState(false);
  const [isModalAddResultOpen, setIsModalAddResultOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const cacheKey = 'requests_data';
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      const now = new Date().getTime();      
      if (cachedData && cacheTimestamp && now - cacheTimestamp < 300000) {
        setRequests(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:5000/Auth/analysis-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          }
        );
        console.log("requests : ",response.data.analysisRequests);
        setRequests(response?.data?.analysisRequests);
        localStorage.setItem(cacheKey, JSON.stringify(response?.data?.analysisRequests));
        localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
        
      } catch (error) {
        console.error("Error fetching patients:", error);
     if (cachedData) {
          setRequests(JSON.parse(cachedData));
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchRequests();
  }, [token]);

  const filteredRequests= useMemo(()=>{
    if(!requests.length ) return [];

    return requests.filter((request)=>{
      const fullName = `${request?.patient?.firstname || ''} ${request?.patient?.lastname || ''}`.toLowerCase();
    return (
        fullName.includes(searchTerm.toLowerCase())
      );
    })
  }, [requests, searchTerm]);

  const handleViewRequest = React.useCallback((requestId) => {
    console.log("requestId : ",requestId)
    setIsModalAddResultOpen(false);
    setIsModalAddReqOpen(false);
    setSelectedRequestId(requestId);
    setIsModalViewOpen(true);
  }, []);
  const handleAddRequest = React.useCallback((requestId) => {
    setIsModalViewOpen(false);
    setIsModalAddResultOpen(false);
    setSelectedRequestId(requestId);
    setIsModalAddReqOpen(true);
  }, []);
  const handleAddResult = React.useCallback((requestId) => {
    setIsModalViewOpen(false);
    setIsModalAddReqOpen(false);
    setSelectedRequestId(requestId);
    setIsModalAddResultOpen(true);
  }, []);

 
    const handleStatusChange = async (requestId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/LabTechnician/analysis-requests/${requestId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Met à jour localement pour que ça s'affiche direct
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Erreur maj statut:", error);
    }
  };

  const getStatusBadge = (status) => {
    console.log("status:",status)
    const statusConfig = {
      Terminé: { label: "Terminé", className: "status-active" },
      "En attente": { label: "En attente", className: "status-pending" },
      "En cours": { label: "En cours", className: "status-inactive" },
    };

    const config = statusConfig[status] || statusConfig.active;

    return <span className={`status-badge ${config.className}`}>{status}</span>;
  };
  return (
    <div className="patients-list-container">
      {/* Header */}
      <div className="patients-header">
        <div className="header-content">
          <h1 className="page-title">Liste des Demandes d'analyse</h1>
          <p className="page-subtitle">
            {filteredRequests.length} demande
            {filteredRequests.length > 1 ? "s" : ""} trouvé
            {isLoading ? " (chargement...)" : ""}
          </p>
        </div>
        {role === "Secrétaire d'accueil" && (
          <button className="btn-primary-add" onClick={() => setIsModalAddReqOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouvelle Demande
          </button>
        )}
      </div>
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
            {isLoading ? (
              <tr>
                <td colSpan="6" className="loading-skeleton">Chargement...</td>
              </tr>
            ): filteredRequests?.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  Aucun demande trouvé
                </td>
              </tr>
            ):(
              filteredRequests?.map((request)=>(
                <AnalysisReqRow 
                key={request?.id} 
                request={request}
                role={role}
                onViewRequest={() => handleViewRequest(request.id)}
                onAddRequest={() => handleAddRequest(request.id)}
                onAddResult={() => handleAddResult(request.id)}
                handleStatusChange={handleStatusChange}
                getStatusBadge={getStatusBadge}
              />
              ))
            )}

          </tbody>
        </table>
      </div>

      {/* État vide */}
      {!isLoading && filteredRequests.length === 0 && searchTerm && (
        <div className="empty-state">
          <h3>Aucun demande trouvé</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </div>
      )}

      {isModalAddReqOpen && (
        <React.Suspense fallback={<div>Chargement...</div>}>
          <AddAnalysisReqModal
            onClose={() => setIsModalAddReqOpen(false)}
            token={token}
          />
        </React.Suspense>
      )}
      {isModalViewOpen && selectedRequestId && (
        <React.Suspense fallback={<div>Chargement...</div>}>
          <AnalysisReqModal
            analysisRequestId={selectedRequestId}
            onClose={() => setIsModalViewOpen(false)}
            token={token}
          />
        </React.Suspense>
      )}
      {isModalAddResultOpen && selectedRequestId && (
        <React.Suspense fallback={<div>Chargement...</div>}>
          <AddResultModal
            onClose={() => setIsModalAddResultOpen(false)}
            analysisRequestId={selectedRequestId}
            token={token}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default AnalysisReqList;
