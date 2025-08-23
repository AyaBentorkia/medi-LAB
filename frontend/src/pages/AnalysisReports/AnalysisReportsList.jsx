import React, { useEffect, useMemo, useState } from "react";
// import "../Patients/PatientsList.css";
import { Download, Eye, FilePlus, Send, Trash } from "lucide-react";
import axios from "axios";
const ReportActionModal= React.lazy(()=> import("./ReportActionModal"));

const ReportRow= React.memo(({
    report, onDelete, onSendEmail
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
                      <button 
                        className="btn-icon-add-file" 
                      onClick={() => onSendEmail(report, "send")} >
                        <Send size={18} /> 
                      </button>
                      <button 
                        className="btn-icon-add-file" 
                      onClick={() => onDelete(report)} >
                        <Trash size={18} /> 
                      </button>
                </div>
            </td>
        </tr>
    )
});

const AnalysisReportsList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [reports, setReports] = useState([]);
    const token = localStorage.getItem("token");
    const role= localStorage.getItem("role");
    const [isModalViewReportOpen, setIsModalViewReportOpen] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedFileUrl,setSelectedFileUrl]=useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionType, setActionType] = useState("");
    useEffect(()=>{
        const fetchReports= async()=>{
            const cacheKey = 'reports_data';
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      const now = new Date().getTime();      
      if (cachedData && cacheTimestamp && now - cacheTimestamp < 300000) {
        setReports(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        let response ;
        if(role==='Patient'){
           response= await axios.get(
          "http://localhost:5000/Patient/reports",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          }
        );
        }
        else{
          response= await axios.get(
          "http://localhost:5000/LabTechnician/reports",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          }
        );
        }
        
        console.log("reports : ",response.data.reports);
        setReports(response?.data?.reports);
        localStorage.setItem(cacheKey, JSON.stringify(response?.data?.reports));
        localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
        
      } catch (error) {
        console.error("Error fetching patients:", error);
     if (cachedData) {
          setReports(JSON.parse(cachedData));
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchReports();
    },[token])
const filteredReports= useMemo(()=>{
    if(!reports.length ) return [];

    return reports.filter((report)=>{
      const fullName = `${report?.request?.patient?.firstname || ''} ${report?.request?.patient?.lastname || ''}`.toLowerCase();
    return (
        fullName.includes(searchTerm.toLowerCase())
      );
    })
  }, [reports, searchTerm]);

   const handleDeleteReport = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/reports/${selectedReport.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Mettre à jour la liste localement
      setReports(reports.filter(r => r.id !== selectedReport.id));
      setIsActionModalOpen(false);
      
      // Nettoyer le cache
      localStorage.removeItem('reports_data');
      localStorage.removeItem('reports_data_timestamp');
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
    };
     // Fonction pour ouvrir le modal d'action
  const handleAction = (report, type) => {
    setSelectedReport(report);
    setActionType(type);
    setIsActionModalOpen(true);
  };
  const handleSendReport= async()=>{
    return;
  }

 
  const handleViewReport= React.useCallback((reportId,fileUrl)=>{
    setIsModalViewReportOpen(true);
        setSelectedReportId(reportId);
        setSelectedFileUrl(fileUrl)
  })

  return (
    <div className="patients-list-container">
          {/* Header */}
          <div className="patients-header">
            <div className="header-content">
              <h1 className="page-title">Liste des Rapports de Resultat d'analyse</h1>
              <p className="page-subtitle">
                {filteredReports.length} rapports
                {filteredReports.length > 1 ? "s" : ""} trouvé
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
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default AnalysisReportsList
