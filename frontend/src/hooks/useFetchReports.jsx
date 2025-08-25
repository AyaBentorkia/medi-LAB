import { useContext, useEffect, useState } from "react";
import { GetAllReports } from "../apis/AnalysisReportApi";
import LoginContext from "../context/LoginContext";


export const useFetchReports = ()=>{
    const {role,token}=useContext(LoginContext);
    const [isLoading, setIsLoading] = useState(true);
    const [reports, setReports] = useState([]);

     useEffect(()=>{
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
        },[token])

        return {
            role,token,
            isLoading,setIsLoading,
            reports,setReports,
        }
}