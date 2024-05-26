import React, { createContext, useContext, useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { message } from "antd";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const storedData = JSON.parse(localStorage.getItem("user_data"));

  useEffect(() => {
    if (storedData) {
      const { userToken, user } = storedData;
      setToken(userToken);
      setUserData(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (newToken, newData) => {
    localStorage.setItem(
      "user_data",
      JSON.stringify({ userToken: newToken, user: newData })
    );

    setToken(newToken);
    setUserData(newData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    const res = await axiosPrivate.post("users/logout", JSON.stringify({}), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.code === 1000) {
      localStorage.removeItem("user_data");
      setToken(null);
      setUserData(null);
      setIsAuthenticated(false);
    } else {
      message.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, login, logout, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
