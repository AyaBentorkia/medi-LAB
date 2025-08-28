import React, { useEffect, useMemo, useState } from "react";
// import "../Patients/PatientsList.css";
import {  Eye, Send, Trash } from "lucide-react";
import { DeleteReport, SendReportByMail } from "../../apis/AnalysisReportApi";
const ReportActionModal= React.lazy(()=> import("./ReportActionModal"));
import { ROLES } from "../../Constants/Roles";
import { useFetchReports } from "../../hooks/useFetchReports";
import { useSearchFilter } from "../../hooks/useSerachFilter";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const ReportRow= React.memo(({
    report, onDelete, onSendEmail, role,
})=>{
    return (
        <tr key={report?.id}>
            <td>{report?.id}</td>
            <td>
                <div className="patient-info">
                    <div className="patient-details">
                        <div className="patient-name">
                            {report?.fileName}
                        </div>
                    </div>
                </div>
            </td>
            <td className="patient-name">{`${report?.request?.patient?.firstname } ${report?.request?.patient?.lastname}`}</td>
            <td>{`${report?.technician?.firstname} ${report?.technician?.lastname}`}</td>
            <td>{report?.createdAt.split("T")[0]}</td>
            <td>
                <div className="actions">
                      <button 
                        className="btn-icon" 
                        onClick={() => window.open(report?.fileUrl, "_blank")}
                      >
                        <Eye size={18} /> 
                      </button>
                      {role===ROLES.ANALYST ? (
                        <>
                      <button 
                        className="btn-icon-add-file" 
                      onClick={() => onSendEmail(report, "send")} >
                        <Send size={18} /> 
                      </button>
                      <button 
                        className="btn-icon-delete-file" 
                      onClick={() => onDelete(report)} >
                        <Trash size={18} /> 
                      </button>
                      </>
                      ):(
                        <></>
                      )}
                </div>
            </td>
        </tr>
    )
});

const AnalysisReportsList = () => {
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionType, setActionType] = useState("");
  const [message,setMessage]=useState("");
  const {
            role,token,
            isLoading,setIsLoading,
            reports,setReports
        } = useFetchReports();
   
const {
    data: filteredReports,
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
  } = usePagination(reports, 10);
//delete report
   const handleDeleteReport = async () => {
    try {
      const response=await DeleteReport(token,selectedReport.id)
       if(response.status!==200){
      setMessage("Essayez plus tards")
      return;
    }

  setMessage("Rapport envoyé avec succés")
          setIsActionModalOpen(false);
      // Mettre à jour la liste localement
      setReports(reports.filter(r => r.id !== selectedReport.id));
      setIsActionModalOpen(false);
      
      localStorage.removeItem('reports_data');
      localStorage.removeItem('reports_data_timestamp');

    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
    finally {
        setIsLoading(false);
      }
    };
     // Fonction pour ouvrir le modal d'action
  const handleAction = (report, type) => {
    setSelectedReport(report);
    setActionType(type);
    setIsActionModalOpen(true);
  };
  // Fonction pour envoyer le rapport dans le modal 
  const handleSendReport= async(reportId)=>{
    try{
    const response= await SendReportByMail(token,reportId);
    if(response.status!==200){
      setMessage("Essayez plus tards")
      return;
    }

  setMessage("Rapport envoyé avec succés")
          return;
    }
   catch (error) {
      console.error("Erreur lors de l envoi:", error);
    }
    finally {
        setIsLoading(false);
      }
  }

  return (
    <div className="patients-list-container">
          {/* Header */}
          <div className="patients-header">
            <div className="header-content">
              <h1 className="page-title">Liste des Rapports de Resultat d'analyse</h1>
              <p className="page-subtitle">
                {totalItems} rapports
                {totalItems > 1 ? "s" : ""} trouvé
                {isLoading ? " (chargement...)" : ""}
              </p>
            </div>
          </div>
           <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ..."
                value={searchTerm}
                onChange={(e) => searchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
          </div>
          {/* Tableau Patients */}
          <div className="table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom du rapport</th>
                  <th>Patient</th>
                  <th>Technicien de laboratoire</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="loading-skeleton">Chargement...</td>
                  </tr>
                ): filteredReports?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      Aucun rapport trouvé
                    </td>
                  </tr>
                ):(
                  filteredReports?.map((report)=>(
                    <ReportRow 
                    key={report?.id} 
                    report={report}
                    onSendEmail={handleAction}
                    onDelete={handleAction}
                    role={role}
                  />
                  ))
                )}
    
              </tbody>
            </table>
          </div>
    
          {/* État vide */}
          {!isLoading && filteredReports.length === 0 && searchTerm && (
            <div className="empty-state">
              <h3>Aucun rapport trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          )}
    
          {isActionModalOpen && (
        <React.Suspense fallback={<div>Chargement...</div>}>
          <ReportActionModal
            isOpen={isActionModalOpen}
            onClose={() => setIsActionModalOpen(false)}
            report={selectedReport}
            actionType={actionType}
            token={token}
            handleDeleteReport={handleDeleteReport}
            handleSendReport={handleSendReport}
            message={message}
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

export default AnalysisReportsList
