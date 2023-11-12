import React, { useEffect, useState } from "react";
import { Layout, Divider } from "antd";
import { useParams } from "react-router-dom";
import primary_instance from "../../Components/axios_primary_instance";

function OrderDetails() {
  const { Header, Footer, Sider, Content } = Layout;
  const { order_id } = useParams();
  const [order, setorder] = useState([]);
  const [products, setproducts] = useState([]);
  const [orderStatus, setorderStatus] = useState(0);
  const [shippingAddress, setshippingAddress] = useState([]);
  const [formattedOrderDate, setformattedOrderDate] = useState('')
  // let order_date
  useEffect(() => {
    const params = {
      order_id: order_id,
    };
    primary_instance.get("/manage_order/", { params: params }).then((res) => {
      console.log(res.data);
      setorder(res.data.orders);
      setproducts(res.data.products);
      setorderStatus(res.data.order_status);
      setshippingAddress(res.data.shipping_address);
    });
  }, []);

  useEffect(() => {
    let order_date = new Date(order.order_date);
    const year = order_date.getFullYear();
    const month = (order_date.getMonth() + 1).toString().padStart(2, '0');
    const day = order_date.getDate().toString().padStart(2, '0');

    setformattedOrderDate(`${year}-${month}-${day}`)
  }, [order]);

  const headerStyle = {
    textAlign: "left",

    height: 64,
    paddingInline: 50,
    lineHeight: "64px",
    backgroundColor: "#ffff",
    fontSize: "x-large",
    fontWeight: "bold",
  };

  const contentStyle = {
    textAlign: "center",
    minHeight: 120,
    lineHeight: "20px",
    padding: "3rem",
    backgroundColor: "#ffff",

    fontSize: "large",
    textAlign: "left",
  };

  const siderStyle = {
    textAlign: "center",
    lineHeight: "20px",

    backgroundColor: "#ffff",
    fontSize: "large",
  };

  const footerStyle = {
    textAlign: "center",

    backgroundColor: "#7dbcea",
    fontSize: "large",
  };

  return (
    <div className="container p-5 mt-5">
      {products && (
        <Layout className="border rounded">
          <Header style={headerStyle}>
            {products.make} {products.model}
          </Header>
          <Layout hasSider>
            <Content style={contentStyle}>
              {" "}
              <div className="row">
                <div className="col col-md-6 address">
                  <div className="addressHeader font-weight-bold">
                    <h5>Shipping Address</h5>
                  </div>
                  {shippingAddress && (
                    <div className="addressDetails p-3">
                      <h6>{shippingAddress.house_name},</h6>
                      <p>{shippingAddress.land_mark},</p>
                      <p>
                        {shippingAddress.street}, {shippingAddress.place}{" "}
                      </p>
                      {/* <p>{shippingAddress.place} </p> */}
                      <p>{shippingAddress.city}, </p>
                      <p>
                        {shippingAddress.state}, {shippingAddress.postal_code}{" "}
                      </p>
                    </div>
                  )}
                </div>

                <div className="col col-md-6" style={{ textAlign: "right" }}>
                  <p> Order date: {formattedOrderDate} </p>
                  <p> Delivery date: {order.deliver_date} </p>
                </div>
              </div>
            </Content>
            <Sider style={siderStyle}>
              <Divider />
              <p>Order Total : {order.amount} </p>
            </Sider>
          </Layout>
        </Layout>
      )}
    </div>
  );
}

export default OrderDetails;
