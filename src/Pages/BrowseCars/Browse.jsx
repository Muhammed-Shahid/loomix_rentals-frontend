import { useEffect, useState } from "react";

import React from "react";

import "./CarDetails.css";

import {
  Layout,
  Menu,
  theme,
  Col,
  Divider,
  Row,
  Input,
  Card,
  Button,
  Pagination,
  Dropdown,
  InputNumber,
  Slider,
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
import primary_instance from "../../Components/axios_primary_instance";
import { render } from "@testing-library/react";

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;
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

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6, // adjust as needed
    total: 0,
  });

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
    price_range: 10000,
    search_param: "",
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

  const fetchVehicles = async (page, pageSize) => {
    const params = {
      make: filterData.make,
      location: filterData.location,
      price_range: filterData.price_range,
      search_param: filterData.search_param,
      page: page,
      items_per_page: pageSize,
    };
    try {
      primary_instance
        .get("/vehicles_view/", { params: params })
        .then((res) => {
          setVehicles(res.data.vehicles);
          setMake(res.data.makes);
          setLocation(res.data.locations);
          setPagination({ ...pagination, total: res.data.total_vehicles });
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      fetchVehicles(pagination.current, pagination.pageSize);
    }
  }, [pagination.current, pagination.pageSize, reRender]);

  useEffect(() => {
    primary_instance.get("/user_liked/").then((res) => {
      setcart_items_id(res.data.cart_items);
      setwishlist_items_id(res.data.wishlist_items);
      console.log("cart items: ", res.data);
    });
  }, [reRender]);

  const handleFilterSubmit = () => {
    const params = {
      make: filterData.make,
      location: filterData.location,
      price_range: filterData.price_range,
      search_param: filterData.search_param,
    };
    try {
      primary_instance
        .get("/vehicles_view/", {
          params: params,
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

  const handleClearFilter = () => {
    setFilterData({
      ...filterData,
      ["make"]: "",
      ["location"]: "",
      ["price_range"]: 10000,
      ["search_param"]: "",
    });

    setReRender(!render);
  };

  const userLikedHandler = (product_id, remove, wishlist) => {
    const params = {
      product_id: product_id,
      remove: remove,
    };

    if (!wishlist) {
      console.log(product_id);
      primary_instance
        .post("/manage_cart/", {
          params: params,
        })
        .then((res) => {
          console.log(res);
          setReRender(!reRender);
        });
    } else {
      primary_instance
        .post("/manage_wishlist/", {
          params: params,
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

  const onSearch = (value, _e, info) => {
    handleInputChange("search_param", value);
    setReRender(!reRender);
  };

  const [sliderInputValue, setSliderInputValue] = useState(1);

  const onSliderChange = (newValue) => {
    setSliderInputValue(newValue);

    console.log("new value", newValue);
    handleInputChange("price_range", newValue);
  };
  return (
    <Layout hasSider>
      <Sider
        trigger={null}
        collapsible
        theme="light"
        collapsed={collapsed}
        style={{
          // overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 105,
          bottom: 0,
          width: "500px",
          minWidth: "500px",
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
        <Menu>
          <div
            style={{
              textAlign: "left",
              marginTop: "5rem",
              padding: "15px",
              paddingLeft: "12%",
              lineHeight: "10px",
            }}
          >
            <h6>Price Range</h6>

            <Row>
              <Col>
                <InputNumber
                  min={800}
                  max={10000}
                  style={{ width: "150px", marginBottom: "10px" }}
                  value={sliderInputValue}
                  onChange={onSliderChange}
                />
              </Col>
              <Col span={12}>
                <Slider
                  style={{ width: "140px" }}
                  min={800}
                  max={10000}
                  onChange={onSliderChange}
                  value={
                    typeof sliderInputValue === "number" ? sliderInputValue : 0
                  }
                />
              </Col>
            </Row>
          </div>
        </Menu>

        <Button className="w-75 mt-5" onClick={() => setReRender(!reRender)}>
          Filter
        </Button>

        <Button className="w-75 mt-5" onClick={handleClearFilter}>
          Clear All Filters
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
            margin: "24px 16px  ",
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
            <div
              className="search-box-div "
              style={{ boxSizing: "border-box", maxWidth: "fit-content" }}
            >
              <Search
                className="search-input"
                placeholder="Search make , model , place"
                onSearch={onSearch}
                style={{
                  width: 300,
                  background: "white",
                  backgroundColor: "white",
                }}
                styles={{ backgroundColor: "white" }}
              />
            </div>
            <br />

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
                    {obj.discount > 0 && (
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
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePaginationChange}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} orders`
            }
          />
        </Footer>
      </Layout>
    </Layout>
  );
}
