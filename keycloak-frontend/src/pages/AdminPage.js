import { useKeycloak } from "@react-keycloak/web";
import React, { useState } from "react";

const AdminPage = () => {
  const { keycloak, initialized } = useKeycloak();
  const [status, setStatus] = useState(false);

  const [usersList, setUsersList] = useState(null);

  const getUsersList = async () => {
    setStatus(!status);
    await fetch("http://localhost:4000/users", {
      method: "GET",
      headers: {
        authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsersList(data);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <h1>You have Admin access</h1>
      <button
        style={{
          height: "50px",
          width: "100px",
          borderRadius: "10px",
          marginTop: "20px",
          cursor: "pointer",
          border: "2px solid black",
        }}
        onClick={() => getUsersList()}
      >
        Get Users
      </button>
      <pre>{status ? JSON.stringify(usersList, undefined, 2) : ""}</pre>
    </div>
  );
};

export default AdminPage;
