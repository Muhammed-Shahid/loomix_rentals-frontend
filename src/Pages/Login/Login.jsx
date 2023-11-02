import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [is_blockedUser, setIs_BlockedUser] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    const { data } = await axios.post("http://loomix.in/token/", user, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    try {
      localStorage.clear();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("access_token")}`;

      const  user_data  = await axios.get("http://loomix.in/auth/current_user/")
        .then((res) => {
       
          if (res.data.is_blocked) {
      
            setIs_BlockedUser(true)
          }else{

            window.location.href = "/browse";
          }
        });
 
    } catch (error) {
      setLoginError(true);
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="loginContainer row">
        <div className="col col-md-6 col-12 ">
          <h2>Welocome Back</h2>

          <div className="wrapper">
            {/* <div className="logo"> */}
            <img
            // src="https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-bird-symbols-png-logo-0.png"
            />
            {/* </div> */}
            {/* <div className="text-center mt-4 name">Twitter</div> */}
            <form className="p-3 mt-3" onSubmit={handleSubmit}>
              <div className="form-field d-flex align-items-center">
                <span className="far fa-user" />
                <input
                  type="email"
                  name="email"
                  id="userName"
                  placeholder="Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-field d-flex align-items-center">
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
              </div>

              {loginError && (
                <p className="text-danger">Incorrect username or password</p>
              )}
                {is_blockedUser && (
                <p className="text-danger">Your account is blocked. Please Contact Support</p>
              )}
              <button type="submit" className="login-btn  mt-3">
                Login
              </button>
            </form>
            <div className="text-center fs-6">
              <a href="">Forget password?</a> or <a href="/register">Sign up</a>
            </div>
          </div>
        </div>

        <div className="col col-md-6 col-12 bg-secondary">
          <p>"Unlock Your Journey: Log In to Explore the Open Road" </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
