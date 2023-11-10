import React, { useState } from "react";
import { Popconfirm, Row, Col, Modal } from "antd";
import primary_instance from "../../Components/axios_primary_instance";
function VerifyVehicle(props) {
  const vehicle_id = props.vehicle_id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionCause, setRejectionCause] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const hanldeVehicleVerification = (verification) => {
    let params = null;
    if (verification) {
      params = {
        vehicle_id: vehicle_id,
        verification_status: true,
      };
    } else {
      params = {
        vehicle_id: vehicle_id,
        verification_status: false,
        rejection_cause: rejectionCause,
      };
    }
    primary_instance
      .put("/admin_controls/manage_vehicles/", params)
      .then((res) => {
        console.log(res.data);
        if (verification) {
          props.updateVehiclesList(vehicle_id);
        } else {
          setIsModalOpen(false);
        }
      });
  };
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col flex="auto">
          <Popconfirm
            title="Are you sure to verify this vehicle ?"
            onConfirm={() => hanldeVehicleVerification(true)}
            okText="Yes"
            cancelText="No"
          >
            <button className="btn btn-dark">Verify Vehicle</button>
          </Popconfirm>
        </Col>

        <Col flex="auto">
          <Popconfirm
            title="Are you sure to Reject this vehicle ?"
            onConfirm={showModal}
            okText="Yes"
            cancelText="No"
          >
            <button className="btn btn-dark">Reject Vehicle</button>
          </Popconfirm>
        </Col>
      </Row>

      <Modal
        title="Rejection Cause"
        open={isModalOpen}
        onOk={() => hanldeVehicleVerification(false)}
        okText="Submit"
        onCancel={handleCancel}
      >
        <div className="border rounded">
          <textarea
            value={rejectionCause}
            onChange={(e) => setRejectionCause(e.target.value)}
            name="rejection-textarea"
            id="rejection-textarea"
            style={{ width: "100%" }}
          />
        </div>

       
      </Modal>
    </div>
  );
}

export default VerifyVehicle;
