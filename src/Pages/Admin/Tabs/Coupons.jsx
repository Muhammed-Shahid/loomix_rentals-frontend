import React, { useEffect, useState } from "react";
import primary_instance from "../../../Components/axios_primary_instance";
import { Divider, Card, Button, Popconfirm, message } from "antd";
function Coupons() {
  const [min_price, setMin_price] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const [allCoupons, setAllCoupons] = useState([]);
  const handleSubmit = (e) => {
    console.log("handle submit working.........");
    e.preventDefault();
    const params = {
      min_price: min_price,
      coupon_code: couponCode,
      coupon_discount: couponDiscount,
    };
    primary_instance.post("/manage_coupons/", { params: params }).then(()=>{
      success();
      setAllCoupons([...allCoupons, params]);

    });
  };

  const handleDeleteCOupon=(coupon_id)=>{
    primary_instance.put('/manage_coupons/',{coupon_id:coupon_id}).then((res)=>{
      console.log(res.data);
    })
  }

  useEffect(() => {
    primary_instance.get("/admin_controls/view_coupons/").then((res) => {
      console.log(res.data.coupons);
      setAllCoupons(res.data.coupons);
    });
  }, []);

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Coupon Created",
      style: {
        marginTop: '20vh',
      },
    });
  };

  return (
    <div>
       {contextHolder}
      <section className="coupon-creator">
        <form className="p-3 g-3" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="row  p-2">
              <input
                className="form-control mt-3 col col-md-6"
                required
                type="text"
                style={{ background: "white" }}
                placeholder="Coupon Code (10 CHARS)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <input
                className="form-control mt-3 col col-md-6"
                required
                type="number"
                style={{ background: "white" }}
                placeholder="Minimum purchase amount"
                value={min_price}
                onChange={(e) => setMin_price(e.target.value)}
              />
            </div>
            <input
              className="form-control mt-3"
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
          </div>
        </form>
      </section>
      <section className="coupon-viewer p-4">
        <div className="row">
          {allCoupons &&
            allCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="col col-md-4 border rounded p-3 m-2"
                style={{ textAlign: "left" }}
              >
                <div>
                  <h5>Coupon Code : {coupon.coupon_code}</h5>
                  <br />
                  <h6>Coupon Discount Amount : {coupon.coupon_discount} Rs</h6>
                  <br />
                  <h6>Purchase Threshold : {coupon.min_price} Rs</h6>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "10px",
                  }}
                >
        
                  <Popconfirm
                    title="Delete Address"
                    description="Delete this coupon?"
                     onConfirm={()=>handleDeleteCOupon(coupon.id)}
                    // onCancel={cancelDeletePop}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button  type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default Coupons;
