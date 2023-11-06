import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Menu, Dropdown } from "antd";

import primary_instance from "../../../Components/axios_primary_instance";
function Sales() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderStatus, setorderStatus] = useState([]);

  const [reRender, setreRender] = useState(false);

  useEffect(() => {
    const params = {
      seller_specific: true,
    };
    primary_instance.get("/manage_order/", { params: params }).then((res) => {
      setOrders(res.data.orders);
      setProducts(res.data.products);
      setorderStatus(res.data.order_status);

      console.log(res.data);
    });
  }, [reRender]);

  const progressChangeHandler = (progress_value, order_id) => {
    const params = {
      progress: progress_value,
      order_id: order_id,
    };
    primary_instance.patch("/manage_order/", { params: params }).then((res) => {
      setreRender(!reRender);
    });
  };

  return (
    <div>
      <div className="container " style={{ height: "80vh" }}>
        <div className="row d-flex justify-content-center h-100">
          <div className="col-lg-10 col-xl-10">
            <div className="card" style={{ borderRadius: 10 }}>
              <div className=" px-4 pt-5">
                <h5 className="text-muted mb-0 text-left">Your Sales</h5>
              </div>
              {orders &&
                orders.map((order, index) => (
                  <div key={order.id} className="card-body p-4">
                    <div className="card shadow-0 border mb-3">
                      <div className="card-body">
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
                              {
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
                              }
                            </div>
                          </div>
                        )}
                      </div>
                      {order && order.order_status != "Cancelled" && (
                        <select
                          className="w-25 rounded border"
                          defaultValue={order.order_status}
                          onChange={(e) =>
                            progressChangeHandler(e.target.value, order.id)
                          }
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipping">Shipping</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          alignItems: "center",
                        }}
                      >
                        {orders && order.order_status == "Cancelled" && (
                          <Button danger type="text">
                            Order got cancelled
                          </Button>
                        )}
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

export default Sales;
