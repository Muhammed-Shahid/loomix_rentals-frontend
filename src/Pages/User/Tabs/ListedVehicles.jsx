import React, { useState, useEffect } from "react";
import { Layout, Button, theme, Popconfirm, Popover, Divider } from "antd";

import "./ListedVehicles.css";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import axios from "axios";
import instance from "../../../Components/axios_instance";
import primary_instance from "../../../Components/axios_primary_instance";
const { Header, Sider, Content } = Layout;

function ListedVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const auth_token = localStorage.getItem("access_token");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      try {
        const params = {
          user_specific: true,
        };
        primary_instance
          .get(`/vehicles_view/`, { params: params })
          .then((res) => {
            setVehicles(res.data.vehicles);

            console.log(res.data);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const dltVehicle = (vehicle_id) => {
    console.log("vehicle_id", vehicle_id);

    instance.put("/vehicles_view/", { vehicle_id: vehicle_id }).then((res) => {
      console.log(res);

      const updatedVehicles = vehicles.filter(
        (vehicle) => vehicle.id !== vehicle_id
      );
      setVehicles(updatedVehicles);
    });
  };

  const popOverContent = (rejection_cause) => {
    let heading = null;
    if (rejection_cause) {
      heading = <p>Rejection Cause :</p>;
    } else {
      heading = <p>Pending administrator checks</p>;
    }
    const content = (
      <div className="p-3 " style={{ lineHeight: "10px" }}>
        {heading}
        <p>{rejection_cause}</p>
        <Divider></Divider>
        <p style={{ lineHeight: "20px" }}>
          please note that it can it can take upto <br /> 24 hrs for
          verifications.
        </p>
      </div>
    );

    return content;
  };

  return (
    <div>
      <div
        className="heading w-100"
        style={{ textAlign: "left", height: "80vh" }}
      >
        <h2>Listed Vehicles</h2>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">Vehicle Name</th>
              <th scope="col">License Plate</th>
              <th scope="col">Verification Status</th>
              <th scope="col">Availability</th>
              <th scope="col">Manage Vehicle</th>
            </tr>
          </thead>
          <tbody>
            {vehicles &&
              vehicles.map((vehicle, index) => (
                <tr>
                  <th scope="row">{index + 1}</th>

                  <td>{vehicle.id}</td>
                  <td>
                    {vehicle.make} {vehicle.model}
                  </td>
                  <td>{vehicle.vehicle_number}</td>
                  {vehicle.is_verified ? (
                    <td>Verified</td>
                  ) : (
                    <td>
                      <div className="row">
                        {" "}
                        {vehicle.rejection_cause ? (
                          <p className="col col-md-4  "> Rejected</p>
                        ) : (
                          <p className="col col-md-4  ">Pending</p>
                        )}{" "}
                        <p className="col  col-md-2">
                          <Popover
                            content={popOverContent(vehicle.rejection_cause)}
                            title="Pending Verifications"
                            trigger="click"
                          >
                            <QuestionCircleOutlined />
                          </Popover>
                        </p>{" "}
                      </div>
                    </td>
                  )}
                  {!vehicle.availability ? (
                    <td>Not Available</td>
                  ) : (
                    <td>Available</td>
                  )}
                  <td>
                    <div className="dropdown">
                      <Button className="dropbtn" type="dashed">
                        Manage
                      </Button>
                      <div className="dropdown-content p-3">
                        <Link
                          to={`/vehicle-detail_view/${vehicle.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <p className="manage-dropdown-content">View</p>
                        </Link>
                        <Link
                          to={`/vehicle-edit/${vehicle.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <p className="manage-dropdown-content ">Edit</p>
                        </Link>
                        <Popconfirm
                          title="Remove Vehicle ?"
                          description="Are you sure to remove this vehicle ?"
                          okText="Remove"
                          cancelText="No"
                          onConfirm={() => dltVehicle(vehicle.id)}
                        >
                          <p className="manage-dropdown-content text-danger">
                            Delete
                          </p>
                        </Popconfirm>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListedVehicles;
