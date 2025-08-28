import React, { createContext, useState, useEffect } from 'react';
import { logout } from '../apis/AuthApi';

export const LoginContext = createContext({
  token:"",
  role:"",
  firstname:"",
  lastname:"",
   isLoggedIn: false,
  loginHandler: (token, role) => {},
  logoutHandler: () => {},
});
export default LoginContext;
export const Context = ({children}) => {
  
  function parseJwt(token) {
  try {
   const realToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
        const base64Url = realToken.split('.')[1]; 
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}


    const [token,setToken]=useState("");
    const [role,setRole]=useState("");
    const [firstname,setFirstname]=useState("");
    const [lastname,setLastname]=useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
     useEffect(()=>{
    const storedToken = localStorage.getItem("token");
    let decodedToken="";
    if(storedToken) {
  try {
    decodedToken = parseJwt(storedToken);
    console.log("Token décodé:", decodedToken);
  } catch (error) {
    console.error("Token invalide:", error);
  }
}
    const storedRole = decodedToken?.userInfo?.role;
    const storedFirstname = localStorage.getItem("firstname");
    const storedLastname = localStorage.getItem("lastname");
    
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
      setIsLoggedIn(true);
      setFirstname(storedFirstname);
      setLastname(storedLastname);
    }
  },[])
  
 
  const loginHandler = (token,role,firstname,lastname) => {
    setToken(token);
    setRole(role);
    setFirstname(firstname);
    setLastname(lastname);
    setIsLoggedIn(true);
    localStorage.setItem("token", token);
    localStorage.setItem("role",role);
    localStorage.setItem("firstname", firstname);
    localStorage.setItem("lastname",lastname);
  };

  const logoutHandler = () => {
   setToken("");
    setRole("");
    setFirstname("");
    setLastname("");
    setIsLoggedIn(false);
    const response =logout(token);
    console.log(response.status)
    localStorage.clear();
  
  };

    return (
        <LoginContext.Provider value={{token,role,firstname,lastname,loginHandler,logoutHandler,isLoggedIn,parseJwt}}>
            {children}
        </LoginContext.Provider>
  )
}