import { useContext, useEffect, useReducer, useState } from "react";
import LoginContext from "../context/LoginContext";
import {
  CreateNewType,
  GetAllTypes,
  GetTypeById,
  UpdateType,
} from "../apis/AnalysisTypesApi";
import { fieldsReducer } from "../reducers/TypeReducer";
export const useFetchTypes = () => {
  const { token, role } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [typesChanged, setTypesChanged] = useState(false);

  useEffect(() => {
    if (!token || !role) return;  
    const fetchtypes = async () => {
      const cacheKey = "types_data";
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      const now = new Date().getTime();
      if (
        typesChanged &&
        cachedData &&
        cacheTimestamp &&
        now - cacheTimestamp < 300000
      ) {
        setTypes(JSON.parse(cachedData));
        setIsLoading(false);
        setTypesChanged(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await GetAllTypes(token);
        console.log("types : ", response.data.analysisTypes);
        setTypes(response?.data?.analysisTypes);
        localStorage.setItem(
          cacheKey,
          JSON.stringify(response?.data?.analysisTypes)
        );
        localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
      } catch (error) {
        console.error("Error fetching types:", error);
        if (cachedData) {
          setTypes(JSON.parse(cachedData));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchtypes();
  }, [token,typesChanged,role]);

  const handleUpdateType = async (typeId, updatedData) => {
    try {
      const response = await UpdateType(token, typeId, updatedData);
      if (response.status === 200) {
        console.log(updatedData);
        setTypes((prev) =>
          prev.map((t) => (t.id === typeId ? response.data.analysisType : t))
        );
        
        setTypesChanged(true);
      } else {
        throw new Error("Réponse inattendue");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
    }
  };

  return {
    token,
    role,
    isLoading,
    setIsLoading,
    types,
    setTypes,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    handleUpdateType,
  };
};

export const fetchOneType = (typeId) => {
  const { token, role } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState({});
  const [error, setError] = useState("");
  useEffect(() => {
    if (!token || !role) return;  
    const fetchType = async () => {
      try {
        setIsLoading(true);
        const response = await GetTypeById(token, typeId);
        console.log("types : ", response.data.analysisType);
        setType(response?.data?.analysisType);
      } catch (error) {
        console.error("Error fetching types:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchType();
  }, [token, typeId,role]);

  return {
    token,
    isLoading,
    setIsLoading,
    type,
    setType,
  };
};

export const useCreateType = () => {
  const { token } = useContext(LoginContext);
  // States
  const [fields, dispatchFields] = useReducer(fieldsReducer, {
    title: { value: "", isValid: null, error: null },
    StandardValue: { value: "", isValid: null, error: null },
    unite: { value: "", isValid: null, error: null },
    description: { value: "", isValid: true, error: null }, 
  });
  const [formIsValid, setFormIsValid] = useState(false);

  // Validation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormIsValid(
        fields.title.isValid &&
          fields.StandardValue.isValid &&
          fields.unite.isValid
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [fields]);

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
      setBackendError("Veuillez remplir correctement les champs !");
      return;
    }

    const data = {
      unite: fields.unite.value,
      title: fields.title.value,
      StandardValue: fields.StandardValue.value,
      description: fields.description.value,
    };

    try {
      const response = await CreateNewType(token, data);
      if (response.status !== 200) {
        console.log("errreur", response);
        setBackendError(response?.data?.error || "Une erreur est survenue");
      } else {
        setBackendError(null); 
        setSuccessMessage("Création réussie !");
        console.log("Type créé:", response.data);
      }
    } catch (err) {
      // Pour les erreurs réseau ou inattendues
      console.log(err);
      setBackendError(err.response?.data?.message || "Erreur du serveur");
    }
  };
  return {
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
    onSubmit,
  };
};
