import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  theme,
  Col,
  Divider,
  Row,
  Avatar,
  Card,
  Button,
  Image,
  Space,
  Rate,
} from "antd";
import "./CarDetails.css";

import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import { useParams } from "react-router-dom";
import axios from "axios";
import primary_instance from "../../Components/axios_primary_instance";

function CarDetails() {
  const { Header, Content, Footer, Sider } = Layout;
  const [vehicleDetails, setVehicleDetails] = useState([]);
  const { vehicle_id } = useParams();

  const mainImageHandler = (url) => {
    setMainImage(url);
  };

  const base_url = "http://3.111.221.228";
  const [mainImage, setMainImage] = useState(
    base_url + vehicleDetails.exterior_image
  );

  const params = {
    vehicle_id: vehicle_id,
  };
  useEffect(() => {
    primary_instance
      .get(`/vehicles_view/`, {
        params: params,
      })
      .then((res) => {
        console.log(res.data.vehicles);

        setVehicleDetails(res.data.vehicles[0]);
        setMainImage(res.data.vehicles[0].exterior_image);
      });
  }, [vehicle_id]);

  return (
    <div className="container pt-5 ">
      <Layout>
        <Content style={{ background: "white" }}>
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 38,
            }}
          >
            <Col
              style={{
                backgroundColor: "white",
              }}
              flex="auto"
            >
              <Layout>
                <Sider theme="light" style={{ bottom: 0, top: 0, left: 0 }}>
                  <Menu
                    defaultSelectedKeys={["1"]}
                    style={{ paddingTop: "10px" }}
                  >
                    <Menu.Item
                      key={1}
                      style={{
                        height: "130px",
                        width: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() =>
                        mainImageHandler(vehicleDetails.exterior_image)
                      }
                    >
                      <Space size={12}>
                        <Image
                          style={{
                            borderRadius: 20,
                            height: 130,
                            width: 150,
                          }}
                          preview={false}
                          src={`${base_url + vehicleDetails.exterior_image}`}
                        />
                      </Space>
                    </Menu.Item>

                    <Menu.Item
                      key={2}
                      style={{
                        height: "130px",
                        width: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() =>
                        mainImageHandler(vehicleDetails.interior_image)
                      }
                    >
                      <Image
                        style={{
                          borderRadius: 20,
                          height: 130,
                          width: 150,
                        }}
                        preview={false}
                        src={`${base_url + vehicleDetails.interior_image}`}
                      />
                    </Menu.Item>

                    <Menu.Item
                      key={3}
                      style={{
                        height: "130px",
                        width: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        style={{
                          borderRadius: 20,
                          height: 130,
                          width: 150,
                        }}
                        preview={false}
                        src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`}
                      />
                    </Menu.Item>
                  </Menu>
                </Sider>
                <Content
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                  }}
                >
                  <Image
                    style={{
                      width: 445,
                      height: 400,
                      borderRadius: 20,
                    }}
                    src={`${base_url + mainImage}`}
                  />
                </Content>
              </Layout>
            </Col>

            <Col
              style={{
                backgroundColor: "white",
                textAlign: "left",
                paddingTop: "8px",
              }}
              span={11}
              flex="auto"
            >
              <h2>
                {vehicleDetails.make} {vehicleDetails.model}
              </h2>

              <Rate disabled defaultValue={4} />

              <div
                className="priceDiv mt-4 text-left  m-0 p-0"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxHeight: "20px",
                  maxWidth: "50px",
                  alignItems: "center",
                }}
              >
                <img
                  className="w-75 m-0"
                  src={process.env.PUBLIC_URL + "/Images/rupee.svg"}
                  alt="Rs"
                />
                <h3 className="mt-2">{vehicleDetails.price}</h3>
              </div>

              <Divider />
              <Row></Row>

              <Divider />

              <Row>
                <h6> {vehicleDetails.place}</h6>
              </Row>

              <Divider />

              <Row
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 10,
                }}
                style={{ width: "100%" }}
              >
                <Col flex="auto">
                  <Button
                    className="product-btn"
                    style={{
                      width: "100%",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    <HeartOutlined /> Wishlist
                  </Button>
                </Col>
                <Col flex="auto">
                  <Button
                    className="product-btn"
                    style={{
                      width: "100%",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    Add to cart
                  </Button>
                </Col>
                <Col flex="auto">
                  <Button
                    className="product-btn"
                    style={{
                      width: "100%",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    Book now
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>

      <section
        className="review-section mt-5"
        style={{ textAlign: "left", marginTop: "150px" }}
      >
        <h4>Reviews</h4>
        <div className="row g-2 p-3">
          <div
            className="col col-md-4 m-2 border rounded "
            style={{ fontSize: "16px" }}
          >
            <p style={{ fontWeight: "500" }}>First Name</p>
            <p>Star rating </p>
            <p>Descriptiono</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CarDetails;
