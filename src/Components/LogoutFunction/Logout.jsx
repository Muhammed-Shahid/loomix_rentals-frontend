import { useEffect } from "react";
import axios from "axios";

export const Logout = () => {
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
        window.location.href = "/login";
      } catch (e) {
        console.log("logout not working", e);
      }
}

//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await axios.post(
//           "http://localhost:8000/auth/logout/",
//           {
//             refresh_token: localStorage.getItem("refresh_token"),
//           },
//           { headers: { "Content-Type": "application/json" } },
//           { withCredentials: true }
//         );
//         localStorage.clear();
//         axios.defaults.headers.common["Authorization"] = null;
//         window.location.href = "/login";
//       } catch (e) {
//         console.log("logout not working", e);
//       }
//     })();
//   }, []);

  return <p onClick={logOut}>Log out</p>
  
};


