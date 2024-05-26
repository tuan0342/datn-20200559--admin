import React from "react";
import { FireFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div className="logo">
      <div
        className="logo-icon"
        // onClick={() => {
        //   navigate("/dashboard");
        // }}
        // style={{ cursor: "pointer" }}
      >
        <FireFilled />
      </div>
    </div>
  );
};

export default Logo;
