import React, { useState, useEffect, useReducer } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Register.css";
import { useRegisterForm } from "../../hooks/useRegisterForm";


const Register = () => {
  const {email,dispatchEmail,
    password,dispatchPassword,
    fields,dispatchFields,
    phone,dispatchPhone,
    formIsValid,setFormIsValid,
    handleFieldBlur,handleFieldChange,
    backendError,setBackendError,
    successMessage,setSuccessMessage,
    onSubmit} = useRegisterForm()
  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-title-wrapper">
          <h2>Créer un compte</h2>
        </div>
        {backendError && <div className="error-message-backend">{backendError}</div>}
{successMessage && <div className="success-message">{successMessage}</div>}



        <form onSubmit={onSubmit} className="register-form">
          <div className="register-form-columns">
            {/* Colonne gauche */}
            <div className="register-side-container">
              <div className="form-group">
                <label htmlFor="firstname">Prénom</label>
                <input
                  type="text"
                  className="input-field"
                  id="firstname"
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

              <div className="form-group">
                <label htmlFor="lastname">Nom de famille</label>
                <input
                  type="text"
                  className="input-field"
                  id="lastname"
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

              <div className="form-group">
                <label htmlFor="cin">CIN</label>
                <input
                  type="text"
                  className="input-field"
                  id="cin"
                  name="cin"
                   value={fields.CIN.value}
                  onChange={handleFieldChange("CIN")}
                  onBlur={handleFieldBlur("CIN")}
                  required
                />
                {fields.CIN.error && (
                  <div className="error-message">{fields.CIN.error}</div>
                )}
              </div>

              <div className="form-group gender-group">
                <label>Genre</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="gender" value="Male" required />{" "}
                    Homme
                  </label>
                  <label>
                    <input type="radio" name="gender" value="Female" required />{" "}
                    Femme
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Numéro de téléphone</label>
                <input
                  type="text"
                  className="input-field"
                  id="phoneNumber"
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
            </div>

            {/* Colonne droite */}
            <div className="register-side-container">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="input-field"
                  id="email"
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

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  className="input-field"
                  id="password"
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

              <div className="form-group">
                <label htmlFor="adress">Adresse</label>
                <input
                  type="text"
                  className="input-field"
                  id="adress"
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

              <div className="form-group">
                <label htmlFor="birthdate">Date de naissance</label>
                <input
                  type="date"
                  className="input-field"
                  id="birthdate"
                  name="birthdate"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">Gouvernorat</label>
                <input
                  type="text"
                  className="input-field"
                  id="city"
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
          </div>

          {/* Footer */}
          <div className="register-footer-wrapper">
            <div className="register-btn-wrapper">
              <button
                className={`register-btn ${!formIsValid ? "disabled-btn" : ""}`}
                disabled={!formIsValid}
                type="submit"
              >
                S'inscrire
              </button>
            </div>

            <div className="register-footer">
              <p>
                Vous avez déjà un compte ?{" "}
                <NavLink to="/login">Se connecter</NavLink>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
