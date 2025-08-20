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
    <div className="modal-req-view-overlay">
      <div className="modal-req-view-container">
        {/* Header */}
        <div className="modal-req-view-header">
          <div>
            <h2>Demande d'analyse #{analysisRequest?.id}</h2>
            <div className="status-req-view-container">
              <span className={getStatusClass(analysisRequest?.status)}>
                {analysisRequest?.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="close-req-view-btn">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-req-view-content">
          {/* Patient Information */}
          <div className="section patient-req-view-info">
            <div className="section-req-view-title">
              <User size={20} />
              <h3>Informations du patient</h3>
            </div>
            <div className="grid-req-view">
              <div>
                <span>Nom complet:</span>
                <p>{analysisRequest?.patient?.firstname} {analysisRequest?.patient?.lastname}</p>
              </div>
              <div>
                <span>CIN:</span>
                <p>{analysisRequest?.patient?.CIN}</p>
              </div>
              <div>
                <span>Date de naissance:</span>
                <p>{new Date(analysisRequest?.patient?.birth_date).toLocaleDateString("fr-FR")}</p>
              </div>
              <div>
                <span>ID Patient:</span>
                <p>{analysisRequest?.patient?.id}</p>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="grid-req-view-2">
            <div className="details-req-view">
              <div className="detail-req-view-item">
                <Calendar size={20} />
                <div>
                  <span>Date de prélèvement:</span>
                  <p>{formatDate(analysisRequest?.SamplingDate)}</p>
                </div>
              </div>
              <div className="detail-req-view-item">
                <Clock size={20} />
                <div>
                  <span>Date de création:</span>
                  <p>{formatDate(analysisRequest?.createdAt)}</p>
                </div>
              </div>
            </div>

            {analysisRequest?.note && (
              <div className="note-req-view-box">
                <div className="note-req-view-title">
                  <FileText size={20} />
                  <span>Note:</span>
                </div>
                <p>{analysisRequest?.note}</p>
              </div>
            )}
          </div>

          {/* Analysis Types */}
          <div className="section-req-view">
            <div className="section-req-view-title">
              <TestTube size={20} />
              <h3>Types d'analyses</h3>
            </div>
            <div className="grid-req-view-3">
              {analysisRequest?.analysisTypes?.map((a) => (
                <div key={a?.id} className="card-req-view red">
                  <p className="title-req-view">{a?.title}</p>
                  {/* <p className="subtitle-req-view">ID: {a?.id}</p> */}
                </div>
              ))}
            </div>
          </div>

          {/* Samples */}
          <div className="section-req-view">
            <div className="section-req-view-title">
              <Droplet size={20} />
              <h3>Échantillons</h3>
            </div>
            <div className="grid-req-view-3">
              {analysisRequest?.samples?.map((s) => (
                <div key={s?.id} className="card-req-view teal">
                  <p className="title-req-view">{s?.title}</p>
                  {/* <p className="subtitle-req-view">ID: {s?.id}</p> */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-req-view-footer">
          <button onClick={onClose} className="btn-req-view cancel">Fermer</button>
          <button className="btn-req-view primary">Modifier</button>
        </div>
      </div>
    </div>
  )
}

export default AnalysisReqModal
