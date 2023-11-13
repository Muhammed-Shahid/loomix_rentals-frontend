import axios from "axios";

const token = localStorage.getItem("access_token");
const primary_instance = axios.create({
  baseURL: "http://localhost:8000",

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default primary_instance;
