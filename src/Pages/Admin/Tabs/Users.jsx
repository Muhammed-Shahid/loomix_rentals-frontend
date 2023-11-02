import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import instance from "../../../Components/axios_instance";
import {  message, Popconfirm } from "antd";
import primary_instance from "../../../Components/axios_primary_instance";
function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [reRender, setReRender] = useState(false);
  
  const blockUserWarning= <p>"Blocked users won't be able to access <br /> 
  any personal or public features of the app"</p>
  const confirm = (user_id) => {
    message.info('Clicked on Yes.');

     handleUserBlock(user_id, "True")

  };

  const handleUserBlock = (id, boolean) => {
    // e.preventDefault();
    console.log(id, boolean);
    primary_instance
      .put("/admin_controls/manage_user/", { user_id: id, boolean: boolean })
      .then((res) => {
        setReRender(!reRender);
      });
  };
  useEffect(() => {
    instance.get("/admin_controls/all_users").then((res) => {
      setAllUsers(res.data.all_users);
    });
  }, [reRender]);

  return (
    <div className="p-3 mt-3">
      <h2>Manage Users</h2>

      <div
        className="row mt-5 pt-3"
        style={{ textAlign: "left", padding: "20px", fontSize: "18px" }}
      >
        
        <div className="col">Email</div>

        <div className="col">Name</div>

        <div className="col">Vehicles Listed</div>

        <div className="col">Block/Unblock</div>

        <div className="col">View Details</div>

        
      </div>

      <div className="divider border mt-3"></div>
      {/* map users here tomorrow */}
      {allUsers &&
        allUsers.map((user) => (
          <div
            key={user.id}
            className="row mt-3 text-left"
            style={{ textAlign: "left", padding: "20px" }}
          >
            <div className="col text-left">{user.email}</div>
            <div className="col">
              {user.first_name} {user.last_name}
            </div>
            <div className="col"></div>

            {user.is_blocked ? (
              <div className="col">
                <Button
                  variant="success"
                  onClick={() => handleUserBlock(user.id, "False")}
                >
                  Unblock
                </Button>
              </div>
            ) : (
              <div className="col">
                <Popconfirm
                  placement="bottom"
                  title='Are you sure to block this user?'
                  description={blockUserWarning}
                  onConfirm={()=>confirm(user.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    variant="danger"
                  >
                    Block
                  </Button>
                </Popconfirm>
              </div>
            )}

            <div className="col">
              {" "}
              <Button variant="dark">View More</Button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Users;
