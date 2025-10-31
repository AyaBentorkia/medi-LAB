import React, { useEffect, useMemo, useState } from "react";
import "../Patients/PatientsList.css";
import { Eye, FilePlus, Trash } from "lucide-react";
import { GetAnalysisReqList, UpdateRequestStatus } from "../../apis/AnalysisRequestApi";
import { ROLES } from "../../Constants/Roles";
import { useFetchRequests } from "../../hooks/useFetchRequests";
import { useFilterStatus, useSearchFilter } from "../../hooks/useSerachFilter";
import Pagination from "../../components/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { useGetReportByRequestId } from "../../hooks/useFetchReports";

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
  verifyReportSubmitted,

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
                  {role === ROLES.ANALYST ? (
                    <select
                    className="select-manage-status"
                      value={request?.status}
                      onChange={(e) =>
                        handleStatusChange(request?.id, e.target.value)
                      }
                    >
                      <option value="En attente">En attente</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                      <option value="Annulé">Annulé</option>
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
                    {role === ROLES.ANALYST ? (
                      
                      <button
  className={`${verifyReportSubmitted(request)}`}
  disabled={request.status === "Terminé" || request.status==="En cours"}
  onClick={() => {
    if (request.status !== "Terminé" || request.status!=="En cours") {
      onViewRequest(false);
      onAddRequest(false);
      onAddResult(true);
    }
  }}
>
  <FilePlus size={18} />
</button>

                    ) : (
                       null
                    )}
                  </div>
                </td>
              </tr>
  );
});

const AnalysisReqList = () => {
  // const [selectedRequest, setSelectedRequest] = useState([]);
  const [isModalAddReqOpen, setIsModalAddReqOpen] = useState(false);
  const [isModalAddResultOpen, setIsModalAddResultOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
        //recuperer demandes hook
const {
        token,role,
        isLoading,setIsLoading,
        requests,setRequests,
        statusChanged,setStatusChanged
      }= useFetchRequests();
      //pagination hook
  const {
      data: filteredRequests,
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
    } = usePagination(requests, 10,'request');

   // Vérifie si le rapport est soumis OU si la demande est terminée
const verifyReportSubmitted = React.useCallback((request) => {
  const { reportId } = useGetReportByRequestId(request.id);

  let className = "btn-icon-add-file";

  // Si le rapport existe OU si le statut est "Terminé" → on désactive
  if (request.status === "Terminé" || request.status=== "En cours") {
    className = "disabled-add-file-btn";
  }

  return className;
}, []);

      
    // Fonction pour ouvrir la visualisation d'une demande specifique
  const handleViewRequest = React.useCallback((requestId) => {
    console.log("requestId : ",requestId)
    setIsModalAddResultOpen(false);
    setIsModalAddReqOpen(false);
    setSelectedRequestId(requestId);
    setIsModalViewOpen(true);
  }, []);
      // Fonction pour ajouter une demande (secretaire)
  const handleAddRequest = React.useCallback((requestId) => {
    setIsModalViewOpen(false);
    setIsModalAddResultOpen(false);
    setSelectedRequestId(requestId);
    setIsModalAddReqOpen(true);
  }, []);
      // Fonction pour ajouter les resultats d'une demande d'analyse
  const handleAddResult = React.useCallback((requestId) => {
    setIsModalViewOpen(false);
    setIsModalAddReqOpen(false);
    setSelectedRequestId(requestId);
    setIsModalAddResultOpen(true);
  }, []);

     // Fonction pour changer le statut de d'une demande d'analyse
    const handleStatusChange = async (requestId, newStatus) => {
    try {
      await UpdateRequestStatus(token,requestId,newStatus);
      setStatusChanged(true);
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
  
  //pour changer le style de chaque statut
  const getStatusBadge = (status) => {
    console.log("status:",status)
    const statusConfig = {
      "Terminé": { label: "Terminé", className: "status-active" },
      "En attente": { label: "En attente", className: "status-pending" },
      "En cours": { label: "En cours", className: "status-inactive" },
      "Annulé": { label: "Annulé", className: "status-inactive" },
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
            {totalItems} demande
            {totalItems > 1 ? "s" : ""} trouvé
            {isLoading ? " (chargement...)" : ""}
          </p>
        </div>
        {role === ROLES.SECRETARY && (
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
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
         <div className="filters">
          <select className="filter-select" value={selectedFilter} 
  onChange={(e) => setFilter(e.target.value)}
            >
            <option value="">Tous les statuts</option>
            <option value="Terminé">Terminé</option>
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Annulé">Annulé</option>
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
            ): filteredRequests.length === 0 ? (
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
                verifyReportSubmitted={()=>verifyReportSubmitted(request)}
              />
              ))
            )}

          </tbody>
        </table>
      </div>

      {/* État vide */}
      {!isLoading && filteredRequests.length === 0 && searchTerm && (
        <div className="empty-state">
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
      {/* Pagination */}
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
  );
};

export default AnalysisReqList;
