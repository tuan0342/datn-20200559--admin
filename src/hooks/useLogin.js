import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { message } from "antd";
import { axiosPrivate } from "../api/axios.js";

const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const loginUser = async (values) => {
    const body = {
      email: values.email,
      password: values.password,
      type: 1,
    };

    try {
      setError(null);
      setLoading(true);

      const res = await axiosPrivate.post("users/login", JSON.stringify(body));

      if (res.data.code === 1000) {
        message.success("Logged in successfully");
        login(res.data.data.accessToken, res.data.data.user);
      } else if (res.data.code === 1006) {
        setError("Password is incorrect");
      } else {
        message.error("Logged in failed");
      }
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, loginUser };
};

export default useLogin;
