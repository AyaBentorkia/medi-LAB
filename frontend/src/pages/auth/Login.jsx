import React, { useState, useEffect, useReducer, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Login.css";
import { useLoginForm } from "../../hooks/useLoginForm";

// Reducers

const Login = () => {
  const {
     role,setRole,
    email,dispatchEmail,
    password,dispatchPassword,
    formIsValid,
    handleFieldChange,handleFieldBlur,
    backendError,successMessage,
    onSubmit
  } = useLoginForm();
 
  return (
    <>
      <div className="Login-container">
        <div className="login-wrapper">
          <div className="login-title-wrapper">
            <h2>Se connecter</h2>
          </div>
          {backendError && (
            <div className="error-message-backend">{backendError}</div>
          )}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <div className="login-form-wrapper">
            <form onSubmit={onSubmit}>
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
                <label htmlFor="role">Role</label>
                <select className="role-select" id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                  {/* <option value="">Sélectionner un rôle</option> */}
                  <option value="Patient">Patient</option>
                  <option value="Technicien de laboratoire">
                    Technicien de laboratoire
                  </option>
                  <option value="Secrétaire d'accueil">
                    Secrétaire d'accueil
                  </option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="login-btn-wrapper">
                <button className={`login-btn ${!formIsValid ? "disabled-btn" : ""}`}
                disabled={!formIsValid}
                type="submit">
                  Se connecter
                </button>
              </div>

              <div className="login-footer">
                <p>
                  Vous n'avez pas de compte ?{" "}
                  <NavLink to="/register">S'inscrire</NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
