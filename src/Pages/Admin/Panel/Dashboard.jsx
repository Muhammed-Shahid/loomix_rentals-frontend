import React, { useState, useEffect } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import Users from "../Tabs/Users";
import ListedVehicles from "../Tabs/ListedVehicles";
import Analytics from "../Tabs/Analytics";
import Coupons from "../Tabs/Coupons";
import PendingVerifications from "../Tabs/PendingVerifications";

const Dashboard = () => {
  const [tabName, setTabName] = useState("user");

  const renderInnerComponent = () => {
    switch (tabName) {
      case "user":
        return <Users />;
      case "vehicles":
        return <ListedVehicles />;
      case "analytics":
        return <Analytics />;
      case "coupon":
          return <Coupons/>;
      case "verifications":
            return <PendingVerifications/>;

      default:
        return null;
    }
  };

  return (
    <div
      style={{ display: "flex", bottom:'0', overflow: "scroll initial" }}
    >
      <div style={{minHeight:'100vh'}}>
        <CDBSidebar textColor="#fff" backgroundColor="#212529">
          <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
            <div
     
              className="text-decoration-none"
              style={{ color: "inherit" }}
            >
              Dashboard
            </div>
          </CDBSidebarHeader>

          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>
              <NavLink
                activeClassName="activeClicked"
                onClick={() => setTabName("user")}
              >
                <CDBSidebarMenuItem icon="user">Users</CDBSidebarMenuItem>
              </NavLink>

              <NavLink
                onClick={() => setTabName("vehicles")}
                activeClassName="activeClicked"
              >
                <CDBSidebarMenuItem icon="table">
                  Listed Vehicles
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink
                activeClassName="activeClicked"
                onClick={() => setTabName("analytics")}
              >
                <CDBSidebarMenuItem icon="chart-line">
                  Analytics
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink
                activeClassName="activeClicked"
                onClick={() => setTabName("verifications")}
              >
                <CDBSidebarMenuItem icon="">
                  Pending Verifications
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink
                activeClassName="activeClicked"
                onClick={() => setTabName("coupon")}
              >
                <CDBSidebarMenuItem icon="">
                  Coupons
                </CDBSidebarMenuItem>
              </NavLink>

    
            </CDBSidebarMenu>
          </CDBSidebarContent>

          {/* <CDBSidebarFooter style={{ textAlign: "center" }}>
            <div
              style={{
                padding: "20px 5px",
              }}
            >
              Sidebar Footer
            </div>
          </CDBSidebarFooter> */}
        </CDBSidebar>
      </div>
      <div className="container innerBox-wrapper p-5">
        <div className="innerbox border rounded">{renderInnerComponent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
