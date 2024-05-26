import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  AreaChartOutlined,
  PoweroffOutlined,
  BarsOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MenuList = ({ darkTheme }) => {
  const navigate = useNavigate();
  const { userData, logout } = useAuth();

  const onClickMenu = ({ key }) => {
    if (key == "signout") {
      logout();
    } else {
      navigate(key);
    }
  };

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className="menu-bar"
      onClick={onClickMenu}
      items={[
        { label: "Trang chủ", key: "/dashboard", icon: <HomeOutlined /> },
        {
          label: "Truyện",
          key: "/truyen",
          icon: <AppstoreOutlined />,
          children: [
            {
              key: "/truyen/tao-chuyen",
              label: "Tạo truyện",
              // type: "group",
            },
            {
              key: "/truyen/quan-ly",
              label: "Quản lý",
            },
          ],
        },
        {
          label: "Truyện tranh",
          key: "/truyen-tranh",
          icon: <BarsOutlined />,
          children: [
            {
              key: "/truyen-tranh/chuong-moi",
              label: "Tạo chương",
              // type: "group",
            },
            {
              key: "/truyen-tranh/quan-ly",
              label: "Danh sách",
              // type: 'group',
            },
          ],
        },
        {
          label: "Truyện chữ",
          key: "/truyen-chu",
          icon: <AreaChartOutlined />,
          children: [
            {
              key: "/truyen-chu/chuong-moi",
              label: "Tạo chương",
              // type: "group",
            },
            {
              key: "/truyen-chu/quan-ly",
              label: "Danh sách",
              // type: 'group',
            },
          ],
        },
        {
          label: "Audio",
          key: "/audio",
          icon: <AudioOutlined />,
          children: [
            {
              key: "/audio/chuong-moi",
              label: "Tạo chương",
              // type: "group",
            },
            {
              key: "/audio/quan-ly",
              label: "Danh sách",
              // type: 'group',
            },
          ],
        },
        {
          label: "Signout",
          key: "signout",
          icon: <PoweroffOutlined />,
          danger: true,
        },
      ]}
    >
      {/* <Menu.Item key="home" icon={<HomeOutlined />}>
        Home
      </Menu.Item>
      <Menu.Item key="activity" icon={<AppstoreOutlined />}>
        Activity
      </Menu.Item>
      <Menu.SubMenu key="subtasks" icon={<BarsOutlined />} title="Tasks">
        <Menu.Item key="task-1">Task 1</Menu.Item>
        <Menu.Item key="task-2">Task 2</Menu.Item>
        <Menu.SubMenu key="subtask" title="Subtasks">
          <Menu.Item key="subtask-1">Task 1</Menu.Item>
          <Menu.Item key="subtask-2">Task 2</Menu.Item>
        </Menu.SubMenu>
      </Menu.SubMenu>
      <Menu.Item key="progress" icon={<AreaChartOutlined />}>
        Progress
      </Menu.Item>
      <Menu.Item key="payment" icon={<PayCircleOutlined />}>
        Payment
      </Menu.Item>
      <Menu.Item key="signout" icon={<PoweroffOutlined />} danger={true}>
        Signout
      </Menu.Item> */}
    </Menu>
  );
};

export default MenuList;
