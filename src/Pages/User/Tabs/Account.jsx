import React, { useState, useEffect } from "react";
import {
  Tabs,
  Input,
  Row,
  Col,
  Space,
  Button as BUTTON,
  message,
  Modal,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import primary_instance from "../../../Components/axios_primary_instance";
import { Button, Card } from "react-bootstrap";
import instance from "../../../Components/axios_instance";
import "./Tabs.css";
function Account() {
  const [userData, setuserData] = useState([]);
  const [userAddress, setuserAddress] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Success",
    });
  };

  useEffect(() => {
    primary_instance.get("auth/current_user_all_details/").then((res) => {
      setuserData(res.data.user_details);
      setuserAddress(res.data.user_address);
    });
  }, []);

  const items = [
    {
      key: "1",
      label: "Profile",
      children: <ProfileTab userData={userData} />,
    },
    {
      key: "2",
      label: "Address",
      children: (
        <AddressTab userAddress={userAddress} successMessage={success} />
      ),
    },
  ];

  const onTabChange = (key) => {
    console.log(key);
  };

  return (
    <React.Fragment>
      <div style={{ height: "100vh" }}>
        <div style={{ position: "absolute", top: "10rem", marginTop: "8rem" }}>
          {contextHolder}
        </div>
        <Tabs defaultActiveKey="1" items={items} onChange={onTabChange} />
      </div>
    </React.Fragment>
  );
}

export default Account;

export const ProfileTab = (userData) => {
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const userDetails = userData.userData[0];
  // useEffect(() => {
  //   setuserDetails ( userData.userData[0])

  // }, [])

  useEffect(() => {
    userDetails &&
      setFormData((formData) => ({
        ...formData,
        ["firstName"]: userDetails.first_name,
        ["lastName"]: userDetails.last_name,
        ["email"]: userDetails.email,
        ["phone"]: userDetails.phone,
      }));
  }, [userDetails]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    re_password: "",
  });

  const handleInputChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  console.log("user: ", userDetails);

  const handleSave = (e) => {
    e.preventDefault();
    console.log(formData);
    primary_instance
      .post("/auth/edit_user/", formData, {
        // headers: {
        //   "Content-Type": "application/x-www-form-urlencoded",
        // },
      })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log("user edited");
    setIsFormDisabled(true);
  };

  return (
    <div className="container">
      <div
        onClick={() => setIsFormDisabled(!isFormDisabled)}
        className="editBtnContainer pt-5"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          height: "25px",
          cursor: "pointer",
        }}
      >
        <h6 style={{ marginRight: "10px" }}>Edit</h6>
        <h6>
          <EditOutlined
            style={{
              right: "0",

              width: "30px",
              height: "30px",
            }}
          />
        </h6>
      </div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ width: "80%" }}>
        <Col flex="auto">
          <Space direction="vertical" size="large" style={{ display: "flex" }}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col flex="auto">
                {userDetails && (
                  <Input
                    name="firstName"
                    className="form-control mt-3"
                    size="large"
                    disabled={isFormDisabled}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={userDetails.first_name}
                  ></Input>
                )}
              </Col>

              <Col flex="auto">
                {userDetails && (
                  <Input
                    name="lasttName"
                    className="form-control user-edit-input mt-3"
                    size="large"
                    disabled={isFormDisabled}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={userDetails.last_name}
                  ></Input>
                )}
              </Col>
            </Row>
            {userDetails && (
              <Input
                name="email"
                className="form-control user-edit-input mt-3"
                size="large"
                disabled={isFormDisabled}
                value={formData.email}
                onChange={handleInputChange}
                placeholder={userDetails.email}
              ></Input>
            )}
            {userDetails && (
              <Input
                name="phone"
                className="form-control  user-edit-input mt-3"
                size="large"
                disabled={isFormDisabled}
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={userDetails.phone}
              ></Input>
            )}
            <Input
              name="password"
              className="form-control user-edit-input mt-3"
              size="large"
              disabled={isFormDisabled}
              onChange={handleInputChange}
              placeholder="New Password"
            ></Input>
          </Space>
        </Col>

        {/* <Col flex="auto">
          <Space direction="vertical" size="large" style={{ display: "flex" }}>
            <Input
              className="mt-3"
              size="large"
              disabled={isFormDisabled}
            ></Input>
            <Input
              className="mt-3"
              size="large"
              disabled={isFormDisabled}
            ></Input>
            <Input
              className="mt-3"
              size="large"
              disabled={isFormDisabled}
            ></Input>
          </Space>
        </Col> */}
      </Row>
      {!isFormDisabled && (
        <Row
          className="mt-5"
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ width: "80%", justifyContent: "end" }}
        >
          <Col>
            <Button
              onClick={() => setIsFormDisabled(true)}
              variant="outline-secondary"
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button onClick={handleSave} variant="dark">
              Save Details
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export const AddressTab = ({ userAddress, successMessage }) => {
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const addressDetails = userAddress;
  const [newAddressForm, setnewAddressForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [editableAddress, seteditableAddress] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    house_name: "",
    street: "",
    place: "",
    city: "",
    state: "",
    postal_code: "",
    land_mark: "",
  });

  const [editedAddressData, setEditedAddressData] = useState({
    phone: "",
    house_name: "",
    street: "",
    place: "",
    city: "",
    state: "",
    postal_code: "",
    land_mark: "",
  });

  useEffect(() => {
    console.log("address : ", addressDetails);
  }, []);

  //Edit Address MOdel Handling ----
  useEffect(() => {
    setEditedAddressData(editableAddress);
  }, [editableAddress]);

  const EditAddressInputChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setEditedAddressData({
      ...formData,
      [name]: value,
    });
  };
 useEffect(() => {
  setModalContent(
    <div className="modalFormWrapper">
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ width: "80%" }}
      >
        <Col flex="auto">
          <Space
            direction="vertical"
            size="large"
            style={{ display: "flex" }}
          >
            <Input
              name="house_name"
              required
              className="form-control mt-3"
              size="large"
              value={editedAddressData.house_name}
              onChange={handleInputChange}
              placeholder={editedAddressData.house_name}
            ></Input>

            <Input
              name="street"
              required
              className="form-control mt-3"
              size="large"
              value={editedAddressData.street}
              onChange={handleInputChange}
              placeholder={editedAddressData.street}
            ></Input>

            <Input
              required
              name="place"
              className="form-control mt-3"
              size="large"
              value={editedAddressData.place}
              onChange={handleInputChange}
              placeholder={editedAddressData.place}
            ></Input>

            <Input
              name="city"
              required
              className="form-control mt-3"
              size="large"
              value={editedAddressData.city}
              onChange={handleInputChange}
              placeholder={editedAddressData.city}
            ></Input>
          </Space>
        </Col>

        <Col flex="auto">
          <Space
            direction="vertical"
            size="large"
            style={{ display: "flex" }}
          >
            <Input
              name="state"
              required
              className="form-control mt-3"
              size="large"
              value={editedAddressData.state}
              onChange={handleInputChange}
              placeholder={editedAddressData.state}
            ></Input>
            <Input
              name="land_mark"
              className="form-control mt-3"
              size="large"
              value={editedAddressData.land_mark}
              onChange={handleInputChange}
              placeholder={editedAddressData.land_mark}
            ></Input>
            <Input
              name="postal_code"
              required
              className="form-control  mt-3"
              size="large"
              value={editedAddressData.postal_code}
              onChange={handleInputChange}
              placeholder={editedAddressData.postal_code}
            ></Input>

            <Input
              name="phone"
              required
              className="form-control mt-3"
              size="large"
              value={editedAddressData.phone}
              onChange={handleInputChange}
              placeholder={editedAddressData.phone}
            ></Input>
          </Space>
        </Col>
      </Row>
    </div>
  );
 }, [editedAddressData])
 
  const ShowModal = () => {

    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  //Edit Address MOdel Handling End ----

  const handleInputChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNewAddressSubmit = (e) => {
    e.preventDefault();

    instance.post("/auth/manage_address/", formData).then((res) => {
      console.log(res.data);

      successMessage();
    });
  };

  return (
    <div>
      <div
        className="editBtnContainer pt-5"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          height: "25px",
        }}
      >
        <BUTTON
          onClick={() => setnewAddressForm(true)}
          style={{
            marginRight: "10px",
            display: "flex",
            alignItems: "baseline",
          }}
        >
          {" "}
          <PlusOutlined
            style={{
              right: "0",

              width: "30px",
              height: "30px",
            }}
          />{" "}
          ADD NEW ADDRESS
        </BUTTON>
      </div>

      {newAddressForm && (
        <form onSubmit={handleNewAddressSubmit}>
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ width: "80%" }}
          >
            <Col flex="auto">
              <Space
                direction="vertical"
                size="large"
                style={{ display: "flex" }}
              >
                <Input
                  name="house_name"
                  required
                  className="form-control mt-3"
                  size="large"
                  value={formData.house_name}
                  onChange={handleInputChange}
                  placeholder="Apprtment No. / name"
                ></Input>

                <Input
                  name="street"
                  required
                  className="form-control mt-3"
                  size="large"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Street"
                ></Input>

                <Input
                  required
                  name="place"
                  className="form-control mt-3"
                  size="large"
                  value={formData.place}
                  onChange={handleInputChange}
                  placeholder="Place"
                ></Input>

                <Input
                  name="city"
                  required
                  className="form-control mt-3"
                  size="large"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                ></Input>
              </Space>
            </Col>

            <Col flex="auto">
              <Space
                direction="vertical"
                size="large"
                style={{ display: "flex" }}
              >
                <Input
                  name="state"
                  required
                  className="form-control mt-3"
                  size="large"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                ></Input>
                <Input
                  name="land_mark"
                  className="form-control mt-3"
                  size="large"
                  value={formData.land_mark}
                  onChange={handleInputChange}
                  placeholder="Landmark (optional)"
                ></Input>
                <Input
                  name="postal_code"
                  required
                  className="form-control  mt-3"
                  size="large"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="Zip Code"
                ></Input>

                <Input
                  name="phone"
                  required
                  className="form-control mt-3"
                  size="large"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="phone"
                ></Input>
              </Space>
            </Col>
          </Row>

          {newAddressForm && (
            <Row
              className="mt-5"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ width: "80%", justifyContent: "end" }}
            >
              <Col>
                <Button
                  onClick={() => setnewAddressForm(false)}
                  variant="outline-secondary"
                >
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button type="submit" variant="dark">
                  Save Details
                </Button>
              </Col>
            </Row>
          )}
        </form>
      )}

      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalContent}</p>
      </Modal>
      <div className="row mt-5">
        {addressDetails &&
          addressDetails.map((address) => (
            <div className="col">
              <Card style={{ textAlign: "left" }}>
                <Card.Body style={{ height: "12rem" }}>
                  <Card.Title>{address.house_name}</Card.Title>
                  <Card.Text>
                    {address.street +
                      ", " +
                      address.place +
                      ", " +
                      address.city +
                      ", " +
                      address.state}
                  </Card.Text>

                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "end",
                      position: "absolute ",
                      bottom: "0",
                      padding: "10px",
                      right: "3px",
                    }}
                  >
                    <BUTTON onClick={() => {seteditableAddress(address) ;ShowModal()}} type="link">
                      Edit
                    </BUTTON>{" "}
                    <BUTTON type="link" danger>
                      Delete
                    </BUTTON>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
      </div>

      {!isFormDisabled && (
        <Row
          className="mt-5"
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ width: "80%", justifyContent: "end" }}
        >
          <Col>
            <Button
              onClick={() => setIsFormDisabled(true)}
              variant="outline-secondary"
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button variant="dark">Save Details</Button>
          </Col>
        </Row>
      )}
    </div>
  );
};
