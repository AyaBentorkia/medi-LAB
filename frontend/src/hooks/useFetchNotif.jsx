  
import { useContext, useEffect, useState } from 'react';
import LoginContext from '../context/LoginContext';
import { GetNotifications, GetNotificationUsers, MarkAsRead } from '../apis/NotificationsApi';
  export const useFetchNotif= ()=>{

  const {token} = useContext(LoginContext);
  const [notifs, setNotifs] = useState([]);
  const [usersnotifs, setUsersnotifs] = useState([]);
  const [error, setError] = useState(null);
  const [isRead,setIsRead]= useState(false)
  
  useEffect(() => {
    if (!token ) return;  
    const fetchNotif = async () => {
      try {
        const response = await GetNotifications(token);

        if (response.status === 200) {
                                console.log("notifssssss : ")

          setNotifs(response.data.notifications);
        } else {
          throw new Error('Réponse inattendue');
        }
      } catch (error) {
        console.error("Error fetching notifs:", error);
        setError(error.message);
      }
    };
    const fetchNotifUsers = async () => {
      try {
        const response = await GetNotificationUsers(token);

        if (response.status === 200) {
            console.log("notifssssss Users : ",response.data.notifications)

          setUsersnotifs(response.data.notifications);
        } else {
          throw new Error('Réponse inattendue');
        }
      } catch (error) {
        console.error("Error fetching notifs users:", error);
        setError(error.message);
      }
    };

    fetchNotif();
    fetchNotifUsers();
  }, [token]);
const unreadCount = usersnotifs.filter(n => !n.isRead).length;
  const markAsRead = async() =>{
    try {
        const response = await MarkAsRead(token);
      console.log("response read : ",response)
        if (response.status === 200) {
              console.log("notifssssss : ",response.data.notifications)

          setIsRead(response.data.notifications.isRead);
        } else {
          throw new Error('Réponse inattendue');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
      }
    };

  return {
    token,notifs,setNotifs,
    error,setError,
    isRead, markAsRead,
    unreadCount
  }
    }