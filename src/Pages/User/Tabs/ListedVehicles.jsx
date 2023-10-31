import React, { useState, useEffect } from "react";
import { Layout, Button, theme, Popconfirm } from "antd";

import "./ListedVehicles.css";
import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import axios from "axios";
import instance from "../../../Components/axios_instance";
const { Header, Sider, Content } = Layout;

function ListedVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const auth_token = localStorage.getItem("access_token");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const base_url = "http://3.111.221.228";

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      try {
        const params = {
          user_specific: true,
        };
        axios
          .get(
            `${base_url}/vehicles_view/`,
            { params: params },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
              },
            }
          )
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

  const menuProps = {
    delete: "delete",
  };

  const dltVehicle = (vehicle_id) => {
    console.log("vehicle_id", vehicle_id);

    instance.put("/vehicles_view/", { vehicle_id: vehicle_id }).then((res) => {
      console.log(res);

      const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== vehicle_id);
      setVehicles(updatedVehicles)
    });
  };

  return (
    <div>
      <div className="heading w-100" style={{ textAlign: "left" ,height:'80vh'}}>
        <h2>Listed Vehicles</h2>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">Vehicle Name</th>
              <th scope="col">License Plate</th>
              <th scope="col">On Rent</th>
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
                  <td>Yes</td>
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
                          onConfirm={()=>dltVehicle(vehicle.id)}
                        >
                          <p
                            
                            className="manage-dropdown-content text-danger"
                          >
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
