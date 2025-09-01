import { useContext, useEffect, useState } from "react";
import { GetAllReports, GetReportByRequestID } from "../apis/AnalysisReportApi";
import LoginContext from "../context/LoginContext";


export const useFetchReports = ()=>{
    const {role,token}=useContext(LoginContext);
    const [isLoading, setIsLoading] = useState(true);
    const [reports, setReports] = useState([]);

     useEffect(()=>{
      if (!token || !role) return;  
            const fetchReports= async()=>{
                const cacheKey = 'reports_data';
          const cachedData = localStorage.getItem(cacheKey);
          const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
          const now = new Date().getTime();      
          if (cachedData && cacheTimestamp && now - cacheTimestamp < 300000) {
            setReports(JSON.parse(cachedData));
            setIsLoading(false);
            return;
          }
          try {
            setIsLoading(true);
            const response = await GetAllReports(token,role);
            
            console.log("reports : ",response.data.reports);
            setReports(response?.data?.reports);
            localStorage.setItem(cacheKey, JSON.stringify(response?.data?.reports));
            localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
            
          } catch (error) {
            console.error("Error fetching patients:", error);
         if (cachedData) {
              setReports(JSON.parse(cachedData));
            }
          } finally {
            setIsLoading(false);
          }
        }
        fetchReports();
        },[token,role])

        return {
            role,token,
            isLoading,setIsLoading,
            reports,setReports,
        }
}

//get report by resuest id to verify if the request's report has been done

export const useGetReportByRequestId = (requestId)=>{
    const {token}=useContext(LoginContext);
    const [isLoading, setIsLoading] = useState(true);
    const [reportId, setReportId] = useState({});

     useEffect(()=>{
      if (!token ) return;  
            const fetchReport= async()=>{
           
          try {
            setIsLoading(true);
            const response = await GetReportByRequestID(token,requestId);
            if(response.status ===200){
// console.log("reports : ",response.data.report);
            setReportId(response?.data?.report?.id);
            }
          } catch (error) {
            console.error("Error fetching patients:", error);
         
          } finally {
            setIsLoading(false);
          }
        }
        fetchReport();
        },[token])

        return {
            token,
            isLoading,setIsLoading,
            reportId,setReportId,
        }
}
