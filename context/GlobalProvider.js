import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../API/user";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogIn, setisLogIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setUser(res);
          setisLogIn(true);
        } else {
          setisLogIn(false);
          setUser(null);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setisLoading(false); // Set isLoading to false once the operation is completed
      });
  }, []);

  // Ensure that isLoading is passed down to the context value
  const contextValue = {
    isLoading,
    isLogIn,
    user,
    setisLogIn,
    setUser,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
