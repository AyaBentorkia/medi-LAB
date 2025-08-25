import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, X } from 'lucide-react';
import { useCreateUser } from '../../hooks/useCreateUser';
import { ROLES } from '../../Constants/Roles';


const AddUserModal = ({onClose,token}) => {
    const {
        email,dispatchEmail,
    password,dispatchPassword,
    fields,dispatchFields,
    phone,dispatchPhone,
    formIsValid,setFormIsValid,
    handleFieldBlur,handleFieldChange,
    backendError,setBackendError,
    successMessage,setSuccessMessage,
    onSubmit
    } = useCreateUser();
  return (
     <div className="modal-add-result-overlay analysis-request-modal">
      <div className="modal-add-result-content">
        {/* Header */}
        <div className="modal-add-result-header">
          <h2 className="modal-add-result-title">
            <span className="icon-add-result">👤</span>
            Ajouter un nouveau utilisateur
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
              <label><User size={14} /> Prénom</label>
              <input
                type="text"
                name="firstname"
                value={fields.firstname.value}
                  onChange={handleFieldChange("firstname")}
                  onBlur={handleFieldBlur("firstname")}
                  required
              />
              {fields.firstname.error && (
                  <div className="error-message">{fields.firstname.error}</div>
                )}
            </div>

            <div className="form-add-result-group">
              <label>Nom de famille</label>
              <input
                type="text"
                name="lastname"
                value={fields.lastname.value}
                  onChange={handleFieldChange("lastname")}
                  onBlur={handleFieldBlur("lastname")}
                  required
                />
                {fields.lastname.error && (
                  <div className="error-message">{fields.lastname.error}</div>
                )}
            </div>
            <div className="form-add-result-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                  value={email.value}
                  onChange={(e) =>
                    dispatchEmail({ name: "USER_TYPING", payload: e.target.value })
                  }
                  onBlur={() => dispatchEmail({ name: "USER_TYPING_DONE" })}
                  required
                />
                {email.error && <div className="error-message">{email.error}</div>}
              </div>

            <div className="form-add-result-group">
              <label><User size={14} /> Mot de passe</label>
              <input
                type="password"
                name="password"
               value={password.value}
                  onChange={(e) =>
                    dispatchPassword({ name: "USER_TYPING", payload: e.target.value })
                  }
                  onBlur={() => dispatchPassword({ name: "USER_TYPING_DONE" })}
                  required
                />
                {password.error && (
                  <div className="error-message">{password.error}</div>
                )}
            </div>

            <div className="form-add-result-group">
              <label><User size={14} /> CIN</label>
              <input
                type="text"
                name="CIN"
                 value={fields.CIN.value}
                  onChange={handleFieldChange("CIN")}
                  onBlur={handleFieldBlur("CIN")}
                  required
                />
                {fields.CIN.error && (
                  <div className="error-message">{fields.CIN.error}</div>
                )}
            </div>

            <div className="form-add-result-group">
              <label>Numéro de téléphone</label>
              <input
                type="text"
                name="phoneNumber"
               value={phone.value}
                  onChange={(e) =>
                    dispatchPhone({ name: "USER_TYPING", payload: e.target.value })
                  }
                  onBlur={() => dispatchPhone({ name: "USER_TYPING_DONE" })}
                  required
                />
                {phone.error && <div className="error-message">{phone.error}</div>}
              </div>
            <div className="form-add-result-group">
              <label>Role</label>
              <select 
              value={fields.role.value}
                  onChange={handleFieldChange("role")}
                  onBlur={handleFieldBlur("role")} >
                <option value={ROLES.PATIENT}>{ROLES.PATIENT}</option>
                            <option value={ROLES.ANALYST}>{ROLES.ANALYST}</option>
                            <option value={ROLES.SECRETARY}>{ROLES.SECRETARY}</option>
                            <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
                          </select>
            </div>

            <div className="form-add-result-group">
              <label><Calendar size={14} /> Date de naissance</label>
              <input
                type="date"
                name="birth_date"
                value={fields.birth_date.value}
                  onChange={handleFieldChange("birth_date")}
                  onBlur={handleFieldBlur("birth_date")}
                  required
                />
                {fields.birth_date.error && (
                  <div className="error-message">{fields.birth_date.error}</div>
                )}
            </div>

            <div className="form-add-result-group">
              <label>Adresse</label>
              <input
                type="text"
                name="adress"
               value={fields.adress.value}
                  onChange={handleFieldChange("adress")}
                  onBlur={handleFieldBlur("adress")}
                  required
                />
                {fields.adress.error && (
                  <div className="error-message">{fields.adress.error}</div>
                )}
            </div>

            <div className="form-add-result-group">
              <label><User size={14} /> Gouvernorat</label>
              <input
                type="text"
                name="city"
                value={fields.city.value}
                  onChange={handleFieldChange("city")}
                  onBlur={handleFieldBlur("city")}
                  required
                />
                {fields.city.error && (
                  <div className="error-message">{fields.city.error}</div>
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
            💾 Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddUserModal
