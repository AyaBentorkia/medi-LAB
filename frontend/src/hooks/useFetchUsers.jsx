import { useContext, useEffect, useState } from "react";
import LoginContext from "../context/LoginContext";
import {  GetAllUsers } from "../apis/UsersApi";
import { ROLES } from "../Constants/Roles";


export const useFetchUsers = (statusChanged=false)=>{
      const [users, setUsers] = useState([])
      const {token,role} = useContext(LoginContext);
      const [isLoading, setIsLoading] = useState(true);
    
      useEffect(() => {
        const fetchUsers = async () => {
          //ajout des données dans le cache
          const cacheKey = 'users_data';
          const cachedData = localStorage.getItem(cacheKey);
          const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
          const now = new Date().getTime();
          //verification
          if (cachedData && cacheTimestamp && now - cacheTimestamp < 300000 && statusChanged) {
            setUsers(JSON.parse(cachedData));
            setIsLoading(false);
            return;
          }
          //fetch les données selon le role
          try {
            setIsLoading(true);
            let response;
            if(role!==ROLES.ADMIN){
              response = await GetAllUsers(token,ROLES.PATIENT);
            }
            else {
              response = await GetAllUsers(token);
            }
            
            
            setUsers(response?.data?.users);
            
            // Mettre en cache les données (Solution 5)
            localStorage.setItem(cacheKey, JSON.stringify(response?.data?.users));
            localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
            
          } catch (error) {
            console.error("Error fetching users:", error);
            
            //en cas d erreur, utiliser les données en cache
            if (cachedData) {
              setUsers(JSON.parse(cachedData));
            }
          } finally {
            setIsLoading(false);
          }
        }
        
        fetchUsers();
      }, [token]);
    
      return {
        users,setUsers,
        token,isLoading,setIsLoading,role

      }
      
}