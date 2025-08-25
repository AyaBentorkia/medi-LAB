import axios from "axios";

const API_URL = "";

export const GetAnalysisReqList = async (token) => {
  const res = await axios.get(`http://localhost:5000/Auth/analysis-requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  return res;
};

export const UpdateRequestStatus = async (token,requestId,newStatus) => {
  const res = await axios.patch(
        `http://localhost:5000/LabTechnician/analysis-requests/${requestId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  return res;
};
