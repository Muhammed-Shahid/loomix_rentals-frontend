import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import Registration from "./Pages/Registration/Registration";
import LandingPage from "./Pages/LandingPage/LandingPage";
import NavBar from "./Components/Navigation/NavBar";
import Login from "./Pages/Login/Login";
import ListCars from "./Pages/ListCars/ListCars";
import Dashboard from "./Pages/Admin/Panel/Dashboard";
import Browse from "./Pages/BrowseCars/Browse";
import UserDashboard from "./Pages/User/Panel/UserDashboard";
import CarDetails from "./Pages/BrowseCars/CarDetails";
import Cart from "./Pages/Cart/Cart";
import EditVehicle from "./Pages/User/Tabs/EditVehicle";
import { useState } from "react";
import InvoiceGenerator from "./Components/InvoiceGenerator";
import { ExcelGenerator } from "./Components/ExcelGenerator";
import Wishlist from "./Pages/WIshlist/Wishlist";

function App() {
  const [user, setUser] = useState([]);

  const handleUserChange = (user) => {
    setUser(user);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/browse",
      element: <Browse />,
    },
    {
      path: "/register",
      element: <Registration />,
    },

    {
      path: "/list_car",
      element: <ListCars />,
    },
    {
      path: "/admin_dash",
      element: <Dashboard />,
    },
    {
      path: "/dashboard",
      element: <UserDashboard user={user} />,
    },

    {
      path: "/vehicle-detail_view/:vehicle_id",
      element: <CarDetails />,
    },

    {
      path: "/cart/",
      element: <Cart />,
    },
    {
      path: "/vehicle-edit/:vehicle_id",
      element: <EditVehicle />,
    },
    {
      path: "/wishlist",
      element: <Wishlist />,
    },
  ]);

  return (
    <div className="App">
      {(window.location.href != "http://localhost:3000/login") |
        (window.location.href != "http://localhost:3000/") && (
        <NavBar handleUserChange={handleUserChange} />
      )}

      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
