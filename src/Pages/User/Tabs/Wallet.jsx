import React,{ useEffect,useState } from "react";
import { Divider, Button } from "antd";

function Wallet(props) {

const [balance, setBalance] = useState('')

useEffect(() => {
setBalance(props.user.wallet_cash)

}, [props])

    
  return (
    <div>
      <div className="container" style={{height:'80vh'}}>
        <div className="balance-wrapper row g-3  gx-3 p-3">
          <div
            className="col col-sm-12 col-md-5  border rounded  p-4 px-5 "
            style={{ textAlign: "left" }}
          >
            <h3>Balance :</h3>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <img
                style={{ width: "30px" }}
                src={process.env.PUBLIC_URL + "/Images/rupee.svg"}
              />
            {balance&&  <h4 className="m-4 ">{balance}</h4>}
            </div>
          </div>

          <div
            className="col col-md-7  border rounded  p-4 "
            style={{ textAlign: "left" }}
          >
            <Button primary type="text">
            <h6>Add fund</h6>

            </Button>
            <Divider />
            <h6></h6>
            <Divider />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
