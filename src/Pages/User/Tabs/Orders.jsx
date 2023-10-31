import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import "./Orders.css";
import { usePDF } from "@react-pdf/renderer";
import { Modal, Button, Space, Popconfirm, message, Rate } from "antd";
import primary_instance from "../../../Components/axios_primary_instance";
import { MyDocument } from "../../../Components/PdfViewer/pdfViewer";
import InvoiceGenerator from "../../../Components/InvoiceGenerator";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderStatus, setorderStatus] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [invoiceView, setInvoiceView] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState([]);
  const [instance, updateInstance] = usePDF({
    document: <MyDocument order={invoiceOrder} />,
  });
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [comment, setComment] = useState("");
  const [starValue, setStarValue] = useState(0);

  const reviewSUbmitHandler = () => {};

  const desc = ["terrible", "bad", "normal", "good", "wonderful"];

  const showModal = () => {
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

  const handleCancelMsg = () => {
    messageApi.open({
      type: "success",
      content: "Order Cancelled",
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };

  const handleInvoicePrint = (order_id) => {
    const order = orders.find((obj) => obj.id === order_id);
    console.log(order);
    setInvoiceView(true);
    setInvoiceOrder(order);

    const downloadLInk = document.createElement("a");
    downloadLInk.href = instance.url;
    downloadLInk.download = `order-${order_id}_invoice.pdf`;

    downloadLInk.click();

    window.location.reload();
  };

  useEffect(() => {
    primary_instance.get("/manage_order/").then((res) => {
      console.log(res.data);
      setOrders(res.data.orders);
      setProducts(res.data.products);
      setorderStatus(res.data.order_status);
    });
  }, []);

  const orderItemDlt = (ordertoRemove) => {
    const indexToUpdate = orders.findIndex((obj) => obj.id === ordertoRemove);
    const updatedList = [...orders];
    updatedList[indexToUpdate].order_status = "Cancelled";
    setOrders(updatedList);
  };

  const confirm = (order_id) => {
    primary_instance.put("/manage_order/", { order_id }).then((res) => {
      console.log(res.data);
      orderItemDlt(order_id);
      handleCancelMsg();

      //this is not working correctly
    });
  };

  return (
    <div>
      {contextHolder}

      <div className="container  h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-10 col-xl-10">
            <div className="card" style={{ borderRadius: 10 }}>
              <div className=" px-4 pt-5">
                <Modal
                  title="Add a review"
                  open={open}
                  onOk={handleOk}
                  confirmLoading={confirmLoading}
                  onCancel={handleCancel}
                >
                  <div className="border rounded p-3">
                    
                      <span>
                        <Rate
                          tooltips={desc}
                          onChange={setStarValue}
                          value={starValue}
                        />
                        {starValue ? (
                          <span className="ant-rate-text">
                            {desc[starValue - 1]}
                          </span>
                        ) : (
                          ""
                        )}
                      </span>
                      <br />
                      <br />

                      <textarea
                        className="form-control"
                        type="text"
                        value={comment}
                        
                        placeholder="Description"
                      />
                    
                  </div>
                </Modal>
                <h5 className="text-muted mb-0 text-left">Your Orders</h5>
              </div>
              {orders &&
                orders.map((order, index) => (
                  <div key={order.id} className="card-body p-4">
                    <div className="card shadow-0 border mb-3">
                      <div className="card-body">
                        <div
                          style={{ textAlign: "right", marginBottom: "10px" }}
                        >
                          {order.order_status != "Cancelled" && (
                            <InvoiceGenerator order={order} />
                          )}
                        </div>
                        <div className="row">
                          {/* <div className="col-md-3">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/13.webp" className="img-fluid" alt="Phone" />
                  </div> */}
                          <div className="col-md-3 text-center d-flex justify-content-center align-items-center">
                            {products && (
                              <p className="text-muted mb-0">
                                {products[index]?.make +
                                  " " +
                                  products[index]?.model}
                              </p>
                            )}
                          </div>
                          <div className="col-md-3 text-center d-flex justify-content-center align-items-center">
                            <p className="text-muted mb-0 small">
                              {products && products[index]?.vehicle_number}
                            </p>
                          </div>
                          <div className="col-md-3 text-center d-flex justify-content-center align-items-center">
                            {/* <p className="text-muted mb-0 small">Vehicles:</p> */}
                          </div>
                          <div className="col-md-3 text-center d-flex justify-content-center align-items-center">
                            <p className="text-muted mb-0 small">
                              Total : Rs {order.amount}
                            </p>
                          </div>
                          {/* <div className="col-md-3 text-center d-flex justify-content-center align-items-center">
                    <p className="text-muted mb-0 small">$499</p>
                  </div> */}
                        </div>
                        <hr
                          className="mb-4"
                          style={{ backgroundColor: "#e0e0e0", opacity: 1 }}
                        />
                        {order && order.order_status != "Cancelled" && (
                          <div className="row d-flex align-items-center">
                            <div className="col-md-3">
                              <p className="text-muted mb-0 small">
                                Track Order
                              </p>
                            </div>
                            <div className="col-md-12">
                              {orderStatus && (
                                <div
                                  className="progress"
                                  style={{ height: 6, borderRadius: 16 }}
                                >
                                  <div
                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                    role="progressbar"
                                    style={{
                                      width: `${orderStatus[index]}%`,
                                      borderRadius: 16,
                                    }}
                                    aria-valuenow={65}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                  />
                                </div>
                              )}
                              <div className="d-flex justify-content-around mb-1">
                                <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                  Processing
                                </p>
                                <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                  Shipping
                                </p>
                                <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                  Delivered
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          alignItems: "center",
                        }}
                      >
                        {orders && order.order_status == "Delivered" && (
                          <Space>
                            <Button onClick={showModal}>Add a review</Button>
                          </Space>
                        )}
                        <Space>
                          {orders && order.order_status != "Cancelled" ? (
                            <Popconfirm
                              onConfirm={() => confirm(order.id)}
                              title="Cancel this order"
                              description={`Are you sure to cancel your order for ${products[index]?.make}  ${products[index]?.model} ? Your payment excluding shipping charge will be refunded. `}
                              okText="Cancel Order"
                              cancelText="No"
                            >
                              <Button danger type="text">
                                Cancel Order
                              </Button>
                            </Popconfirm>
                          ) : (
                            <Button danger type="text">
                              Order Cancelled
                            </Button>
                          )}
                        </Space>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
