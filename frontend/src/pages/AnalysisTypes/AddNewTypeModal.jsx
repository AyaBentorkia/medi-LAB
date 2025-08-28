import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, X } from 'lucide-react';
import { CreateNewType } from '../../apis/AnalysisTypesApi';
import { useCreateType } from '../../hooks/useTypes';

const AddNewTypeModal = ({  onClose }) => {
   const {
    fields,dispatchFields,
    formIsValid,setFormIsValid,
    handleFieldBlur,handleFieldChange,
    backendError,setBackendError,
    successMessage,setSuccessMessage,
    onSubmit,
  } = useCreateType();
  return (
     <div className="modal-add-result-overlay analysis-request-modal">
        <div className="modal-add-result-content">
          {/* Header */}
          <div className="modal-add-result-header">
            <h2 className="modal-add-result-title">
              <span className="icon-add-result">👤</span>
              Ajouter un nouveau type d'analyse
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
                Informations personnelles
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
  
              <div className="form-add-result-group">
                <label>Description</label>
                <input
                  type="textarea"
                  name="description"
                  value={fields?.description.value}
                    onChange={handleFieldChange("description")}
                    onBlur={handleFieldBlur("description")}
                    required
                  />
                  {fields?.description.error && (
                    <div className="error-message">{fields?.description.error}</div>
                  )}
              </div>
              <div className="form-add-result-group">
                <label>Unité</label>
                <input
                  type="text"
                  name="unite"
                    value={fields?.unite.value}
                    onChange={handleFieldChange("unite")}
                    onBlur={handleFieldBlur("unite")}
                    required
                  />
                  {fields?.unite.error && <div className="error-message">{fields?.unite.error}</div>}
                </div>
                 <div className="form-add-result-group">
                <label>Valeur standard</label>
                <input
                  type="text"
                  name="StandardValue"
                    value={fields?.StandardValue.value}
                    onChange={handleFieldChange("StandardValue")}
                    onBlur={handleFieldBlur("StandardValue")}
                    required
                  />
                  {fields?.unite.error && <div className="error-message">{fields?.unite.error}</div>}
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
              💾 Enregistrer
            </button>
          </div>
        </div>
      </div>
  );
}


export default AddNewTypeModal
