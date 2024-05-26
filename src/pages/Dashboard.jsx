import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button, Typography, Layout, theme } from "antd";
import Logo from "../components/Logo";
import MenuList from "../components/MenuList";
import ToggleThemeButton from "../components/ToggleThemeButton";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const { Header, Sider } = Layout;

const Dashboard = ({ children }) => {
  const { userData, logout } = useAuth();
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={darkTheme ? "dark" : "light"}
        className="sidebar"
      >
        <Logo />
        <MenuList darkTheme={darkTheme} />
        <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </Header>
        {children}
      </Layout>
    </Layout>

    // <>
    //   <div>Dashboard</div>
    //   <Typography.Title level={2} strong className="username">
    //     {userData.username}
    //   </Typography.Title>
    //   <Button onClick={logout}>Logout</Button>
    // </>
  );
};

export default Dashboard;
