import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, X } from 'lucide-react';
import { useCreateSample } from '../../hooks/useSamples';

const AddSampleModal = ({onClose}) => {
    const { 
     fields,
    dispatchFields,
    formIsValid,
    setFormIsValid,
    handleFieldBlur,
    handleFieldChange,
    backendError,
    setBackendError,
    successMessage,
    setSuccessMessage,
    onSubmit} = useCreateSample()
  return (
 <div className="modal-add-result-overlay analysis-request-modal">
        <div className="modal-add-result-content">
          {/* Header */}
          <div className="modal-add-result-header">
            <h2 className="modal-add-result-title">
              <span className="icon-add-result">👤</span>
              Ajouter un nouveau type de prelevement d'analyse
            </h2>
            <button
              type="button"
              className="modal-add-result-close-btn"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
           {backendError && <div className="error-message-backend">{backendError}</div>}
  {successMessage && <div className="success-message">{successMessage}</div>}
  
  
          {/* Body */}
          <form onSubmit={onSubmit} className="modal-add-result-body">
            <div className="form-add-result-section">
              <h3 className="section-add-result-title">
                <span className="icon-add-result">📝</span>
                Informations 
              </h3>
  
              <div className="form-add-result-group">
                <label><User size={14} /> Titre</label>
                <input
                  type="text"
                  name="title"
                  value={fields?.title?.value}
                    onChange={handleFieldChange("title")}
                    onBlur={handleFieldBlur("title")}
                    required
                />
                {fields?.title.error && (
                    <div className="error-message">{fields?.title.error}</div>
                  )}
              </div>
  
           </div>
          </form>
  
          {/* Footer */}
          <div className="modal-add-result-footer">
            <button
              type="button"
              className="cancel-add-result-btn btn-add-result"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              className={`submit-add-result-btn btn-add-result ${!formIsValid ? "disabled-btn" : ""}`}
              disabled={!formIsValid}
              onClick={onSubmit}
                  type="submit" >
               Enregistrer
            </button>
          </div>
        </div>
      </div>
  )
}

export default AddSampleModal
