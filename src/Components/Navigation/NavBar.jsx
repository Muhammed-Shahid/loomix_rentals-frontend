import axios from "axios";
import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Logout } from "../LogoutFunction/Logout";
import { Link } from "react-router-dom";
import primary_instance from "../axios_primary_instance";

function NavBar(props) {
  const [visibility, setVisibility] = useState(true);
  const base_url = "https://loomix.in";
  const [currentUser, setCurrentUser] = useState("");

  const cart_url = "/cart/";
  const wishlist_url = "/wishlist/";
  

  useEffect(() => {
    const auth_token = localStorage.getItem("access_token");
    if (auth_token == undefined || auth_token == "" || auth_token == null) {
      if (window.location.pathname != "/login" && window.location.pathname != "/"  &&window.location.pathname != "/register") {
        
        window.location.href = "/login";
      }
    }
  }, [])
  
  useEffect(() => {

    if (
      localStorage.getItem("access_token") == null ||
      window.location.pathname == "/login" ||
      window.location.pathname == "/" ||
      window.location.pathname == "/register"
    ) {
      setVisibility(false);
    } else {
      setVisibility(true);
    }

    const token = localStorage.getItem("access_token");
    if (token != null && visibility) {
      primary_instance
        .get('/auth/current_user/', {
        
        })
        .then((res) => {
          // console.log('current',res.data);
          setCurrentUser(res.data);
          props.handleUserChange(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [window.location]);

  return (
    <div>
      {visibility ? (
        <div
          className="NavBarContainer container-fluid"
          style={{ height: "5rem" }}
        >
          <Navbar
            collapseOnSelect
            expand="lg"
            className="bg-body-tertiary fixed-top navbar-dark w-100  pt-0 pb-0"
          >
            <div
              className="bg-dark container-fluid p-3"
              style={{ height: "5rem" }}
            >
              <Navbar.Brand href="/browse">LOOMIX</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav>
                  <Nav.Link href="/browse">Browse Cars</Nav.Link>

                  <Nav.Link href="/list_car">Host Your Car</Nav.Link>
                  <NavDropdown
                    title={"Hi " + "" + currentUser.first_name}
                    id="collasible-nav-dropdown"
                  >
                    {/* <NavDropdown.Item href="/account">Account</NavDropdown.Item> */}

                    <NavDropdown.Item href={wishlist_url}>
                      Wishlist
                    </NavDropdown.Item>

                    <NavDropdown.Item href={cart_url}>Cart</NavDropdown.Item>
                    <NavDropdown.Item href="/dashboard">
                      Dashboard
                    </NavDropdown.Item>

                    {currentUser.is_admin && (
                      <NavDropdown.Item href="/admin_dash">
                        Admin Dashboard
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <Logout />
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="#pricing">Help</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </div>
          </Navbar>
        </div>
      ) : (
        <div className="pseudoNavDiv pt-5"></div>
      )}
    </div>
  );
}

export default NavBar;
