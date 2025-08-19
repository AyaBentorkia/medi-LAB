import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import "./AddAnalysisReqModal.css";
import { X, Calendar, Clipboard, Droplet, FlaskConical, TestTube, IdCard, Beaker } from 'lucide-react';
import axios from 'axios';

const AddAnalysisReqModal = ({ token, onClose}) => {
    const [analysisTypeOptions, setAnalysisTypeOptions]= useState([]);
    const [sampleOptions, setSampleOptions] = useState([]);
  const [backendError, setBackendError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    note: "",
    SamplingDate: "",
    analysisTypes: [],
    samples: [],
    CIN: ""
  });

  //Affichage
  useEffect(()=>{
    const fetchAnalysisTypes = async()=>{
        try{
            const response= await axios.get("http://localhost:5000/Secretary/analysis-types", {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 5000
            });
            // console.log(response?.data?.analysisTypes);
            setAnalysisTypeOptions(response?.data?.analysisTypes);
          }
          catch(error){
            console.error("Erreur lors de la récupération des types d'analyse :", error);
          }
        };

        const fetchSamples = async () => {
          try {
            const response = await axios.get("http://localhost:5000/Secretary/samples", {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 5000
            });
            // console.log(response?.data?.samples);
            setSampleOptions(response?.data?.samples);
          } catch (error) {
            console.error("Erreur lors de la récupération des échantillons :", error);
          }
        };
    fetchSamples();
    fetchAnalysisTypes();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (type, id) => {
    if (type === 'analysis') {
      setFormData(prev => {
        const newTypes = prev.analysisTypes.includes(id)
          ? prev.analysisTypes.filter(t => t !== id)
          : [...prev.analysisTypes, id];
        return { ...prev, analysisTypes: newTypes };
      });
    } else if (type === 'sample') {
      setFormData(prev => {
        const newSamples = prev.samples.includes(id)
          ? prev.samples.filter(s => s !== id)
          : [...prev.samples, id];
        return { ...prev, samples: newSamples };
      });
    }
  };

  const handleSubmit = async () => {
     setBackendError(null);
    setSuccessMessage(null);
    console.log("date : ", formData)
    // Validation des données
    if (!formData?.CIN || !formData?.SamplingDate || formData?.analysisTypes.length === 0 || formData?.samples.length === 0) {
      setBackendError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    // Formatage des données pour l'envoi
    const requestData = {
      ...formData,
      SamplingDate: new Date(formData?.SamplingDate).toISOString()
    };

    try{
        const response = await axios.post("http://localhost:5000/Secretary/analysis-requests", requestData, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });
        console.log("Demande d'analyse créée avec succès :", response.data);
        if(response.status !== 200) {
          setBackendError("Erreur lors de la création de la demande d'analyse");
          return;
        } else {
            console.log(response.data)
            setFormData({
              note: "",
              SamplingDate: "",
              analysisTypes: [],
              samples: [],
              CIN: ""
            });
          setSuccessMessage("Demande d'analyse créée avec succès !");
        }
      }
      catch(error){
        console.error("Erreur lors de la création de la demande d'analyse :", error);
        setBackendError("Erreur lors de la création de la demande d'analyse");
      }

  };

  return (
    <div className="modal-add-req-overlay">
      <div className="modal-add-req-content analysis-request-modal">
        <div className="modal-add-req-header">
          <h2 className="modal-add-req-title">
            <FlaskConical size={20} className="icon-add-req" />
            Nouvelle demande d'analyse
          </h2>
          <button className="modal-add-req-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-add-req-body">
          {backendError && <div className="alert error">{backendError}</div>}
          {successMessage && <div className="alert success">{successMessage}</div>}

          <div className="form-add-req-section sampling-info">
            <h3 className="section-add-req-title">
              <Droplet size={16} className="icon-add-req" />
              Informations patient
            </h3>
            <div className="form-add-req-group">
              <label htmlFor="cin">
                <IdCard size={14} className="icon-add-req" />
                CIN du patient
              </label>
              <input
                id="cin"
                type="text"
                name="CIN"
                value={formData?.CIN}
                onChange={handleChange}
                required
                placeholder="Numéro CIN"
              />
            </div>
          </div>

          <div className="form-add-req-section sampling-info">
            <h3 className="section-add-req-title">
              <Beaker size={16} className="icon-add-req" />
              Prélèvement
            </h3>
            <div className="form-add-req-group">
              <label htmlFor="samplingDate">
                <Calendar size={14} className="icon-add-req" />
                Date et heure de prélèvement
              </label>
              <input
                id="samplingDate"
                type="date"
                name="SamplingDate"
                value={formData?.SamplingDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-add-req-section analyses-section">
            <h3 className="section-add-req-title">
              <FlaskConical size={16} className="icon-add-req" />
              Analyses demandées
            </h3>
            <div className="checkbox-add-req-grid">
              {analysisTypeOptions?.map(option => (
                <div key={option.id} className="checkbox-add-req-item">
                  <input
                    type="checkbox"
                    id={`analysis-${option.id}`}
                    checked={formData?.analysisTypes?.includes(option.id)}
                    onChange={() => handleCheckboxChange('analysis', option.id)}
                  />
                  <label htmlFor={`analysis-${option.id}`}>
                    {/* {option?.icon} */}
                    {option?.title}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-add-req-section samples-section">
            <h3 className="section-add-req-title">
              <TestTube size={16} className="icon-add-req" />
              Échantillons
            </h3>
            <div className="checkbox-add-req-grid">
              {sampleOptions.map(option => (
                <div key={option.id} className="checkbox-add-req-item">
                  <input
                    type="checkbox"
                    id={`sample-${option.id}`}
                    checked={formData?.samples?.includes(option?.id)}
                    onChange={() => handleCheckboxChange('sample', option?.id)}
                  />
                  <label htmlFor={`sample-${option.id}`}>
                    {option?.icon}
                    {option?.title}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-add-req-section notes-section">
            <h3 className="section-add-req-title">
              <Clipboard size={16} className="icon-add-req" />
              Notes supplémentaires
            </h3>
            <div className="form-add-req-group">
              <textarea
                name="note"
                value={formData?.note}
                onChange={handleChange}
                placeholder="Notes ou commentaires..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="modal-add-req-footer">
          <button className="btn-add-req cancel-add-req-btn" onClick={onClose}>
            Annuler
          </button>
          <button className="btn-add-req submit-add-req-btn" onClick={handleSubmit}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAnalysisReqModal;