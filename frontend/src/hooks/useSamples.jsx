import { useContext, useEffect, useReducer, useState } from "react";
import LoginContext from "../context/LoginContext";
import { CreateNewSample, GetAllSamples, GetSampleById, UpdateSample } from "../apis/SamplesApi";
import { fieldsReducer } from "../reducers/TypeReducer";

export const useFetchSamples = () => {
  const { token, role } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const [samples, setSamples] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [samplesChanged, setSamplesChanged] = useState(false);

  useEffect(() => {
    const fetchsamples = async () => {
      const cacheKey = "samples_data";
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      const now = new Date().getTime();
      if (
        samplesChanged &&
        cachedData &&
        cacheTimestamp &&
        now - cacheTimestamp < 300000
      ) {
        setSamples(JSON.parse(cachedData));
        setIsLoading(false);
        setSamplesChanged(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await GetAllSamples(token);
        console.log("samples : ", response.data.samples);
        setSamples(response?.data?.samples);
        localStorage.setItem(
          cacheKey,
          JSON.stringify(response?.data?.samples)
        );
        localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
      } catch (error) {
        console.error("Error fetching samples:", error);
        if (cachedData) {
          setSamples(JSON.parse(cachedData));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchsamples();
  }, [token,samplesChanged]);

  const handleUpdateSample = async (sampleId, updatedData) => {
    try {
      const response = await UpdateSample(token, sampleId, updatedData);
      if (response.status === 200) {
        console.log(updatedData);
        setSamples((prev) =>
          prev.map((t) => (t.id === sampleId ? response.data.sample : t))
        );
        
        setSamplesChanged(true);
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
    samples,
    setSamples,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    handleUpdateSample,
  };
};

export const fetchOneSample = (sampleId) => {
  const { token, role } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const [sample, setSample] = useState({});
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchsample = async () => {
      try {
        setIsLoading(true);
        const response = await GetSampleById(token, sampleId);
        console.log("samples : ", response.data.sample);
        setSample(response?.data?.sample);
      } catch (error) {
        console.error("Error fetching samples:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchsample();
  }, [token, sampleId]);

  return {
    token,
    isLoading,
    setIsLoading,
    sample,
    setSample,
  };
};

export const useCreateSample = () => {
  const { token, role } = useContext(LoginContext);
const [fields, dispatchFields] = useReducer(fieldsReducer, {
    title: { value: "", isValid: null, error: null },
  });
    const [formIsValid, setFormIsValid] = useState(false);
 useEffect(() => {
    const timer = setTimeout(() => {
     setFormIsValid(fields.title.isValid);
    }, 500);

    return () => clearTimeout(timer);
  }, [fields]);
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
      alert("Veuillez remplir correctement les champs !");
      return;
    }

    const data = {
      title: fields.title.value,
    };

    try {
      const response = await CreateNewSample(token, data);
      if (response.status !== 200) {
        console.log("errreur", response);
        setBackendError(response?.data?.error || "Une erreur est survenue");
      } else {
        setBackendError(null); // reset si succès
        setSuccessMessage("Création réussie !");
        console.log("sample créé:", response.data);
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
