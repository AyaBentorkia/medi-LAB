import React, { useState, useEffect, useReducer } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

// Reducers
const emailReducer = (prevState, action) => {
  switch (action.name) {
    case "USER_TYPING":
      return {
        value: action.payload,
        isValid: action.payload.includes("@"),
        error: action.payload.includes("@") ? null : "Entrer un email valide",
      };
    case "USER_TYPING_DONE":
      return {
        value: prevState.value,
        isValid: prevState.value.includes("@"),
        error: prevState.value.includes("@") ? null : "Entrer un email valide",
      };
    default:
      return { value: "", isValid: null, error: null };
  }
};

const passwordReducer = (prevState, action) => {
  switch (action.name) {
    case "USER_TYPING":
      return {
        value: action.payload,
        isValid: action.payload.length >= 8,
        error:
          action.payload.length >= 8
            ? null
            : "Votre mot de passe doit contenir au moins 8 caractères",
      };
    case "USER_TYPING_DONE":
      return {
        value: prevState.value,
        isValid: prevState.value.length >= 8,
        error:
          prevState.value.length >= 8
            ? null
            : "Votre mot de passe doit contenir au moins 8 caractères",
      };
    default:
      return { value: "", isValid: null, error: null };
  }
};
const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Patient"); // valeur par défaut

  // States
  const [email, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
    error: null,
  });
  const [password, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
    error: null,
  });
  const [formIsValid, setFormIsValid] = useState(false);

  // Validation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormIsValid(email.isValid && password.isValid);
    }, 500);

    return () => clearTimeout(timer);
  }, [email, password]);

  // Handlers
  const handleFieldChange = (field) => (e) => {
    dispatchFields({ type: "UPDATE_FIELD", field, payload: e.target.value });
  };

  const handleFieldBlur = (field) => () => {
    dispatchFields({ type: "VALIDATE_FIELD", field });
  };
  const [backendError, setBackendError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formIsValid) {
      alert("Veuillez remplir correctement tous les champs !");
      return;
    }

    const data = {
      email: email.value,
      password: password.value,
      role: role,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        data,
        {
          headers: { "content-type": "application/json" },
          validateStatus: (status) => true,
        }
      );
      if (response.status !== 200) {
        setBackendError(response?.data?.error || "Une erreur est survenue");
      } else {
        setBackendError(null); // reset si succès
        setSuccessMessage("Connexion réussie !");
        setTimeout(() => navigate("/"), 2000); // Redirige après 2 secondes

        console.log("Utilisateur créé:", response.data);
        // éventuellement rediriger l'utilisateur vers /login
      }
    } catch (err) {
      // Pour les erreurs réseau ou inattendues
      setBackendError(err.response?.data?.message || "Erreur du serveur");
    }
  };

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

          <div onSubmit={onSubmit} className="login-form-wrapper">
            <form>
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
