import { useContext, useEffect, useState } from "react";
import LoginContext from "../context/LoginContext";
import { GetAnalysisReqList } from "../apis/AnalysisRequestApi";

export const useFetchRequests = ()=>{

    const {token,role}=useContext(LoginContext);
      const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
    const [statusChanged,setStatusChanged]= useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
          const cacheKey = 'requests_data';
          const cachedData = localStorage.getItem(cacheKey);
          const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
          const now = new Date().getTime();      
          if (statusChanged && cachedData && cacheTimestamp && now - cacheTimestamp < 300000) {
            setRequests(JSON.parse(cachedData));
            setIsLoading(false);
            return;
          }
          try {
            setIsLoading(true);
            const response = await GetAnalysisReqList(token);
            console.log("requests : ",response.data.analysisRequests);
            setRequests(response?.data?.analysisRequests);
            localStorage.setItem(cacheKey, JSON.stringify(response?.data?.analysisRequests));
            localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
            
          } catch (error) {
            console.error("Error fetching patients:", error);
         if (cachedData) {
              setRequests(JSON.parse(cachedData));
            }
          } finally {
            setIsLoading(false);
          }
        }
        fetchRequests();
      }, [token]);

      return {
        token,role,
        isLoading,setIsLoading,
        requests,setRequests,
        statusChanged,setStatusChanged
      }
    
}