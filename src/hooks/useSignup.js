import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { message } from "antd";
import { axiosPrivate } from "../api/axios.js";

const useSignup = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const registerUser = async (values) => {
    if (values.password !== values.passwordConfirm) {
      return setError("Password are not the same");
    }

    const body = {
      email: values.email,
      username: values.name,
      password: values.password,
    };

    try {
      setError(null);
      setLoading(true);

      const res = await axiosPrivate.post("users/signup", JSON.stringify(body));
      console.log(res);

      if (res.data.code === 1000) {
        message.success("Register success");
        // login(data.token, data.user);
      } else if (res.data.code === 9993) {
        setError("Email is exist");
      } else {
        message.error("Register failed");
      }
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registerUser };
};

export default useSignup;
