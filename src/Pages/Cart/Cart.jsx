import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Space,
  DatePicker,
  Popconfirm,
  Modal,
  Steps,
  theme,
  message,
} from "antd";
import { HeartOutlined } from "@ant-design/icons";
import "./Cart.css";
import primary_instance from "../../Components/axios_primary_instance";
import axios, { Axios } from "axios";

function Cart(props) {
  const [cartItems, setCartItems] = useState([]);
  const [totalProductAmount, setTotlalProductAmount] = useState(0);
  const [shippingCharge, setshippingCharge] = useState(0);
  const [address, setAddress] = useState([]);
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [deliveryDate, setdeliveryDate] = useState([]);
  const [returnDate, setreturnDate] = useState([]);
  const [rented_days_count, setRented_days_count] = useState(1);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [checkoutDisabled, setCheckoutDisabled] = useState(true);
  const [hasAvailability, setHasAvailability] = useState(false);
  const [defaultAddress, setdefaultAddress] = useState("");
  const [changeAddress, setchangeAddress] = useState(false);
  const [selectedAddress, setselectedAddress] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  // coupon
  const [couponRequiredPrice, setCouponRequiredPrice] = useState("");
  const [couponCodeError, setcouponCodeError] = useState(false);
  const [couponDiscount, setcouponDiscount] = useState("");
  const [couponApplyBtn, setcouponApplyBtn] = useState(true)
  const dateFormat = "YYYY/MM/DD";
  const access_token = localStorage.getItem("access_token");

  const [wallet_disabled, setwallet_disabled] = useState(true);

  const [couponCode, setCouponCode] = useState("");
  useEffect(() => {
    primary_instance.get("/manage_cart").then((res) => {
      setCartItems(res.data);
      console.log(res.data);

      console.log("cart items", cartItems);
    });

    primary_instance.get("auth/current_user_all_details/").then((res) => {
      setAddress(res.data.user_address);
      console.log(res.data.user_address);
    });
  }, []);

  useEffect(() => {
    let sum = cartItems
      .filter((item) => item.availability === true)
      .reduce(function (prev, current) {
        let price = Math.round(
          current.price - (current.price * current.discount) / 100
        );
        return prev + +price;
      }, 0);

    setTotlalProductAmount(sum);
  }, [cartItems]);

  useEffect(() => {
    let shippingCharge = 0;

    let days = 1;
    if (deliveryDate && returnDate) {
      const diffInMilliseconds = returnDate.valueOf() - deliveryDate.valueOf();
      // Convert the difference to days
      days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

      if (days == 0) {
        days = days + 1;
      }
      setRented_days_count(days);
    }

    let amount_sum = totalProductAmount * days + shippingCharge;
    let amount_after_tax = Math.round(amount_sum + amount_sum * 0.12);
    setCheckoutAmount(amount_after_tax);

    // let sum = cartItems
    //   .filter((item) => item.availability === true)
    //   .reduce(function (prev, current) {
    //     return prev + +current.price;
    //   }, 0);

    // setTotlalProductAmount(sum);

    for (let index = 0; index < cartItems.length; index++) {
      if (cartItems[index].availability === true) {
        shippingCharge += 10;
        setshippingCharge(shippingCharge);
        console.log("shipping charge", shippingCharge);
      }
    }
    let hasAvailability = cartItems.some((item) => item.availability === true); // if atleast one vehicle is available,
    !hasAvailability ? setHasAvailability(false) : setHasAvailability(true); // hasAvailability return true
    // then calendar wont't be disabled.

    if (props.user.wallet_cash >= amount_after_tax) {
      setwallet_disabled(false);
    }
  }, [totalProductAmount, shippingCharge, cartItems, deliveryDate, returnDate]);

  const cartItemDlt = (itemtoRemove) => {
    let updatedCartItems = cartItems.filter((item) => item !== itemtoRemove);

    setCartItems(updatedCartItems);
    removeFromCart(itemtoRemove.id);
  };

  const removeFromCart = (itemId) => {
    const params = {
      product_id: itemId,
      remove: true,
    };
    primary_instance.post("/manage_cart/", { params: params }).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    let default_address = address.find((obj) => obj.default_address == true);

    console.log("default address", default_address);
    setdefaultAddress(default_address);
    setselectedAddress(defaultAddress);
  }, [address]);

  const handleCalendarChange = (dates) => {
    if (dates && dates.length === 2) {
      // Extract the start and end dates from the 'dates' array
      const [start, end] = dates;

      console.log("start,end", start, end);
      setdeliveryDate(start);
      setreturnDate(end);

      setCheckoutDisabled(false);
    } else {
      setCheckoutDisabled(true);
    }
  };

  // this function will handel payment when user submit his/her money
  // and it will confim if payment is successfull or not
  const handlePaymentSuccess = async (response) => {
    console.log("handle payment success response", response);
    try {
      let bodyData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      bodyData.append("response", JSON.stringify(response));

      const response = await axios({
        url: `http://3.111.221.228/payment/success/`,
        method: "POST",
        data: bodyData,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(console.error());
    }
  };

  // this will load a script tag which will open up Razorpay payment card to make //transactions
  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const handleCheckout = async () => {
    setModalContent("Processing Order...");
    setConfirmLoading(true);

    const productIds = cartItems.map((item) => item.id).join(",");
    console.log(productIds);
    const orderParams = {
      products: productIds,
      deliveryDate: deliveryDate,
      returnDate: returnDate,
      checkoutAmount: checkoutAmount,
    };
    let bodyData = new FormData();

    // we will pass the amount and product name to the backend using form data
    bodyData.append("products", productIds);
    bodyData.append("deliveryDate", deliveryDate);
    bodyData.append("returnDate", returnDate);
    bodyData.append("checkoutAmount", checkoutAmount);
    bodyData.append("days", rented_days_count);
    bodyData.append("shipping_address_id", selectedAddress.id);

    if (couponDiscount !='') {
      bodyData.append('coupon_discount',couponDiscount)
    }

    if (paymentMethod == "gateway") {
      const res = await loadScript();
      bodyData.append("payment_method", true);
      console.log("gateway method");
    } else if (paymentMethod == "wallet") {
      console.log("wallet");
      bodyData.append("payment_method", false);
      console.log("wallet payment methiod");
    }

    const data = await axios({
      url: `http://3.111.221.228/manage_order/`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      data: bodyData,
    }).then((res) => {
      console.log(res);

      setTimeout(() => {
        setModalContent("");
        setOpen(false);
        setConfirmLoading(false);
      }, 2000);
      return res;
    });

    if (paymentMethod == "gateway") {
      var options = {
        key_id: process.env.REACT_APP_PUBLIC_KEY, // in react your environment variable must start with REACT_APP_
        key_secret: process.env.REACT_APP_SECRET_KEY,
        amount: data.data.payment.amount,
        currency: "INR",
        name: "Org. Name",
        description: "Test teansaction",
        image: "", // add image url
        order_id: data.data.payment.id,
        handler: function (response) {
          // we will handle success by calling handlePaymentSuccess method and
          // will pass the response that we've got from razorpay
          handlePaymentSuccess(response);
        },
        prefill: {
          name: "User's name",
          email: "User's email",
          contact: "User's phone",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
    }

    if (paymentMethod == "gateway") {
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);

    setchangeAddress(false);
  };

  const removeItemWarningMsg = (
    <p>
      Are you sure to remove
      <br />
      this item from cart ?
    </p>
  );
  const base_url = "http://3.111.221.228";

  const selectAddressHandler = (address) => {
    setselectedAddress(address);
    setdefaultAddress(address);
  };

  const selectPaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
    console.log(e.target.value);
  };

  const couponHandler = (e) => {
    e.preventDefault();
    const params = {
      price: checkoutAmount,
      coupon_code: couponCode,
    };
    console.log(params);
    setCouponRequiredPrice("");
    setcouponCodeError("");
    primary_instance
      .get("/manage_coupons/", { params: params })
      .then((res) => {

        setCheckoutAmount(checkoutAmount - res.data.coupon_discount);
        setcouponDiscount(res.data.coupon_discount)
        setcouponApplyBtn(false)
      })
      .catch((error) => {
        if (error.response.status == 411) {
          setCouponRequiredPrice(error.response.data.min_price);
          console.log(error);
        }
        if (error.response.status == 406) {
          setcouponCodeError(true);
        }
      });
  };

  // Checkout Steps ---------*******

  const steps = [
    {
      title: "Select Address",
      content: (
        <div className="modelAddress rounded border p-4 ">
          <h6> Delivery Address</h6>
          {defaultAddress && (
            <div className="address-wrapper">
              <p>
                {defaultAddress.house_name}, <br />
                {defaultAddress.street}, {defaultAddress.place},<br />
                {defaultAddress.city}, {defaultAddress.state},{" "}
                {defaultAddress.postal_code}{" "}
              </p>

              {!changeAddress ? (
                <Button onClick={() => setchangeAddress(true)}>
                  Change Address
                </Button>
              ) : (
                <div>
                  <h6>Select Address : </h6>
                  <div className="row selectAddress-wrapper">
                    {address &&
                      address.map((obj) => (
                        <div
                          onClick={() => selectAddressHandler(obj)}
                          className="col col-md-3 addresses border p-2"
                        >
                          {selectedAddress && selectedAddress.id == obj.id ? (
                            <p className="border border-primary">
                              {obj.house_name}, <br />
                              {obj.street}, {obj.place},<br />
                              {obj.city}, {obj.state}, {obj.postal_code}{" "}
                            </p>
                          ) : (
                            <p>
                              {obj.house_name}, <br />
                              {obj.street}, {obj.place},<br />
                              {obj.city}, {obj.state}, {obj.postal_code}{" "}
                            </p>
                          )}
                        </div>
                      ))}
                    <div className="row mt-3 gx-0">
                      <div className="col   col-md-2">
                        {selectedAddress && (
                          <Button
                            onClick={() => setchangeAddress(false)}
                            style={{ background: "black", color: "white" }}
                          >
                            Select{" "}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Payment Method",
      content: (
        <div className="paymentMethod-wrapper">
          <div className="methods-wrapper p-5">
            <form>
              <input
                type="radio"
                id="wallet"
                name="payment_method"
                value="wallet"
                checked={paymentMethod === "wallet"}
                disabled={wallet_disabled}
                onChange={selectPaymentMethod}
              />
              <label className="m-2" htmlFor="wallet">
                Pay from loomix wallet
              </label>
              {wallet_disabled && (
                <label className="m-2 text-danger" htmlFor="wallet">
                  Insufficient amount in wallet
                </label>
              )}

              <br />

              <input
                type="radio"
                id="gateway"
                name="payment_method"
                value="gateway"
                checked={paymentMethod === "gateway"}
                onChange={selectPaymentMethod}
              />
              <label className="m-2" htmlFor="gateway">
                Pay using online payment gateway
              </label>
              <br />
            </form>

            <div className="couponDIv">
              <form onSubmit={couponHandler}>
                <div className="row">
                  <div className="col">
                    <input
                      onChange={(e) => setCouponCode(e.target.value)}
                      value={couponCode}
                      className="form-control "
                      style={{
                        background: "white",

                        marginRight: "10px",
                      }}
                      placeholder="Coupon Code"
                      type="text"
                    />
                  </div>
                  {couponDiscount !='' && <p>Holaa !! You got a discount of {couponDiscount}</p> }
                  {couponCodeError && <p>Coupon not found</p>}
                  {couponRequiredPrice != "" && (
                    <p>Need to purchase for or above {couponRequiredPrice}</p>
                  )}
                  <div className="col">
                   {couponApplyBtn && <button
                      type="submit"
                      className="btn btn-dark btn-sm btn-block"
                    >
                      Apply Coupon
                    </button>}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Confirm Order",
      content: (
        <div className="p-3">
          <div>
            <h6> Delivery Address</h6>

            {defaultAddress && (
              <div className="address-wrapper p-1">
                <p>
                  {defaultAddress.house_name}, <br />
                  {defaultAddress.street}, {defaultAddress.place},<br />
                  {defaultAddress.city}, {defaultAddress.state},{" "}
                  {defaultAddress.postal_code}{" "}
                </p>
              </div>
            )}
          </div>

          <div>
            {paymentMethod == "wallet" ? (
              <h6>Payment Method : From loomix wallet</h6>
            ) : (
              <h6>Payment Method : Through online payment gateway </h6>
            )}
          </div>
        </div>
      ),
    },
  ];

  // Checkout Steps End---------******

  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle = {
    textAlign: "left",
    color: "black",
    backgroundColor: "white",
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  // Checkout Steps End
  return (
    <div className="container">
      <Modal
        width={1000}
        title="Confirm Order"
        centered
        open={open}
        okText="Confirm Order"
        onOk={handleCheckout}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            style={{ backgroundColor: "black", color: "white" }}
            onClick={handleCheckout}
            loading={confirmLoading}
          >
            Confirm Order
          </Button>,
        ]}
      >
        <div>
          <Steps current={current} items={items} />
          <div style={contentStyle}>{steps[current].content}</div>
          <div style={{ marginTop: 24 }}>
            {current > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button
                type="primary"
                style={{ backgroundColor: "black" }}
                onClick={() => next()}
              >
                Next
              </Button>
            )}
            {/* {current === steps.length - 1 && (
              <Button
                type="primary"
                style={{ backgroundColor: "black" }}
                onClick={() => message.success("Processing complete!")}
              >
                Done
              </Button>
            )} */}
          </div>

          <div className="price mt-3">
            <h6>Amount Payable : Rs {checkoutAmount} </h6>
          </div>
          {modalContent}
        </div>
      </Modal>
      <div className="container py-5">
        <div className="row d-flex justify-content-center my-4 ">
          <div className="col-md-8">
            <div className="card mb-4 pt-3">
              <div className="card-body">
                {/* Single item */}
                {cartItems &&
                  cartItems.map((item) => (
                    <div className="row p-2 mb-3">
                      {item.discount && (
                        <div
                          className="offer-tag bg-danger"
                          style={{
                            position: "absolute",
                            top: "0px",
                            right: "0",
                            zIndex: "100",
                            color: "white",
                            width: "5rem",
                            borderTopRightRadius: "8px",
                            borderBottomLeftRadius: "8px",
                            height: "20px",
                          }}
                        >
                          <h6>-{item.discount}%</h6>
                        </div>
                      )}
                      <div className="col-lg-3 col-md-12 mb-4 mb-lg-0 ">
                        {/* Image */}
                        <div className="bg-image hover-overlay hover-zoom ripple rounded">
                          <img
                            src={base_url + item.exterior_image}
                            className="w-100 rounded"
                            style={{ height: "150px" }}
                            alt="Blue Jeans Jacket"
                          />
                          <a href="#!">
                            <div
                              className="mask"
                              style={{
                                backgroundColor: "rgba(251, 251, 251, 0.2)",
                              }}
                            />
                          </a>
                        </div>
                        {/* Image */}
                      </div>
                      <div
                        className="col-lg-5 col-md-6 mb-4 mb-lg-0 text-left "
                        style={{ textAlign: "left" }}
                      >
                        {/* Data */}
                        <p>
                          <strong>
                            {item.make} {item.model}
                          </strong>
                        </p>
                        <p>{}</p>
                        <p>{item.place}</p>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm mb-2"
                          title="Add to wish list"
                        >
                          <i className="fas fa-heart" />
                        </button>
                        {/* Data */}
                      </div>
                      <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        {/* Price */}
                        <p className="text-start text-md-center">
                          {item.discount ? (
                            <div>
                              <strong>
                                {Math.round(
                                  item.price -
                                    (item.price * item.discount) / 100
                                )}
                              </strong>
                              <strong
                                style={{
                                  textDecoration: "line-through",
                                  marginLeft: "10px",
                                }}
                              >
                                {item.price}
                              </strong>
                              <strong> /day</strong>
                            </div>
                          ) : (
                            <strong>{item.price} /day</strong>
                          )}
                        </p>
                        {/* Price */}
                      </div>
                      <div
                        className=" "
                        style={{
                          right: "10px",
                          bottom: "40px",
                          width: "45px",
                          marginLeft: "auto",
                          position: "relative",
                        }}
                      >
                        <Popconfirm
                          title={removeItemWarningMsg}
                          onConfirm={() => cartItemDlt(item)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <button
                            type="button"
                            className="btn btn-danger btn-sm me-1 "
                            title="Remove item"
                            // onClick={() => cartItemDlt(item)}
                          >
                            <i className="fas fa-trash" />
                          </button>
                        </Popconfirm>
                      </div>
                      {!item.availability && (
                        <strong className="text-danger">
                          Vehicle Unavailable
                        </strong>
                      )}
                      <hr />
                    </div>
                  ))}
                {/* Single item */}
              </div>
            </div>

            <div className="card mb-4 mb-lg-0">
              <div className="card-body">
                <p>
                  <strong>We accept</strong>
                </p>
                <img
                  className="me-2"
                  width="45px"
                  src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                  alt="Visa"
                />
                <img
                  className="me-2"
                  width="45px"
                  src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
                  alt="American Express"
                />
                <img
                  className="me-2"
                  width="45px"
                  src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                  alt="Mastercard"
                />
                <img
                  className="me-2"
                  width="45px"
                  src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce/includes/gateways/paypal/assets/images/paypal.webp"
                  alt="PayPal acceptance mark"
                />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h5 className="mb-0">Summary</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Products
                    <span>{totalProductAmount}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    Shipping
                    <span>{shippingCharge}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <div>
                      <strong>Total amount</strong>
                      <strong>
                        <p className="mb-0">(including GST)</p>
                      </strong>
                    </div>
                    <span>
                      <strong>{checkoutAmount}</strong>
                    </span>
                  </li>
                </ul>

                <Space direction="vertical" style={{ width: "100%" }}>
                  {hasAvailability && (
                    <DatePicker.RangePicker
                      // status="error"
                      format={dateFormat}
                      onCalendarChange={handleCalendarChange}
                      style={{ width: "100%" }}
                      aria-required
                    />
                  )}
                </Space>

                <br />

                <br />
                <button
                  type="button"
                  className="btn btn-dark btn-lg btn-block"
                  onClick={() => setOpen(true)}
                  disabled={checkoutDisabled}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
