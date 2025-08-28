import axios from "axios";

const API_URL = "http://localhost:5000/Admin/analysis-types";

export const GetAllTypes = async (token) => {
  const res = await axios.get(`${API_URL}`,
         {
          headers: { Authorization: `Bearer ${token}` },
          // timeout: 5000
        });
  return res;
};

export const GetTypeById = async (token,TypeId) => {
  const res = await axios.get(`${API_URL}/${TypeId}`,
         {
          headers: { Authorization: `Bearer ${token}` },
        });
  return res;
};
export const UpdateType = async (token,TypeId,data) => {
  const res = await axios.put(`${API_URL}/${TypeId}`,{data},
         {
          headers: { Authorization: `Bearer ${token}` },
        });
  return res;
};

export const CreateNewType = async (token,data)=>{
   const res = await axios.post(`${API_URL}`,{data},
        data,
        {
            headers: { 
              "content-type": "application/json",
              Authorization: `Bearer ${token}`
             },
            validateStatus: (status) => true,
          }
      );
  return res;
}
export const DeleteType = async (token,typeId) => {
  const res = await axios.delete(`${API_URL}/${typeId}`,
         {
          headers: { Authorization: `Bearer ${token}` },
        });
 
  return res;
};