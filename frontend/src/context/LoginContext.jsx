import React, { createContext, useState, useEffect } from 'react';

export const LoginContext = createContext({
  token:"",
  role:"",
   isLoggedIn: false,
  loginHandler: (token, role) => {},
  logoutHandler: () => {},
});
export default LoginContext;
export const Context = ({children}) => {
    const [token,setToken]=useState("");
    const [role,setRole]=useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
     useEffect(()=>{
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
      setIsLoggedIn(true);
    }
  },[])
  
 
  const loginHandler = (token,role) => {
    setToken(token);
    setRole(role);
    setIsLoggedIn(true);
    localStorage.setItem("token", token);
    localStorage.setItem("role",role);
  };

  const logoutHandler = () => {
    setToken("");
    setRole("");
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

    return (
        <LoginContext.Provider value={{token,role,loginHandler,logoutHandler,isLoggedIn}}>
            {children}
        </LoginContext.Provider>
  )
}