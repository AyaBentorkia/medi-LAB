import React, { useEffect, useState } from "react"
import axios from "axios"
import "./AddResultModal.css"
import { CreateReport } from "../../apis/AnalysisReportApi";
import {
  X,
  User,
  Beaker,
  FlaskConical,
  Clipboard,
  FileText,
  MessageSquare,
} from "lucide-react";

const AddResultModal = ({onClose, analysisRequestId, token }) => {
    const [results, setResults] = useState([{ resultValue: "", comment: "" },]);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [analysisRequest, setAnalysisRequest] = useState({
    id:"",
    patient: { firstname: "", lastname: "" },
    analysisTypes: [{ title: "", unite: "", StandardValue: "" }],
  });

  useEffect(()=>{
    const fetchData = async () => {
        console.log("id de demande",analysisRequestId)
      try {
        const response = await axios.get(`http://localhost:5000/LabTechnician/analysis-requests/${analysisRequestId}`,
            {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          }
        );
        if(response.status === 200) {
            console.log(response.data)
            setAnalysisRequest(response?.data?.analysisRequest);}
            else {
  console.log("Erreur de récupération :", response.data);
}

      } catch (error) {
        console.error("Error fetching analysis request:", error);
      }
    };

    if (analysisRequestId) {
      fetchData();
    }
  },[analysisRequestId,token])

  //remplir le formulaire de resultats des analyses
    const onSubmit = async()=>{
        try{
            const analysisReqId = analysisRequest?.id;
            const response= await axios.post(`http://localhost:5000/LabTechnician/results/${analysisReqId}`, results,
        {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          }
      );
      console.log("object")
      if(response.status!== 200){
        setError(response.data.error || "Erreur lors de la création des résultats");
        return;
      }
      console.log("Résultats créés avec succès :", response.data);
      const responseReport= await CreateReport(token,analysisReqId);
            console.log("Report response :", responseReport);
      if(responseReport.status!== 200){
        setError(responseReport.data.error || "Erreur lors de la création de rapport");
        console.log("erreur rapport cherché ici : ",responseReport.data.error)
        return;
      }
        }
        
        catch (error) {
          setError(error.message || "Erreur lors de la création des résultats")
        }
    }
  // Initialise results quand analysisRequest change
  useEffect(() => {
    if (analysisRequest?.analysisTypes) {
      setResults(
        analysisRequest.analysisTypes.map(() => ({
          resultValue: "",
          comment: "",
        }))
      )
    }
  }, [analysisRequest])

  const handleResultChange = (index, field, value) => {
    setResults((prev) =>
      prev.map((result, i) =>
        i === index ? { ...result, [field]: value } : result
      )
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation : vérifier que toutes les valeurs sont remplies
    const emptyResults = results.some((result) => !result.resultValue.trim())
    if (emptyResults) {
      setError("Veuillez saisir toutes les valeurs de résultats")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit()
      setSuccess("Résultats créés avec succès !")
      setTimeout(() => {
        onClose()
        setSuccess("")
      }, 2000)
    } catch (err) {
      setError(err.message || "Erreur lors de la création des résultats")
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="modal-add-req-overlay">
      <div className="modal-add-req-content analysis-request-modal">
        {/* Header */}
        <div className="modal-add-req-header">
          <h2 className="modal-add-req-title">
            <FlaskConical size={20} className="icon-add-req" />
            Saisie des résultats d’analyse
          </h2>
          <button className="modal-add-req-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-add-req-body">
            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}

            {/* Section Patient */}
            <div className="form-add-req-section patient-add-req-info">
              <h3 className="section-add-req-title">
                <User size={16} className="icon-add-req" />
                Informations du patient
              </h3>
              <div className="form-add-req-group">
                <label>
                  <FileText size={14} className="icon-add-req" />
                  N° Demande
                </label>
                <input
                  type="text"
                  value={analysisRequest?.id || ""}
                  disabled
                />
              </div>
              <div className="form-add-req-group">
                <label>
                  <User size={14} className="icon-add-req" />
                  Nom du patient
                </label>
                <input
                  type="text"
                  value={`${analysisRequest?.patient?.firstname || ""} ${
                    analysisRequest?.patient?.lastname || ""
                  }`}
                  disabled
                />
              </div>
            </div>

            {/* Section Résultats */}
            <div className="form-add-req-section analyses-add-req-section">
              <h3 className="section-add-req-title">
                <Beaker size={16} className="icon-add-req" />
                Résultats d’analyse
              </h3>

              {analysisRequest?.analysisTypes?.map((analysis, index) => (
                <div key={index} className="form-add-req-section samples-add-req-section">
                  <h4 className="section-add-req-title">
                    <FlaskConical size={14} className="icon-add-req" />
                    {analysis.title}{" "}
                    {analysis.unite && (
                      <span
                        style={{
                          fontSize: "12px",
                          background: "#f3f4f6",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          color: "#374151",
                        }}
                      >
                        {analysis.unite}
                      </span>
                    )}
                  </h4>
                  {analysis.StandardValue && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        marginBottom: "8px",
                        fontStyle: "italic",
                      }}
                    >
                      Valeurs normales : {analysis.StandardValue}
                    </p>
                  )}

                  <div className="form-add-req-group">
                    <label>
                      <Beaker size={14} className="icon-add-req" />
                      Valeur du résultat *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : 7, 140/90, Positif..."
                      value={results[index]?.resultValue || ""}
                      onChange={(e) =>
                        handleResultChange(index, "resultValue", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-add-req-group">
                    <label>
                      <MessageSquare size={14} className="icon-add-req" />
                      Commentaire (optionnel)
                    </label>
                    <textarea
                      placeholder="Observations ou remarques..."
                      value={results[index]?.comment || ""}
                      onChange={(e) =>
                        handleResultChange(index, "comment", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Notes supplémentaires */}
            <div className="form-add-req-section notes-add-req-section">
              <h3 className="section-add-req-title">
                <Clipboard size={16} className="icon-add-req" />
                Notes internes
              </h3>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>
                Vérifiez soigneusement toutes les valeurs avant validation.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-add-req-footer">
            <button
              type="button"
              className="btn-add-req cancel-add-req-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-add-req submit-add-req-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer les résultats"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddResultModal
