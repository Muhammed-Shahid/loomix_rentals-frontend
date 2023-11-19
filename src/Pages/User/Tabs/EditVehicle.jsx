import React, { useEffect, useState } from "react";
import { Image } from "antd";
import "./EditVehicle.css";
import axios from "axios";
import primary_instance from "../../../Components/axios_primary_instance";
import { useParams } from "react-router-dom";
function EditVehicle() {
  const [vehicle, setVehicle] = useState([]);

  const [fuel, setFuel] = useState(false);
  const [rcBook, setRcBook] = useState(null);
  const [pollution, setPollution] = useState(null);
  const [interior, setInterior] = useState(null);
  const [exterior, setExterior] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const { vehicle_id } = useParams();

  const base_url = "http://localhost:8000";

  const token = localStorage.getItem("access_token");

  const params = {
    vehicle_id: vehicle_id,
  };
  useEffect(() => {
    if (token != null) {
      axios
        .get(`${base_url}/auth/current_user/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("current user", res.data);
          setCurrentUser(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    primary_instance.get("/vehicles_view/", { params: params }).then((res) => {
      console.log("edit vehicle", res.data.vehicles);
      setVehicle(res.data.vehicles[0]);
    });
  }, []);

  const fuelChnageHandler = () => {
    setFuel(!fuel);
    console.log(fuel);
  };

  let fuelAmountField = "disabled";

  if (fuel) {
    fuelAmountField = "";
  }

  useEffect(() => {
    setFormData((formData) => ({
      ...formData,
      ["make"]: vehicle.make,
      ["model"]: vehicle.model,
      ["varient"]: vehicle.varient,
      ["vehicle_number"]: vehicle.vehicle_number,
      ["place"]: vehicle.place,
      ["price"]: vehicle.price,
      ["transmission"]: vehicle.transmission,
      ["fuel_type"]: vehicle.fuel_type,
      ["fuel_available"]: vehicle.fuel_available,
     
    }));
  }, [vehicle]);

  const [formData, setFormData] = useState({
    // Initialize the form data object with default values

    vehicle_number: "",
    make: "",
    model: "",
    transmission: "",
    varient: "",
    fuel_type: "",
    fuel_available: 0,
    place: "",
    price: "",

    // Add more fields as needed
  });

  const handleInputChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    const request_data = new FormData();

    request_data.append("rc_book", rcBook);
    request_data.append("pollution_certificate", pollution);
    request_data.append("exterior_image", exterior);
    request_data.append("interior_image", interior);
    request_data.append("owner", currentUser.user_id);

    for (var pair of request_data.entries()) {
      console.log(pair[0] + " - " + pair[1]);
    }

    const edit_params = {
      formData:JSON.stringify(formData),
      vehicle_id,
      request_data
      
    };

    axios
      .patch(`${base_url}/vehicles_view/`, edit_params, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("File uploaded successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div>
      <div className="container pt-5 mt-5">
        <div
          className="form-Wrapper  p-5 "
          style={{ boxSizing: "border-box", textAlign: "left" }}
        >
          <div className="headding w-100" style={{ textAlign: "left" }}>
            <h2>Enter Vehicle Details</h2>
          </div>

          <br />
          <br />
          <form onSubmit={handleSubmit}>
            <div className="form-row row">
              <div className="form-group col-md-4">
                <label htmlFor="inputEmail4">Make</label>
                {vehicle && (
                  <input
                    type="text"
                    className="form-control border"
                    name="make"
                    id="inputEmail4"
                    placeholder={vehicle.make}
                    value={formData.make}
                    onChange={handleInputChange}
                  />
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputPassword4">Model</label>
                <input
                  type="text"
                  className="form-control"
                  name="model"
                  id="inputPassword4"
                  placeholder={vehicle.model}
                  value={formData.model}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group col-md-4">
                <label htmlFor="inputPassword4">Varient</label>
                <input
                  type="text"
                  className="form-control"
                  name="varient"
                  id="inputPassword4"
                  placeholder={vehicle.varient}
                  value={formData.varient}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row row pt-5">
              <div className="form-group col-md-4">
                <label htmlFor="inputState">Transmission</label>

                <select
                  id="inputState"
                  name="transmission"
                  required
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">--Select Transmission Type--</option>
                  <option>Manual</option>
                  <option>Automatic</option>
                  <option>AMT</option>
                  <option>CVT</option>
                  <option>DCT</option>
                  <option>DSG</option>
                </select>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputState">Fuel Type</label>
                <select
                  id="inputState"
                  className="form-control"
                  required
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                >
                  <option value="">--Select Fuel Type--</option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Petrol-Turbo</option>
                  <option>Hydrogen</option>
                  <option>Hybrid</option>
                  <option>Electric</option>
                </select>
              </div>
              <div className="form-group col-md-4">
                <div className="row">
                  <div className="col">
                    <div>
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        With Fuel
                        <br />
                        <input
                          className="form-check-input border-2 "
                          type="checkbox"
                          id="flexCheckDefault"
                          checked={fuel}
                          onChange={fuelChnageHandler}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="col">
                    <label htmlFor="inputZip">Fuel Amount</label>
                    <input
                      disabled={fuelAmountField}
                      type="number"
                      className="form-control"
                      id="inputZip"
                      placeholder="In litres"
                      name="fuel_available"
                      value={formData.fuel_available}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row row pt-5">
              <div className="form-group col-md-4">
                <label htmlFor="inputState">License Plate No.</label>

                <input
                  type="text"
                  className="form-control"
                  name="vehicle_number"
                  id="inputPassword4"
                  value={formData.vehicle_number}
                  onChange={handleInputChange}
                  placeholder={vehicle.vehicle_number}
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputState">Place</label>
                <input
                  type="text"
                  className="form-control"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  id="inputPassword4"
                  placeholder={vehicle.place}
                />
              </div>

              <div className="form-group col-md-4">
                <label htmlFor="inputState">Listing Price</label>
                <input
                  type="text"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  id="inputPassword4"
                  placeholder={vehicle.price}
                />
              </div>
            </div>

            <div className="form-group mt-5">
              <label htmlFor="inputAddress2">Additional Remarks If Any</label>
              <textarea
                type="text"
                className="form-control"
                id="inputAddress2"
              />
            </div>

            <div className="form-group border rounded mt-5 text-center">
              <div className="row gx-5 p-5">
                {/* First Column */}
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      {/* Content for the first column */}

                      <label className="fileInputLabel" htmlFor="rcBook">
                        <Image
                          style={{ maxWidth: "30%" }}
                          src={
                            base_url+vehicle.rc_book
                          }
                          fluid
                          alt="upload file"
                        />
                        <input
                          className="fileInput"
                          type="file"
                          name="rcBook"
                          id="rcBook"
                          style={{ display: "none" }}
                          onChange={(e) => setRcBook(e.target.files[0])}
                        />
                        <p>
                          Click to <br /> Upload 
                        </p>
                        <p>RC Book</p>

                        {rcBook && <p>{rcBook.name}</p>}
                      </label>
                    </div>
                  </div>
                </div>
                {/* Second Column */}
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      {/* Content for the second column */}
                      <label className="fileInputLabel" htmlFor="pollution">
                        <Image
                          style={{ maxWidth: "30%" }}
                          src={
                            base_url+vehicle.pollution_certificate
                          }
                          fluid
                          alt="upload file"
                        />
                        <input
                          className="fileInput"
                          type="file"
                          name="pollution"
                          id="pollution"
                          style={{ display: "none" }}
                          onChange={(e) => setPollution(e.target.files[0])}
                        />
                        <p>
                          Click to <br /> Upload
                        </p>

                        <p>Pollution Certificate</p>
                        {pollution && <p>{pollution.name}</p>}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      {/* Content for the first column */}
                      <label className="fileInputLabel" htmlFor="exterior">
                        <Image
                          style={{ maxWidth: "30%" }}
                          src={
                           base_url+vehicle.exterior_image
                          }
                          fluid
                          alt="upload file"
                        />
                        <input
                          className="fileInput"
                          type="file"
                          name="exterior"
                          id="exterior"
                          style={{ display: "none" }}
                          onChange={(e) => setExterior(e.target.files[0])}
                        />
                        <p>
                          Click to <br /> Upload
                        </p>
                        <p>Exterior Image</p>
                        {exterior && <p>{exterior.name}</p>}
                      </label>
                    </div>
                  </div>
                </div>
                {/* Second Column */}
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      {/* Content for the second column */}
                      <label className="fileInputLabel" htmlFor="interior">
                        <Image
                          style={{ maxWidth: "30%" }}
                          src={
                            base_url+vehicle.interior_image

                          }
                          fluid
                          alt="upload file"
                        />
                        <input
                          className="fileInput"
                          type="file"
                          name="interior"
                          id="interior"
                          style={{ display: "none" }}
                          onChange={(e) => setInterior(e.target.files[0])}
                        />
                        <p>
                          Click to <br /> Upload
                        </p>

                        <p>Interior Image</p>

                        {interior && <p>{interior.name}</p>}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" class="button mt-5">
              <svg
                xmlns="https://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                ></path>
              </svg>

              <div class="text">Submit Details</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditVehicle;
