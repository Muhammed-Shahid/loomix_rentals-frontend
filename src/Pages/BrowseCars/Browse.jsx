import { useEffect, useState } from "react";

import React from "react";
import ReactDOM from "react-dom";

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
  Pagination,
  Dropdown,
} from "antd";

import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import axios from "axios";

import { Link } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const { Meta } = Card;

const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

export default function Browse() {
  const [message, setMessage] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [make, setMake] = useState([]); //available makes in DB
  const [location, setLocation] = useState([]); //available locations in DB
  const [filterBtn, setFilterBtn] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [innerLayoutMarginControl, setinnerLayoutMarginControl] =
    useState(false);
  const [cart_items_id, setcart_items_id] = useState([]);
  const [wishlist_items_id, setwishlist_items_id] = useState([]);
  const [reRender, setReRender] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handlePageChange = (page) => {
    // Update the current page state when the user changes the page
    setCurrentPage(page);

    // You can access the current page number here (page variable)
    console.log(`Page changed to: ${page}`);
  };

  let innerLayoutMarginLeft = 200;

  const colllapseHandler = () => {
    setCollapsed(!collapsed);
    setinnerLayoutMarginControl(!innerLayoutMarginControl);
  };

  if (innerLayoutMarginControl) {
    innerLayoutMarginLeft = 100;
  }

  const [filterData, setFilterData] = useState({
    make: "",
    location: "",
  });

  const handleInputChange = (key, value) => {
    console.log(key, value);
    setFilterData({
      ...filterData,
      [key]: value,
    });

    console.log("filter", filterData);

    setFilterBtn(true);
  };

  const base_url = "http://localhost:8000";

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      try {
        axios
          .get(`${base_url}/vehicles_view/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setVehicles(res.data.vehicles);
            setMake(res.data.makes);
            setLocation(res.data.locations);
            console.log(vehicles);
            console.log(make);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${base_url}/user_liked`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setcart_items_id(res.data.cart_items);
        setwishlist_items_id(res.data.wishlist_items);
        console.log("cart items: ", res.data);
      });
  }, [reRender]);

  const handleFilterSubmit = () => {
    const params = {
      make: filterData.make,
      location: filterData.location,
    };
    try {
      axios
        .get(`${base_url}/vehicles_view/`, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setVehicles(res.data.vehicles);
          setMake(res.data.makes);
          setLocation(res.data.locations);
          console.log(vehicles);
          console.log(make);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const userLikedHandler = (product_id, remove, wishlist) => {
    const params = {
      product_id: product_id,
      remove: remove,
    };

    if (!wishlist) {
      console.log(product_id);
      axios
        .post("http://localhost:8000/manage_cart/", {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          setReRender(!reRender);
        });
    } else {
      axios
        .post("http://localhost:8000/manage_wishlist/", {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          setReRender(!reRender);
        });
    }
  };

  const makeMenu = (
    <Menu>
      {make &&
        make.map((item, index) => (
          <Menu.Item
            onClick={(e) => handleInputChange("make", item)}
            key={index}
          >
            {item}
          </Menu.Item>
        ))}

      <Menu.Item onClick={(e) => handleInputChange("make", "")}>
        Clear Filter
      </Menu.Item>
    </Menu>
  );

  const locationMenu = (
    <Menu>
      {location &&
        location.map((item, index) => (
          <Menu.Item
            key={index}
            onClick={(e) => handleInputChange("location", item)}
          >
            {item}
          </Menu.Item>
        ))}

      <Menu.Item onClick={(e) => handleInputChange("location", "")}>
        Clear Filter
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout hasSider>
      <Sider
        trigger={null}
        collapsible
        theme="light"
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 105,
          bottom: 0,
          paddingTop: 20,
          borderRadius: 10,
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => colllapseHandler()}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
            color: "black",
            bottom: 0,
          }}
        />
        <div className="demo-logo-vertical" />
        <Menu theme="light" mode="inline">
          <Menu.Item key={1} style={{}}>
            <Dropdown
              overlay={makeMenu}
              trigger={["hover"]}
              placement="bottomLeft"
              style={{ width: "100%" }}
            >
              <div style={{ width: "100%", textAlign: "left" }}>
                {filterData.make != "" ? (
                  <h6>{filterData.make}</h6>
                ) : (
                  <h6>Select Make</h6>
                )}
              </div>
            </Dropdown>
          </Menu.Item>

          <Divider />
          <Menu.Item key={2} style={{}}>
            <Dropdown
              overlay={locationMenu}
              trigger={["hover"]}
              placement="bottomLeft"
              style={{ width: "100%" }}
            >
              <div style={{ width: "100%", textAlign: "left" }}>
                {filterData.location != "" ? (
                  <h6>{filterData.location}</h6>
                ) : (
                  <h6>Select Location</h6>
                )}
              </div>
            </Dropdown>
          </Menu.Item>
        </Menu>

        <Button className="w-75 mt-5" onClick={handleFilterSubmit}>
          Filter
        </Button>
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: innerLayoutMarginLeft,

          transitionDelay: "0.19s",
        }}
      >
        <Content
          style={{
            margin: "24px 16px 0 ",
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
              borderRadius: 10,
            }}
          >
            <Row
              gutter={{
                xs: 8,
                sm: 16,
                md: 25,
                lg: 60,
              }}
            >
              {vehicles &&
                vehicles.map((obj) => (
                  <Col className="gutter-row mb-5" key={obj.id}>
                    {obj.discount && (
                      <div
                        className="offer-tag bg-danger"
                        style={{
                          position: "absolute",
                          top: "0px",
                          right: "1.85rem",
                          zIndex: "100",
                          color: "white",
                          width: "5rem",
                          borderTopRightRadius: "8px",
                          borderBottomLeftRadius: "8px",
                          height: "20px",
                        }}
                      >
                        <h6>-{obj.discount}%</h6>
                      </div>
                    )}
                    <Card
                      style={{
                        width: 350,
                      }}
                      cover={
                        <img
                          alt="example"
                          src={base_url + obj.exterior_image}
                          style={{
                            height: 210,
                          }}
                        />
                      }
                      actions={[
                        wishlist_items_id.includes(obj.id) ? (
                          <HeartOutlined
                            title="Remove From Wishlist"
                            key="wishlist"
                            style={{
                              color: "red",
                            }}
                            onClick={() => userLikedHandler(obj.id, true, true)}
                          />
                        ) : (
                          <HeartOutlined
                            title="Add to Wishlist"
                            key="wishlist"
                            onClick={() =>
                              userLikedHandler(obj.id, false, true)
                            }
                          />
                        ),

                        cart_items_id.includes(obj.id) ? (
                          <ShoppingCartOutlined
                            title="Remove From Cart"
                            style={{
                              color: "red",
                            }}
                            key="cart"
                            onClick={() =>
                              userLikedHandler(obj.id, true, false)
                            }
                          />
                        ) : (
                          <ShoppingCartOutlined
                            title="Add to Cart"
                            key="cart"
                            onClick={() =>
                              userLikedHandler(obj.id, false, false)
                            }
                          />
                        ),
                        <Link
                          to={`/vehicle-detail_view/${obj.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <h6>View</h6>
                        </Link>,
                      ]}
                    >
                      {/* <Row
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      > */}
                      <Row style={{ textAlign: "Left" }}>
                        <Meta
                          title={obj.make + " " + obj.model}
                          description={obj.place}
                        ></Meta>
                      </Row>

                      <br />
                      {obj.discount ? (
                        <Row style={{ textAlign: "left" }}>
                          <h6>
                            {Math.round(
                              obj.price - (obj.price * obj.discount) / 100
                            )}{" "}
                          </h6>

                          <h6
                            style={{
                              marginLeft: "10px",
                              textDecoration: "line-through",
                            }}
                          >
                            {obj.price}{" "}
                          </h6>

                          <h6>/ day</h6>
                        </Row>
                      ) : (
                        <Row style={{ textAlign: "left" }}>
                          <h6>{obj.price} </h6>

                          <h6>/ day</h6>
                        </Row>
                      )}
                      {/* </Row> */}
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          <Pagination
            current={currentPage}
            defaultCurrent={1}
            total={100}
            onChange={(page) => {
              handlePageChange(page);
            }}
          />
        </Footer>
      </Layout>
    </Layout>
  );
}
