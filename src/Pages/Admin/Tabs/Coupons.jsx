import React, { useState } from "react";
import primary_instance from "../../../Components/axios_primary_instance";

function Coupons() {
  const [min_price, setMin_price] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {
      min_price: min_price,
      coupon_code: couponCode,
      coupon_discount:couponDiscount
    };
    primary_instance.post("/manage_coupons/", { params: params });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          required
          type="text"
          style={{ background: "white" }}
          placeholder="Coupon Code (10 CHARS)"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <input
          required
          type="number"
          style={{ background: "white" }}
          placeholder="Minimum purchase amount"
          value={min_price}
          onChange={(e) => setMin_price(e.target.value)}
        />
        <input
          required
          type="number"
          style={{ background: "white" }}
          placeholder="Coupon discount amount"
          value={couponDiscount}
          onChange={(e) => setCouponDiscount(e.target.value)}
        />
        <br />
        <button type="submit" className="btn btn-md btn-dark">
          Create Coupon
        </button>
      </form>
    </div>
  );
}

export default Coupons;
