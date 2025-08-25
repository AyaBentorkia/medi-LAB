import { useNavigate } from "react-router";
import { emailReducer, passwordReducer, phoneReducer, fieldsReducer } from "../reducers/AuthReducer";
import { useEffect, useReducer, useState } from "react";
import { register } from "../apis/AuthApi";

export const useRegisterForm=()=>{
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
      const response = await register(data);
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
    console.log(err)
    setBackendError(err.response?.data?.message || "Erreur du serveur");
  }
  };
  return {
    email,dispatchEmail,
    password,dispatchPassword,
    fields,dispatchFields,
    phone,dispatchPhone,
    formIsValid,setFormIsValid,
    handleFieldBlur,handleFieldChange,
    backendError,setBackendError,
    successMessage,setSuccessMessage,
    onSubmit,
  }
}