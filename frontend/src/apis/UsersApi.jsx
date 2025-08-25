import axios from "axios";

const API_URL = "http://localhost:5000/Auth/users";

export const GetAllPatients = async (token) => {
  const res = await axios.get(`${API_URL}?role=Patient`,
         {
          headers: { Authorization: `Bearer ${token}` },
          // timeout: 5000
        });
  return res;
};

export const GetProfile = async (token) => {
  const res = await axios.get(`${API_URL}/profile`,
         {
          headers: { Authorization: `Bearer ${token}` },
        });
  return res;
};
export const UpdateProfile = async (token,data) => {
  const res = await axios.put(`${API_URL}`,data,
         {
          headers: { Authorization: `Bearer ${token}` },
        });
  return res;
};

//Admin
export const GetAllUsers = async (token,role) => {
  const res = await axios.get(`${API_URL}`,
         {
          headers: { Authorization: `Bearer ${token}` },
          // timeout: 5000
        });
  return res;
};