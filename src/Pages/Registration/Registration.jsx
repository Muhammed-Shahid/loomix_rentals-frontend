import React, { useState } from "react";
import "./Registration.css";
import instance from "../../Components/axios_instance";
import axios from "axios";
import OtpPage from "./OtpPage";
function Registration() {
  const [formData, setFormData] = useState({
    // Initialize the form data object with default values
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    re_password: "",
    license: "",
    house: "",
    street: "",
    place: "",
    city: "",
    state: "",
    zip_code: "",
    landmark: "",
  });

  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [otpModel, setOtpModel] = useState(false);

  const otpModelHandler = () => {
    setOtpModel(false);
  };

  const renderInnerComponent = () => {
    if (otpModel) {
      return (
        <OtpPage closeOtpModel={otpModelHandler} registerUser={registerUser} phone={formData.phone}/>
      );
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const registerUser = () => {
    axios
      .post("http://loomix.in/auth/create_user/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response:", response.data);

        window.location = "/login";
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log("user registered");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password == formData.re_password) {
      console.log(formData);
      const params = {
        phone: formData.phone,
       
      };
      axios
        .get("http://loomix.in/auth/get_otp", {
          params: params,
        })
        .then((response) => {
          console.log(response.data);
          setOtpModel(true);
        })
        .catch((error) => {
          console.error(error);
        });

    } else {
      setPasswordMismatch(true);
    }
  };

  return (
    <div className="container">
      <section className="h-100 h-custom gradient-custom-2">
        <div className="container py-5 h-100">
          {otpModel ? (
            renderInnerComponent()
          ) : (
            <form  onSubmit={handleSubmit}>
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12">
                  <div
                    className="card card-registration card-registration-2"
                    style={{ borderRadius: 15 }}
                  >
                    <div className="card-body p-0">
                      <div className="row g-0">
                        <div className="col-lg-6">
                          <div className="p-5">
                            <h3 className="fw-normal mb-5">
                              General Infomation
                            </h3>
                            <div className="mb-4 pb-2"></div>
                            <div className="row">
                              <div className="col-md-6 mb-4 pb-2">
                                <div className="form-outline">
                                  <input
                                    type="text"
                                    required
                                    id="form3Examplev2"
                                    className="form-control form-control-lg"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-label"
                                    htmlFor="form3Examplev2"
                                  >
                                    First Name
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 mb-4 pb-2">
                                <div className="form-outline">
                                  <input
                                    type="text"
                                    required
                                    id="form3Examplev3"
                                    className="form-control form-control-lg"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-label"
                                    htmlFor="form3Examplev3"
                                  >
                                    Last Name
                                  </label>
                                </div>
                              </div>
                            </div>
                            {/* <div className="mb-4 pb-2">
                    <select className="select">
                      <option value={1}>Position</option>
                      <option value={2}>Two</option>
                      <option value={3}>Three</option>
                      <option value={4}>Four</option>
                    </select>
                  </div> */}
                            <div className="row mt-5">
                              <div className="col-md-6 mb-4 pb-2 mb-md-0 pb-md-0">
                                <div className="form-outline">
                                  <input
                                    type="text"
                                    required
                                    id="form3Examplev5"
                                    className="form-control form-control-lg"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-label"
                                    htmlFor="form3Examplev5"
                                  >
                                    Email
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-outline">
                                  <input
                                    type="tel"
                                    id="form3Examplev5"
                                    required
                                    className="form-control form-control-lg"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-label"
                                    htmlFor="form3Examplev5"
                                  >
                                    Phone
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="row mt-5">
                              <div className="col-md-6 mb-4 pb-2 mb-md-0 pb-md-0">
                                <div className="form-outline">
                                  <input
                                    type="password"
                                    id="form3Examplev5"
                                    className="form-control form-control-lg"
                                    required
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-label"
                                    htmlFor="form3Examplev5"
                                  >
                                    Password
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-outline">
                                  <input
                                    type="password"
                                    id="form3Examplev5"
                                    className="form-control form-control-lg"
                                    required
                                    name="re_password"
                                    value={formData.re_password}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-label"
                                    htmlFor="form3Examplev5"
                                  >
                                    Re Enter Password
                                  </label>
                                </div>
                              </div>
                            </div>
                            {passwordMismatch && (
                              <p className="text-danger">
                                Passwords are not matching
                              </p>
                            )}
                            <div className="row mt-5">
                              <div className="col">
                                <div className="form-outline">
                                  <input
                                    required
                                    type="text"
                                    id="form3Examplev5"
                                    className="form-control form-control-lg"
                                    name="license"
                                    value={formData.license}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-label"
                                    htmlFor="form3Examplev5"
                                  >
                                    License No.
                                  </label>
                                </div>
                              </div>
                            </div>
                            <br />
                            <br />

                            <p>
                              Already a user ? <a href="/login"> Login </a>
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-6 bg-indigo text-white">
                          <div className="p-5">
                            <h3 className="fw-normal mb-5">Contact Details</h3>
                            <div className="mb-4 pb-2">
                              <div className="form-outline form-white">
                                <input
                                  type="text"
                                  id="form3Examplea2"
                                  className="form-control form-control-lg"
                                  required
                                  name="house"
                                  value={formData.house}
                                  onChange={handleInputChange}
                                />
                                <label
                                  className="form-label"
                                  htmlFor="form3Examplea2"
                                >
                                  House No./ Name
                                </label>
                              </div>
                            </div>
                            <div className="mb-4 pb-2">
                              <div className="form-outline form-white">
                                <input
                                  required
                                  type="text"
                                  id="form3Examplea3"
                                  className="form-control form-control-lg"
                                  name="street"
                                  value={formData.street}
                                  onChange={handleInputChange}
                                />
                                <label
                                  className="form-label"
                                  htmlFor="form3Examplea3"
                                >
                                  Street
                                </label>
                              </div>
                            </div>

                            <div className="mb-4 pb-2">
                              <div className="form-outline form-white">
                                <input
                                  required
                                  type="text"
                                  id="form3Examplea3"
                                  className="form-control form-control-lg"
                                  name="place"
                                  value={formData.place}
                                  onChange={handleInputChange}
                                />
                                <label
                                  className="form-label"
                                  htmlFor="form3Examplea3"
                                >
                                  Place
                                </label>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-5 mb-4 pb-2">
                                <div className="form-outline form-white">
                                  <input
                                    required
                                    type="text"
                                    id="form3Examplea4"
                                    className="form-control form-control-lg"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-label"
                                    htmlFor="form3Examplea4"
                                  >
                                    City
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-7 mb-4 pb-2">
                                <div className="form-outline form-white">
                                  <input
                                    type="text"
                                    required
                                    id="form3Examplea5"
                                    className="form-control form-control-lg"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-label"
                                    htmlFor="form3Examplea5"
                                  >
                                    State
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-5 mb-4 pb-2">
                                <div className="form-outline form-white">
                                  <input
                                    required
                                    type="text"
                                    id="form3Examplea4"
                                    className="form-control form-control-lg"
                                    value={formData.zip_code}
                                    name="zip_code"
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-label"
                                    htmlFor="form3Examplea4"
                                  >
                                    Zip Code
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-7 mb-4 pb-2">
                                <div className="form-outline form-white">
                                  <input
                                    type="text"
                                    id="form3Examplea5"
                                    className="form-control form-control-lg"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-label"
                                    htmlFor="form3Examplea5"
                                  >
                                    Land Mark
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="form-check d-flex justify-content-start mb-4 pb-3">
                              <input
                                className="form-check-input me-3"
                                type="checkbox"
                                defaultValue
                                id="form2Example3c"
                              />
                              <label
                                className="form-check-label text-white"
                                htmlFor="form2Example3"
                              >
                                I do accept the{" "}
                                <a href="#!" className="text-white">
                                  <u>Terms and Conditions</u>
                                </a>
                              </label>
                            </div>
                            <button
                              type="submit"
                              className="btn btn-light btn-lg"
                              data-mdb-ripple-color="dark"
                            >
                              Register
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default Registration;
