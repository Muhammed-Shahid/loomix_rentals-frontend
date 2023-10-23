import { Layout, Row, Col, Card, Pagination, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
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
import primary_instance from "../../Components/axios_primary_instance";

const { Header, Content, Footer, Sider } = Layout;

const { Meta } = Card;

function Wishlist() {
  const [vehicles, setVehicles] = useState([]);
  const [cart_items_id, setcart_items_id] = useState([]);

  const Remove = (id, wishlist, remove) => {
    const params = {
      product_id: id,
      remove: remove,
    };
    if (wishlist) {
      primary_instance
        .post("/manage_wishlist/", { params: params })
        .then((res) => {
          console.log(res.data);
        });
      let updatedWishlist = vehicles.filter((item) => item.id !== id);
      setVehicles(updatedWishlist);
    } else {
      primary_instance.post("/manage_cart/", { params: params }).then((res) => {
        console.log(res.data);
        let updatedCartItemsId = [];
        if (remove) {
          updatedCartItemsId = cart_items_id.filter((id) => id !== id);
          setcart_items_id(updatedCartItemsId)
        } else {
          setcart_items_id((prevIds) => [...prevIds, id]);
        }
      });
    }
  };

  const base_url = "http://localhost:8000/";
  useEffect(() => {
    primary_instance.get("/manage_wishlist/").then((res) => {
      console.log(res.data);
      setVehicles(res.data);
    });

    primary_instance.get(`/user_liked`).then((res) => {
      setcart_items_id(res.data.cart_items);

      console.log("cart items: ", res.data);
    });
  }, []);

  return (
    <div>
      <Layout
        className="site-layout"
        style={{
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
                        <div
                          onClick={() => Remove(obj.id, true, true)}
                          style={{
                            alignItems: "baseline",
                            boxSizing: "border-box",
                            fontSize: "small",
                          }}
                        >
                          <HeartOutlined key="like" style={{ color: "red" }} />{" "}
                          <p>Remove</p>
                        </div>,

                        <div
                          style={{
                            alignItems: "baseline",
                            boxSizing: "border-box",
                            fontSize: "small",
                          }}
                        >
                          {cart_items_id && cart_items_id.includes(obj.id) ? (
                            <div onClick={() => Remove(obj.id, false, true)}>
                              {" "}
                              <ShoppingCartOutlined
                                key="cart"
                                style={{ color: "red" }}
                              />
                              <p>Remove from cart</p>{" "}
                            </div>
                          ) : (
                            <div onClick={() => Remove(obj.id, false, false)}>
                              {" "}
                              <ShoppingCartOutlined key="cart" />
                              <p>Add to cart</p>
                            </div>
                          )}
                        </div>,
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
{  vehicles &&        <Pagination
            // current={currentPage}
            defaultCurrent={1}
            total={100}
            // onChange={(page) => {
            //   handlePageChange(page);
            // }}
          />}
        </Footer>
      </Layout>
    </div>
  );
}

export default Wishlist;
