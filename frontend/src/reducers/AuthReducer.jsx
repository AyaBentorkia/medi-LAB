

export const emailReducer = (prevState, action) => {
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

export const passwordReducer = (prevState, action) => {
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

export const phoneReducer = (prevState, action) => {
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

export const fieldsReducer = (prevState, action) => {
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