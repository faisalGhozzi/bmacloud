import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const Axios = axios.create({
  baseURL: "http://localhost:8888/bmacloud/server/controllers/",
});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wait, setWait] = useState(false);

  const loginUser = async ({ login, password }) => {
    setWait(true);
    try {
      const { data } = await Axios.post("login.php", {
        login,
        password,
      }).catch((e) => {
        console.log(e.response.data);
      });
      if (data.success && data.token) {
        localStorage.setItem("loginToken", data.token);
        setWait(false);
        return { success: 1 };
      }
      setWait(false);
      return { success: 0, message: data.message };
    } catch (err) {
      setWait(false);
      return { success: 0, message: "Server Error!" };
    }
  };

  const loggedInCheck = async () => {
    const loginToken = localStorage.getItem("loginToken");
    Axios.defaults.headers.common["Authorization"] = "Bearer " + loginToken;
    if (loginToken) {
      const { data } = await Axios.get("getUser.php");
      if (data.success && data.user) {
        setUser(data.user);
        return;
      }
      setUser(null);
    }
  };

  useEffect(() => {
    async function asyncCall() {
      await loggedInCheck();
    }
    asyncCall();
  }, []);

  const logout = () => {
    localStorage.removeItem("loginToken");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ loginUser, wait, user: user, loggedInCheck, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
