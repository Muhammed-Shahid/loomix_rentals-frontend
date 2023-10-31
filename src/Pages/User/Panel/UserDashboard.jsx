import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  AreaChartOutlined,
  CarOutlined,
  ContainerOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import axios from "axios";
import ListedVehicles from "../Tabs/ListedVehicles";
import Account from "../Tabs/Account";
import Orders from "../Tabs/Orders";
import Sales from "../Tabs/Sales";
import Wallet from "../Tabs/Wallet";

const { Header, Sider, Content } = Layout;

const UserDashboard = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const base_url = "http://65.0.135.19";

  const token = localStorage.getItem("access_token");

  const [tabName, setTabName] = useState("account");

  const renderInnerComponent = () => {
    switch (tabName) {
      case "account":
        return <Account auth_token={token} />;

      case "vehicles":
        return <ListedVehicles auth_token={token} />;

      case "orders":
        return <Orders auth_token={token} />;

      case "wallet":
        return <Wallet auth_token={token} user={props.user} />;
      case "sales":
        return <Sales auth_token={token} />;

      // Add more cases for other components as needed
      default:
        return null;
    }
  };

  return (
    <Layout id="dashboard-wrapper">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          position: "sticky",

          left: 0,
          top: 0,
          bottom: 0,
          paddingTop: 10,
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
            color: "white",
            bottom: 0,
          }}
        />
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ textAlign: "left" }}
        >
          <Menu.Item
            onClick={() => setTabName("account")}
            key={1}
            icon={<UserOutlined />}
            title="Account"
          >
            Account
          </Menu.Item>

          <Menu.Item
            onClick={() => setTabName("vehicles")}
            key={2}
            icon={<CarOutlined />}
            title="Your Vehicles"
          >
            Listed Vehicles
          </Menu.Item>

          <Menu.Item
            onClick={() => setTabName("orders")}
            key={3}
            icon={<ContainerOutlined />}
            title="My Orders"
          >
            My Orders
          </Menu.Item>
          <Menu.Item
            onClick={() => setTabName("wallet")}
            key={4}
            icon={<WalletOutlined />}
            title="wallet"
          >
            Wallet
          </Menu.Item>
          <Menu.Item
            onClick={() => setTabName("sales")}
            key={5}
            icon={<AreaChartOutlined />}
            title="Sales"
          >
            Sales
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header> */}
        <Content
          style={{
            margin: "24px 16px",
            borderRadius: "20px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {renderInnerComponent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserDashboard;
