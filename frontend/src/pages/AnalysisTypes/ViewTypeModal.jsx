import React from 'react'
import { fetchOneType } from '../../hooks/useTypes'
import { X, Calendar, Clock, User, FileText, TestTube, Droplet } from "lucide-react"


const ViewTypeModal = ({ selectedtypeId, onClose }) => {
    const   {
        token,
        isLoading,
        setIsLoading,
        type,setType
      } = fetchOneType(selectedtypeId) ;
 const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  return (
     <div className="modal-add-result-overlay analysis-request-modal">
      <div className="modal-add-result-content">

        {/* Header */}
        <div className="modal-add-result-header">
          <h2 className="modal-add-result-title">
            <span className="icon-add-result">📄</span>
            Demande d'analyse #{type?.id}
          </h2>
       
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
              Informations du type d'analyse
            </h3>
            <div className="grid-req-view">
              <div className="form-add-result-group">
                <label>Titre:</label>
                <input type="text" value={type?.title || ""} disabled />
              </div>
              <div className="form-add-result-group">
                <label>Description:</label>
                <input type="text" value={type?.description || ""} disabled />
              </div>
              <div className="form-add-result-group">
                <label>Valeur standard:</label>
                <input type="text" value={type?.StandardValue || ""} disabled />
              </div>
              <div className="form-add-result-group">
                <label>Unité:</label>
                <input type="text" value={type?.unite || ""} disabled />
              </div>
            </div>
          </div>

          {/* Détails */}
          <div className="form-add-result-section analyses-add-result-section">
            <h3 className="section-add-result-title">
              <Calendar size={16} className="icon-add-result" />
              Détails du type d'analyse
            </h3>
            <div className="form-add-result-group">
              <label><Clock size={14} /> Date de création:</label>
              <input type="text" value={formatDate(type?.createdAt)} disabled />
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="modal-add-result-footer">
          <button type="button" className="cancel-add-result-btn btn-add-result" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewTypeModal
