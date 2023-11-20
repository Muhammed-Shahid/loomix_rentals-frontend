import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useEffect } from "react";

function PaypalPaymentComponent(props) {
  const [paid, setPaid] = useState(false);
  const [paypalPaymentErr, setpaypalPaymentErr] = useState(false);
//   const data = props.data;



  let access_token = localStorage.getItem("access_token");
  const handlePaymentSuccess = async (orderId) => {
    const data = await axios({
      url: `http://localhost:8000/manage_order/`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      data: props.data,
    })
      .then((res) => {
        console.log(res);
        
        props.closeModal()
        return res;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          console.log("Unauthorized access. Redirecting to login page.");
          window.location.replace("/login");
        }
      });

    setPaid(true);
  };
  return (
    <div>
      <div className="container">
        <PayPalButtons
          style={{
            color: "silver",
            layout: "horizontal",
            height: 48,
            tagline: false,
            shape: "pill",
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: "product.description",
                  amount: {
                    value: Math.round(props.amount*0.01368),
                    currency_code: "USD",
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            const order = await actions.order.capture();
            console.log("order", order);

            handlePaymentSuccess(data.orderID);
          }}
          onError={(err) => {
            setpaypalPaymentErr(err);
            console.error("PayPal Checkout onError", err);
          }}
        />
      </div>
    </div>
  );
}

export default PaypalPaymentComponent;
