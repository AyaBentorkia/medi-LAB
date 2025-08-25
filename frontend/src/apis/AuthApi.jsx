import axios from "axios";

const API_URL = "http://localhost:5000/auth";

export const login = async (userDate) => {
  const res = await axios.post(`${API_URL}/login`,
        userDate,
        {
          headers: { "content-type": "application/json" },
          validateStatus: (status) => true,
        }
      );
  return res;
};

export const register = async (userData) => {
  const res = await axios.post(
        `${API_URL}/register`,
        userData,
        {
            headers: { "content-type": "application/json" },
            validateStatus: (status) => true,
          }
      );
  return res;
};
export const logout= async(token)=>{
  const res= await axios.post(
    `${API_URL}/logout`,
        {},
        {
            headers: { "content-type": "application/json",
              Authorization: `Bearer ${token}`
             },
            validateStatus: (status) => true,
          }
      );
  return res;
  
}
