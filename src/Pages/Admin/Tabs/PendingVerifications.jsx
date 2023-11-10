import React, { useState, useEffect } from "react";
import instance from "../../../Components/axios_instance";
import Dropdown from "react-bootstrap/Dropdown";
import { Modal, Button as BUTTON } from "antd";
import Button from "react-bootstrap/Button";
import primary_instance from "../../../Components/axios_primary_instance";
import { Link } from "react-router-dom";
import VerifyVehicle from "../VerifyVehicle";

function PendingVerifications() {
  const [unverifiedVehicles, setUnverifiedVehicles] = useState([]);
  const params = {
    unverified: true,
  };
  useEffect(() => {
    primary_instance
      .get("/admin_controls/all_vehicles", { params })
      .then((res) => {
        setUnverifiedVehicles(res.data.all_vehicles);
      });
  }, []);

  const updateVehiclesList=(vehicle_id)=>{
    let updatedVehicleList = unverifiedVehicles.filter((vehicle) => vehicle.id !== vehicle_id);
    setUnverifiedVehicles(updatedVehicleList);

  }
  return (
    <div className="p-2 pt-3" style={{ textAlign: "left" }}>
      <h3>Pending Verifications</h3>
      <div
        className="row mt-5 pt-3"
        style={{ textAlign: "left", padding: "20px", fontSize: "18px" }}
      >
        <div className="col col-md-2 font-weight-bold">#</div>

        <div className="col col-md-2 font-weight-bold">Owner ID</div>
        <div className="col col-md-2 font-weight-bold">Vehicle Id</div>

        <div className="col col-md-2 font-weight-bold">Name</div>

        <div className="col col-md-2 font-weight-bold">View Details</div>
      </div>

      {unverifiedVehicles &&
        unverifiedVehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            className="row mt-3 text-left"
            style={{ textAlign: "left", padding: "20px" }}
          >
            <div className="col col-md-2 text-left">{index + 1}</div>

            <div className="col col-md-2 text-left">{vehicle.owner}</div>
            <div className="col col-md-2">{vehicle.id}</div>
            <div className="col col-md-2">
              {vehicle.make} {vehicle.model}
            </div>

              <div className="col col-md-2">
            <Link to={`/vehicle_admin_view/${vehicle.id}`}>
                {" "}
                <Button>View Details</Button>
            </Link>
              </div>

              <div className="col col-md-2">
       
           
                <VerifyVehicle vehicle_id={vehicle.id} updateVehiclesList={updateVehiclesList}/>
          
              </div>
          </div>
        ))}
    </div>
  );
}

export default PendingVerifications;

