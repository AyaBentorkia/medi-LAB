import { useNavigate } from "react-router";
import { emailReducer, passwordReducer } from "../reducers/AuthReducer";
import { useContext, useEffect, useReducer, useState } from "react";
import LoginContext from "../context/LoginContext";
import { login } from "../apis/AuthApi";

export const useLoginForm = ()=>{
     const navigate = useNavigate();
  // const [role, setRole] = useState(""); // valeur par défaut

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
  const { loginHandler,parseJwt } = useContext(LoginContext);

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
      // role: role,
    };

    try {
      const response = await login(data);
      console.log("response status: ",response.status)
              console.log("response login : ",response)
        const tokenDecoded =parseJwt(response?.data?.user?.accessToken);
      const role= tokenDecoded.userInfo?.role;
      console.log("role : ",role)
        console.log("role issue de token : ",tokenDecoded)
      if (response.status == 200) {

        loginHandler(response?.data?.user?.accessToken,role,response?.data.user?.user?.firstname,response?.data.user?.user?.lastname);
        setBackendError(null); 
        setSuccessMessage("Connexion réussie !");
        setTimeout(() => navigate("/dashboard"), 1000); 

        // console.log("Utilisateur créé:", response.data);
    
      } else {
        setBackendError(response?.data?.error || "Une erreur est survenue");
          }
    } catch (err) {
      // Pour les erreurs réseau ou inattendues
      setBackendError(err.response?.data?.message || "Erreur du serveur");
    }
  };
  return {
    // role,setRole,
    email,dispatchEmail,
    password,dispatchPassword,
    formIsValid,setFormIsValid,
    handleFieldChange,handleFieldBlur,
    backendError,successMessage,
    onSubmit
  }

}