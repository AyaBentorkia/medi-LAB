import React, {useState, useEffect} from "react"
import { X, Calendar, Clock, User, FileText, TestTube, Droplet } from "lucide-react"
import "./AnalysisReqModal.css"
import axios from "axios";

const AnalysisReqModal = ({ analysisRequestId, token, onClose }) => {
  // if (!isOpen) return null
  const [analysisRequest, setAnalysisRequest] = useState({});
  const [error, setError] = useState(null);

    useEffect(() => {
    const fetchAnalysisReq = async () => {
      try {
        // setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/Auth/analysis-requests/${analysisRequestId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000 // 5s timeout
        });
        console.log("Réponse brute :", response.data);
        if (response.status === 200) {
          setAnalysisRequest(response?.data?.analysisRequest);
        } else {
          throw new Error('Réponse inattendue');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
      }
      //  finally {
      //   setIsLoading(false);
      // }
    }
    fetchAnalysisReq();
  }, [token,analysisRequestId])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "En cours":
        return "status-req-view status-req-view-pending"
      case "Terminé":
        return "status-req-view status-req-view-done"
      case "En attente":
        return "status-req-view status-req-view-waiting"
      default:
        return "status-req-view status-req-view-default"
    }
  }

  return (
     <div className="modal-add-result-overlay analysis-request-modal">
      <div className="modal-add-result-content">

        {/* Header */}
        <div className="modal-add-result-header">
          <h2 className="modal-add-result-title">
            <span className="icon-add-result">📄</span>
            Demande d'analyse #{analysisRequest?.id}
          </h2>
          <div className="status-req-view-container">
            <span className={getStatusClass(analysisRequest?.status)}>
              {analysisRequest?.status}
            </span>
          </div>
          <button type="button" className="modal-add-result-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-add-result-body">

          {/* Infos patient */}
          <div className="form-add-result-section patient-info-add-result">
            <h3 className="section-add-result-title">
              <User size={16} className="icon-add-result" />
              Informations du patient
            </h3>
            <div className="grid-req-view">
              <div className="form-add-result-group">
                <label>Nom complet:</label>
                <input type="text" value={`${analysisRequest?.patient?.firstname || ""} ${analysisRequest?.patient?.lastname || ""}`} disabled />
              </div>
              <div className="form-add-result-group">
                <label>CIN:</label>
                <input type="text" value={analysisRequest?.patient?.CIN || ""} disabled />
              </div>
              <div className="form-add-result-group">
                <label>Date de naissance:</label>
                <input type="text" value={new Date(analysisRequest?.patient?.birth_date).toLocaleDateString("fr-FR")} disabled />
              </div>
              <div className="form-add-result-group">
                <label>ID Patient:</label>
                <input type="text" value={analysisRequest?.patient?.id || ""} disabled />
              </div>
            </div>
          </div>

          {/* Détails */}
          <div className="form-add-result-section analyses-add-result-section">
            <h3 className="section-add-result-title">
              <Calendar size={16} className="icon-add-result" />
              Détails de la demande
            </h3>
            <div className="form-add-result-group">
              <label><Calendar size={14} /> Date de prélèvement:</label>
              <input type="text" value={formatDate(analysisRequest?.SamplingDate)} disabled />
            </div>
            <div className="form-add-result-group">
              <label><Clock size={14} /> Date de création:</label>
              <input type="text" value={formatDate(analysisRequest?.createdAt)} disabled />
            </div>
            {analysisRequest?.note && (
              <div className="form-add-result-group">
                <label><FileText size={14} /> Note:</label>
                <textarea value={analysisRequest?.note} disabled />
              </div>
            )}
          </div>

          {/* Types d'analyses */}
          <div className="form-add-result-section">
            <h3 className="section-add-result-title">
              <TestTube size={16} className="icon-add-result" />
              Types d'analyses
            </h3>
            <div className="grid-req-view-3">
              {analysisRequest?.analysisTypes?.map((a) => (
                <div key={a?.id} className="card-req-view red">
                  <p className="title-req-view">{a?.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Échantillons */}
          <div className="form-add-result-section">
            <h3 className="section-add-result-title">
              <Droplet size={16} className="icon-add-result" />
              Échantillons
            </h3>
            <div className="grid-req-view-3">
              {analysisRequest?.samples?.map((s) => (
                <div key={s?.id} className="card-req-view teal">
                  <p className="title-req-view">{s?.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-add-result-footer">
          <button type="button" className="cancel-add-result-btn btn-add-result" onClick={onClose}>
            Fermer
          </button>
          <button type="button" className="submit-add-result-btn btn-add-result">
            ✏️ Modifier
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnalysisReqModal
