import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Login.css";
import primary_instance from "../../Components/axios_primary_instance";
import unauthorized_instance from "../../Components/axios_unauthorized_instance";
function PasswordReset() {
  const [email, setEmail] = useState("");
  const [currentPhone, setcurrentPhone] = useState("");
  const [otp_input, setotp_input] = useState(false);
  const [otpValue, setotpValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [newPasswordEntry, setnewPasswordEntry] = useState(false);
  const handleGenerateOtp = (e) => {
    e.preventDefault();

    if (
      currentPhone == "" ||
      Number(currentPhone) <= 0 ||
      currentPhone.length < 10 ||
      currentPhone.length > 10
    ) {
      setErrorMsg("Please enter a valid phone number");
    } else {
      const params = {
        phone: currentPhone,
      };
      setErrorMsg("");
      unauthorized_instance
        .get("/auth/get_otp/", {
          params: params,
        })
        .then((response) => {
          console.log(response.data);
          setotp_input(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const code = otpValue; //final otp after processing

    /// write request here
    console.log(code);
    const post_data = {
      code: code,
      phone: currentPhone,
    };
    unauthorized_instance
      .post("/auth/get_otp/", { post_data: post_data })
      .then((response) => {
        console.log("Response:", response.data);

        if (response.data.status == 202) {
          setotp_input(false);

          checkUserExistence();
        }
      })
      .catch((error) => {
        setErrorMsg("Invalid OTP");
      });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let new_value = value;
    if (name == "phone") {
      new_value = new_value.replace(/[^0-9]/g, "");

      setcurrentPhone(new_value);
    }
    if (name == "password") {
      new_value = new_value.replace(/\s/g, "");
      setnewPassword(new_value);
    }
  };

  const checkUserExistence = () => {
    const params = {
      phone: currentPhone,
      email: email,
    };
    unauthorized_instance
      .get("/auth/reset_password/", { params: params })
      .then((res) => {
        setnewPasswordEntry(true);
      })
      .catch((err) => {
        if (err.response.status == 404) {
          setErrorMsg("User not found");
        }
      });
  };

  const changePassword = () => {
    const params = {
      phone: currentPhone,
      email: email,
      new_password: newPassword,
    };
    unauthorized_instance.post("/auth/reset_password/", { params: params }).then((res)=>{
      setnewPasswordEntry(false)
      setotp_input(false)
      setEmail('')
      setcurrentPhone('')
      setnewPassword('')
      window.location.replace('/login')
    });
  };
  return (
    <div className="container">
      <div className="loginContainer row">
        <div className="col  col-12 ">
          <h2>Reset Password</h2>

          <div className="wrapper">
            {!newPasswordEntry && (
              <form className="p-3 mt-3" onSubmit={handleGenerateOtp}>
                <div className="form-field d-flex align-items-center">
                  <span className="far fa-user" />

                  <input
                    type="text"
                    name="email"
                    id="email"
                    disabled={otp_input}
                    placeholder="enter email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value.replace(/\s/g, ""))
                    }
                  />
                </div>
                <div className="form-field d-flex align-items-center">
                  <span className="far fa-user" />

                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    disabled={otp_input}
                    placeholder="enter phone number"
                    value={currentPhone}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                {!otp_input && <p className="text-danger">{errorMsg}</p>}

                {/* <div className="form-field d-flex align-items-center">
              <span className="fas fa-key" />
              <input
                type="password"
                name="password"
                id="pwd"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div> */}

                {!otp_input && (
                  <button type="submit" className="login-btn  mt-3">
                    Recieve OTP
                  </button>
                )}
              </form>
            )}

            {otp_input && (
              <div>
                <div style={{ marginLeft: "auto", width: "200px" }}>
                  <button
                    onClick={() => setotp_input(false)}
                    className="btn btn-text text-primary"
                  >
                    Change number
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-3">
                  <input
                    onChange={(e) => setotpValue(e.target.value)}
                    id="partitioned"
                    style={{ background: "white" }}
                    type="text"
                    maxLength={6}
                  />

                  <div className="otp-send-btn mt-3 p-5">
                    <button type="submit" className="login-btn ">
                      Submit OTP
                    </button>
                  </div>
                </form>

                <div className="errMsg">
                  <p className="text-danger font-weight-bold"> {errorMsg} </p>
                </div>
              </div>
            )}

            {newPasswordEntry && (
              <div>
                <div className="form-field d-flex align-items-center">
                  <span className="far fa-user" />

                  <input
                    type="password"
                    name="password"
                    id="password"
                    disabled={!newPasswordEntry}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="p-5">
                  <button onClick={changePassword} className="btn login-btn">Change password</button>
                </div>
              </div>
            )}
            <div className="text-center fs-6">
              <a href="/login">Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
