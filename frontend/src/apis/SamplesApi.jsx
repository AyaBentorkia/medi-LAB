import axios from "axios";

const API_URL = "http://localhost:5000/Admin/samples";

export const GetAllSamples = async (token) => {
  const res = await axios.get(`${API_URL}`,
         {
          headers: { Authorization: `Bearer ${token}` },
          // timeout: 5000
        });
  return res;
};

export const GetSampleById = async (token,SampleId) => {
  const res = await axios.get(`${API_URL}/${SampleId}`,
         {
          headers: { Authorization: `Bearer ${token}` },
        });
  return res;
};
export const UpdateSample = async (token,SampleId,data) => {
  const res = await axios.patch(`${API_URL}/${SampleId}`,data,
         {
          headers: { Authorization: `Bearer ${token}` },
        });
  return res;
};

export const CreateNewSample = async (token,data)=>{
   const res = await axios.post(`${API_URL}`,
        data,
        {
            headers: { 
              Authorization: `Bearer ${token}`
             },
            validateStatus: (status) => true,
          }
      );
  return res;
}
export const DeleteSample = async (token,SampleId) => {
  const res = await axios.delete(`${API_URL}/${SampleId}`,
         {
          headers: { Authorization: `Bearer ${token}` },
        });
 
  return res;
};