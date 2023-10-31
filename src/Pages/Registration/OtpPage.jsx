import React, { useState } from "react";
import "./OtpPage.css";
import axios from "axios";
function OtpPage({ closeOtpModel, registerUser,phone }) {
  const [formData, setFormData] = useState({
    code_one: "",
    code_two: "",
    code_three: "",
    code_four: "",
    code_five: "",
    code_six: "",
  });

  const InputChnageHandler = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const phone_modified = phone.match(/\d{6}/g);

  const handleSubmit = (e) => {
    e.preventDefault();
    const otp_entered_string = `${formData.code_one}${formData.code_two}${formData.code_three}${formData.code_four}${formData.code_five}${formData.code_six}`;

    const code = parseInt(otp_entered_string, 10); //final otp after processing

    /// write request here
    console.log(code); 
    const post_data={
      code: code,
      phone:phone
    }
    axios.post("http://3.111.221.228/auth/get_otp/", {post_data:post_data}, {
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then((response) => {
        console.log("Response:", response.data);
        
        if (response.data.status==202) {
          
          registerUser();
          closeOtpModel();
        }
      
      })
      .catch((error) => {
        console.error("Error:", error);
      });


  };

  return (
    <div>
      <section className="wrapper">
        <div className="container">
          <div className="col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 col-xl-6 offset-xl-3 text-center pt-5">
            <form
              className="rounded bg-white shadow p-5"
              onSubmit={handleSubmit}
            >
              <h3 className="text-dark fw-bolder fs-4 mb-2">
                Two Step Verification
              </h3>
              <div className="fw-normal text-muted mb-4">
                Enter the verification code we sent to
              </div>
              <div className="d-flex align-items-center justify-content-center fw-bold mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={12}
                  height={12}
                  fill="currentColor"
                  className="bi bi-asterisk"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={12}
                  height={12}
                  fill="currentColor"
                  className="bi bi-asterisk"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={12}
                  height={12}
                  fill="currentColor"
                  className="bi bi-asterisk"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={12}
                  height={12}
                  fill="currentColor"
                  className="bi bi-asterisk"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={12}
                  height={12}
                  fill="currentColor"
                  className="bi bi-asterisk"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={12}
                  height={12}
                  fill="currentColor"
                  className="bi bi-asterisk"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z" />
                </svg>
                <span>{phone_modified}</span>
              </div>
              <div className="otp_input text-start mb-2">
                <label htmlFor="digit">Type your 6 digit security code</label>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <input
                    type="number"
                    name="code_one"
                    className="form-control"
                    onChange={InputChnageHandler}
                    value={formData.code_one}
                    placeholder
                  />
                  <input
                    type="number"
                    name="code_two"
                    className="form-control"
                    onChange={InputChnageHandler}
                    value={formData.code_two}
                    placeholder
                  />
                  <input
                    type="number"
                    name="code_three"
                    className="form-control"
                    onChange={InputChnageHandler}
                    value={formData.code_three}
                    placeholder
                  />
                  <input
                    type="number"
                    name="code_four"
                    className="form-control"
                    onChange={InputChnageHandler}
                    value={formData.code_four}
                    placeholder
                  />
                  <input
                    type="number"
                    name="code_five"
                    className="form-control"
                    onChange={InputChnageHandler}
                    value={formData.code_five}
                    placeholder
                  />
                  <input
                    type="number"
                    name="code_six"
                    className="form-control"
                    onChange={InputChnageHandler}
                    value={formData.code_six}
                    placeholder
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-dark submit_btn my-4">
                Submit
              </button>
              <div className="fw-normal text-muted mb-2">
                Didn't get the code ?{" "}
                <a
                  href="#"
                  className="text-primary fw-bold text-decoration-none"
                >
                  Resend
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OtpPage;
