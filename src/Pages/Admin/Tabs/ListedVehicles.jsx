import React, { useState, useEffect } from "react";
import instance from "../../../Components/axios_instance";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { Modal, Button as BUTTON } from "antd";
import primary_instance from "../../../Components/axios_primary_instance";
import { Link } from "react-router-dom";

function ListedVehicles() {
  const [allVehicles, setAllVehicles] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [newDiscount, setNewDiscount] = useState(0);
  const [currentVehicleDiscount, setcurrentVehicleDiscount] = useState({
    vehicle_id: "",
    discount: 0,
  });
  const [discountException, setdiscountException] = useState(false);
  const ShowModal = (id, discount) => {
    setOpen(true);
    setcurrentVehicleDiscount({
      vehicle_id: id,
      discount: discount,
    });
  };

  const handleOk = () => {
    if (
      newDiscount < 0 ||
      newDiscount > 100 ||
      !Number.isInteger(Number(newDiscount))
    ) {
      setdiscountException(true);
    } else if (
      (newDiscount > 0 && newDiscount < 100) ||
      Number.isInteger(Number(newDiscount))
    ) {
      setModalConfirmLoading(true);

      const requestData = {
        vehicle_id: currentVehicleDiscount.vehicle_id,
        discount: newDiscount,
      };
      console.log("discounty", requestData.discount);
      instance.patch("/vehicles_view/", requestData).then((res) => {
        console.log(res.data);
        setOpen(false);
        setModalConfirmLoading(false);
      });
      console.log(newDiscount);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const handleVehicleBlock = (id, boolean) => {
    // e.preventDefault();
    console.log(id, boolean);
    primary_instance
      .put("/admin_controls/manage_vehicles/", {
        vehicle_id: id,
        boolean: boolean,
      })
      .then((res) => {
        setReRender(!reRender);
      });
  };
  useEffect(() => {
    instance.get("/admin_controls/all_vehicles").then((res) => {
      setAllVehicles(res.data.all_vehicles);
    });
  }, [reRender]);

  return (
    <div className="p-3 mt-3">
      <h2>Manage Vehicles</h2>

      <div
        className="row mt-5 pt-3"
        style={{ textAlign: "left", padding: "20px", fontSize: "18px" }}
      >
        <div className="col">#</div>

        <div className="col">Owner ID</div>
        <div className="col">Vehicle Id</div>

        <div className="col">Name</div>

        <div className="col">Lock/Unlock</div>

        <div className="col">Manage Vehicle</div>
      </div>

      <div className="divider border mt-3"></div>
      {/* map users here tomorrow */}
      {allVehicles &&
        allVehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            className="row mt-3 text-left"
            style={{ textAlign: "left", padding: "20px" }}
          >
            <div className="col text-left">{index + 1}</div>

            <div className="col text-left">{vehicle.owner}</div>
            <div className="col">{vehicle.id}</div>
            <div className="col">
              {vehicle.make} {vehicle.model}
            </div>

            {vehicle.blocked ? (
              <div className="col">
                <Button
                  variant="success"
                  onClick={() => handleVehicleBlock(vehicle.id, "False")}
                >
                  Unlock
                </Button>
              </div>
            ) : (
              <div className="col">
                <Button
                  variant="danger"
                  onClick={() => handleVehicleBlock(vehicle.id, "True")}
                >
                  Lock
                </Button>
              </div>
            )}

            <div className="col">
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Manage
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => ShowModal(vehicle.id, vehicle.discount)}
                  >
                    Discounts
                  </Dropdown.Item>
                  <Dropdown.Item>
                  <Link to={`/vehicle_admin_view/${vehicle.id}`}style={{textDecoration:"none"}} >
                    <p >
                    View Details

                    </p>
                    </Link>
                    </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        ))}
      <Modal
        title="Manage Vehicle Discounts"
        centered
        open={open}
        okText="Confirm Order"
        onOk={handleOk}
        confirmLoading={modalConfirmLoading}
        onCancel={handleCancel}
        footer={[
          <BUTTON key="cancel" className="m-3" onClick={handleCancel}>
            Cancel
          </BUTTON>,
          <BUTTON
            onClick={() => handleOk()}
            key="ok"
            type="primary"
            style={{ backgroundColor: "black", color: "white" }}
            loading={modalConfirmLoading}
          >
            Save
          </BUTTON>,
        ]}
      >
        <div>
          <div>Current Discount : {currentVehicleDiscount.discount} </div>
          <div
            className="offer-form-wrapper border p-3"
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <h6>ADD Discount : </h6>{" "}
            <input
              value={newDiscount}
              style={{ background: "white", width: "150px" }}
              min="0"
              max="100"
              onChange={(e) => setNewDiscount(e.target.value)}
              className="form-control-md rounded "
              type="number"
              placeholder=" eg : 5 "
            />{" "}
            <h6>%</h6>
          </div>
          {discountException && (
            <p style={{ color: "red" }}>Discount value must be from 0 to 99</p>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ListedVehicles;