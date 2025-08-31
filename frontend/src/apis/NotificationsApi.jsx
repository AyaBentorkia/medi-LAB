import axios from "axios";

const API_URL = "http://localhost:5000/LabTechnician";

export const GetNotifications = async (token) => {
  const res = await axios.get(`${API_URL}/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  return res;
};