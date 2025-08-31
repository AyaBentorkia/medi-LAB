  
import { useContext, useEffect, useState } from 'react';
import LoginContext from '../context/LoginContext';
import { GetNotifications } from '../apis/NotificationsApi';
  export const useFetchNotif= ()=>{

  const token = localStorage.getItem("token")
  const [notifs, setNotifs] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const response = await GetNotifications(token);

        if (response.status === 200) {
                                console.log("notifssssss : ",response.data.notifications)

          setNotifs(response.data.notifications);
        } else {
          throw new Error('Réponse inattendue');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
      }
    };
    fetchNotif();
  }, [token]);
 
  return {
    token,notifs,setNotifs,
    error,setError,
  }
    }