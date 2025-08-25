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

    const [token,setToken]=useState("");
    const [role,setRole]=useState("");
    const [firstname,setFirstname]=useState("");
    const [lastname,setLastname]=useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
     useEffect(()=>{
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
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
        <LoginContext.Provider value={{token,role,firstname,lastname,loginHandler,logoutHandler,isLoggedIn}}>
            {children}
        </LoginContext.Provider>
  )
}