import React, { useState, useEffect, useReducer } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Register.css";
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

const phoneReducer = (prevState, action) => {
  switch (action.name) {
    case "USER_TYPING":
      return {
        value: action.payload,
        isValid: /^\d+$/.test(action.payload),
        error: /^\d+$/.test(action.payload)
          ? null
          : "Entrer un numéro de téléphone valide",
      };
    case "USER_TYPING_DONE":
      return {
        value: prevState.value,
        isValid: /^\d+$/.test(prevState.value),
        error: /^\d+$/.test(prevState.value)
          ? null
          : "Entrer un numéro de téléphone valide",
      };
    default:
      return { value: "", isValid: null, error: null };
  }
};

const fieldsReducer = (prevState, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...prevState,
        [action.field]: {
          value: action.payload,
          isValid: action.payload.length > 0,
          error: action.payload.length > 0 ? null : "Ce champ est requis",
        },
      };
    case "VALIDATE_FIELD":
      return {
        ...prevState,
        [action.field]: {
          ...prevState[action.field],
          isValid: prevState[action.field]?.value?.length > 0,
          error:
            prevState[action.field]?.value?.length > 0
              ? null
              : "Ce champ est requis",
        },
      };
    default:
      return prevState;
  }
};

const Register = () => {
  const navigate = useNavigate();
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
  const [phone, dispatchPhone] = useReducer(phoneReducer, {
    value: "",
    isValid: null,
    error: null,
  });
  const [fields, dispatchFields] = useReducer(fieldsReducer, {
    firstname: { value: "", isValid: null, error: null },
    lastname: { value: "", isValid: null, error: null },
    CIN: { value: "", isValid: null, error: null },
    adress: { value: "", isValid: null, error: null },
    city: { value: "", isValid: null, error: null },
  });
  const [formIsValid, setFormIsValid] = useState(false);

  // Validation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormIsValid(
        email.isValid &&
          password.isValid &&
          phone.isValid &&
          fields.firstname.isValid &&
          fields.lastname.isValid &&
          fields.CIN.isValid &&
          fields.adress.isValid &&
          fields.city.isValid
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [email, password, phone, fields]);

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
      firstname: fields.firstname.value,
      lastname: fields.lastname.value,
      CIN: fields.CIN.value,
      adress: fields.adress.value,
      city: fields.city.value,
      email: email.value,
      password: password.value,
      phoneNumber: phone.value,
      role: "Patient"
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/register",
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
      setSuccessMessage("Inscription réussie !");
      setTimeout(() => navigate("/login"), 2000); // Redirige après 2 secondes

      console.log("Utilisateur créé:", response.data);
      // éventuellement rediriger l'utilisateur vers /login
    }
  } catch (err) {
    // Pour les erreurs réseau ou inattendues
    setBackendError(err.response?.data?.message || "Erreur du serveur");
  }
  };

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
