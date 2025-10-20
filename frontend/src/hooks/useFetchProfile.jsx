  
import { useContext, useEffect, useState } from 'react';
import LoginContext from '../context/LoginContext';
import { GetProfile, UpdateProfile, UpdateUserStatus } from '../apis/UsersApi';
  export const useFetchProfile= ()=>{

  const {token} = useContext(LoginContext)
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patient, setPatient]=useState();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await GetProfile(token);
        if (response.status === 200) {
          setUserData(response.data.user);
        } else {
          throw new Error('Réponse inattendue');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async (updatedData) => {
    try {
      const response = await UpdateProfile(token,updatedData);
      if (response.status === 200) {
        console.log(updatedData)
        setUserData(response.data.updatedUser);
      } else {
        throw new Error('Réponse inattendue');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
    } finally {
      setIsModalOpen(false);
    }
  };

 

  return {
    token,userData,setUserData,
    error,setError,
    isModalOpen,setIsModalOpen,
    patient,setPatient,
    handleSave
  }
    }
//UpdateUserStatus by admin

export const ManageUserStatus= (userId,updatedStatus)=>{
    const [error, setError] = useState(null);
  const [status,setStatus]=useState("");
  const handleUpdateUserStatus= async ()=>{
   try {
      const response = await UpdateUserStatus(token,userId,updatedStatus);
      if (response.status === 200) {
        setStatus(response.data.status);
      } else {
        throw new Error('Réponse inattendue');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
    }
  };
  return {
    status,handleUpdateUserStatus,error,
  }
}
