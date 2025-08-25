import React, { createContext, useState, useEffect, useContext } from 'react';
import { LoginContext } from "./LoginContext"; 
import { GetProfile } from '../apis/UsersApi';

export const UserProfileContext = createContext({
  userData: {},
  getProfile: () => {},
  editProfile: ()=>{}
});
export default UserProfileContext;
export const UserProfileProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  
  // Récupérer le token du LoginContext
  const { token } = useContext(LoginContext);

  const getProfile = async () => {
    try {
      const response = await GetProfile(token);
      if (response.status === 200) {
        setUserData(response.data.user);
        setError(null);
      } else {
        throw new Error('Réponse inattendue');
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching profile:", error);
    }
  };

  // Utiliser useEffect pour charger le profil automatiquement
  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, [token]);

  const editProfile= async(updatedData)=>{
    const response = await UpdateProfile(token,updatedData);
          if (response.status === 200) {
            setUserData(response.data.updatedUser);
          } else {
            throw new Error('Réponse inattendue');
          }
  }
  return (
    <UserProfileContext.Provider value={{ userData, getProfile, error, editProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
// export const useUserProfile = () => {
//   const context = useContext(UserProfileContext);
//   if (!context) {
//     throw new Error('useUserProfile must be used within a UserProfileProvider');
//   }
//   return context;
// };