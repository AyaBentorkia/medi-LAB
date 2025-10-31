import React, { useEffect, useState } from "react"
import axios from "axios"
import "./AddResultModal.css"
import { CreateReport } from "../../apis/AnalysisReportApi";

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
    <div className="modal-add-result-overlay analysis-request-modal">
      <div className="modal-add-result-content">
        {/* Header */}
        <div className="modal-add-result-header">
          <h2 className="modal-add-result-title">
            <span className="icon-add-result">🧪</span>
            Saisie des Résultats d'Analyse
          </h2>
          <button type="button" className="modal-add-result-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-add-result-body">
            {/* Alerts */}
            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}

            {/* Patient Info Section */}
            <div className="form-add-result-section patient-info-add-result">
              <h3 className="section-add-result-title">
                <span className="icon-add-result">👤</span>
                Informations Patient
              </h3>
              <div className="form-add-result-group">
                <label>
                  <span className="icon-add-result">📋</span>
                  Demande N° {analysisRequest?.id}
                </label>
                <input
                  type="text"
                    value={`${analysisRequest?.patient?.firstname || ""} ${analysisRequest?.patient?.lastname || ""}`}
                  disabled
                  style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="form-add-result-section analyses-add-result-section">
              <h3 className="section-add-result-title">
                <span className="icon-add-result">🔬</span>
                Résultats d'Analyse ({analysisRequest?.analysisTypes?.length} analyses)
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {analysisRequest?.analysisTypes?.map((analysisType, index) => (
                  <div
                    key={analysisType?.id}
                    style={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "16px",
                      borderLeft: "4px solid #f59e0b",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#374151",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span className="icon-add-result">⚗️</span>
                      {analysisType?.title}
                      {analysisType?.unite && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            background: "#f3f4f6",
                            padding: "2px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {analysisType?.unite}
                        </span>
                      )}
                    </h4>

                    {analysisType?.StandardValue && (
                      <p
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: "13px",
                          color: "#6b7280",
                          fontStyle: "italic",
                        }}
                      >
                        Valeurs normales: {analysisType?.StandardValue}
                      </p>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
                      <div className="form-add-result-group">
                        <label>
                          <span className="icon-add-result">📊</span>
                          Valeur du résultat *
                        </label>
                        <input
                          type="text"
                          value={results[index]?.resultValue || ""}
                          onChange={(e) => handleResultChange(index, "resultValue", e.target.value)}
                          placeholder="Ex: 7, 140/90, Positif..."
                          required
                        />
                      </div>

                      <div className="form-add-result-group">
                        <label>
                          <span className="icon-add-result">💬</span>
                          Commentaire (optionnel)
                        </label>
                        <input
                          type="text"
                          value={results[index]?.comment || ""}
                          onChange={(e) => handleResultChange(index, "comment", e.target.value)}
                          placeholder="Ex: Légèrement au-dessus de la normale..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-add-result-footer">
            <button type="button" className="cancel-add-result-btn btn-add-result" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </button>
            <button type="submit" className="submit-add-result-btn btn-add-result" disabled={isSubmitting}>
              <span className="icon-add-result"></span>
              {isSubmitting ? "Enregistrement..." : "Enregistrer les Résultats"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddResultModal
