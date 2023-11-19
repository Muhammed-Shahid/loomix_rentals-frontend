import axios from "axios";
import logOut from "./LogoutFunction/LogoutFunction";

const token = localStorage.getItem("access_token");
const unauthorized_instance = axios.create({
  baseURL: "http://localhost:8000",

  headers: {
    "Content-Type": "application/json",
  },
});

unauthorized_instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is a permission error
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Handle the permission error here
      console.error("Permission error:", error.response.data);
      logOut();
      // You may redirect to a login page or display a modal
      // or dispatch an action to update the state, etc.
    }

    // If it's not a permission error, pass the error along
    return Promise.reject(error);
  }
);

export default unauthorized_instance;
