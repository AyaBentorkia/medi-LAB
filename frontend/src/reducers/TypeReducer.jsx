
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