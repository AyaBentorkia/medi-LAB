import React from 'react'
import { useFetchTypes } from '../../hooks/useTypes';
import { X, User } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';

const EditAnalysisTypeModal = ({type,selectedtypeId,onClose}) => {
    console.log("typeid : ",selectedtypeId)
    const {
        handleUpdateType}= useFetchTypes();
         const [formData, setFormData] = useState({});
        useEffect(() => {
  if (type) {
    setFormData(type);
  }
}, [type]);
          const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
          };
    return (
   <div className="modal-add-result-overlay analysis-request-modal">
      <div className="modal-add-result-content">
        {/* Header */}
        <div className="modal-add-result-header">
          <h2 className="modal-add-result-title">
            <span className="icon-add-result">👤</span>
            Modifier le type d'analyse
          </h2>
          <button
            type="button"
            className="modal-add-result-close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-add-result-body">
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
                value={formData.title || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-add-result-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-add-result-group">
              <label><User size={14} /> Unité</label>
              <input
                type="text"
                name="unite"
                value={formData.unite || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-add-result-group">
              <label><User size={14} /> Valeur standard</label>
              <input
                type="text"
                name="StandardValue"
                value={formData.StandardValue || ""}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>

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
            type="button"
            className="submit-add-result-btn btn-add-result"
            onClick={() => handleUpdateType(selectedtypeId,formData)}
          >
            💾 Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAnalysisTypeModal
