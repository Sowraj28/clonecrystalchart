import { useState,useContext, createContext } from "react";

const AuthContext = createContext(); // creates a context object

const AuthProvider = ({ children }) => {
  // check localStorage to keep login status on refresh
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
