import axios from "axios";
import {ROLES} from "../Constants/Roles"
// const API_URL = "hhttp://localhost:5000/Patient/reports";

export const GetAllReports = async (token,role) => {
  let res ;
        if(role===ROLES.PATIENT){
           res= await axios.get(
          "http://localhost:5000/Patient/reports",
          {
            headers: { Authorization: `Bearer ${token}` },
            // timeout: 5000,
          }
        );
        }
        else if(role===ROLES.ANALYST){
          res= await axios.get(
          "http://localhost:5000/LabTechnician/reports",
          {
            headers: { Authorization: `Bearer ${token}` },
            // timeout: 5000,
          }
        );
        }
        else {
res= await axios.get(
          "http://localhost:5000/Admin/reports",
          {
            headers: { Authorization: `Bearer ${token}` },
            // timeout: 5000,
          }
        );
        }
  return res;
};

export const SendReportByMail= async (token,reportId)=>{
 const res = await axios.post(
          `http://localhost:5000/LabTechnician/reports/send/${reportId}`,{},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  return res;
}

export const GetReportByRequestID = async(token,requestId)=>{
  const res= await axios.get(
    `http://localhost:5000/LabTechnician/repports/analysis-request/${requestId}`,
{ headers: { Authorization: `Bearer ${token}` } }
      );
  return res;
}

export const DeleteReport = async (token,reportId) => {
  const res = await axios.delete(
        `http://localhost:5000/api/reports/${reportId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  return res;
};
