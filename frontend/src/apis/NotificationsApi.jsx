import axios from "axios";

const API_URL = "http://localhost:5000/LabTechnician";

export const GetNotifications = async (token) => {
  const res = await axios.get(`${API_URL}/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  return res;
};
export const MarkAsRead = async (token) => {
  const res = await axios.patch(`${API_URL}/notifications`,{},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  return res;
};
export const GetNotificationUsers = async (token) => {
  const res = await axios.get(`${API_URL}/notificationsStatus`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  return res;
};