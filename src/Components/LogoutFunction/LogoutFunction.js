import axios from "axios";

 const logOut = async () => {
    try {
        const { data } = await axios.post(
          "http://localhost:8000/auth/logout/",
          {
            refresh_token: localStorage.getItem("refresh_token"),
          },
          { headers: { "Content-Type": "application/json" } },
          { withCredentials: true }
        );
        localStorage.clear();
        axios.defaults.headers.common["Authorization"] = null;
        window.location.replace('http://localhost:3000/login');
      } catch (e) {
        console.log("user already logged out", e);
        window.location.replace('http://localhost:3000/login');

      }
}
export default logOut ;