import { useKeycloak } from "@react-keycloak/web";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { scopesList } from "../utilities/constants";
import { KEYCLOAK_BACKEND_CLIENT } from "../envConstants";

const Role = () => {
  const { keycloak, initialized } = useKeycloak();
  const [rpt] = useOutletContext();

  const [status, setStatus] = useState(false);

  const [usersList, setUsersList] = useState(null);

  const onClickScope = async (scope) => {
    let url;
    switch (scope) {
      case "create":
        url = "http://localhost:4000/createOrder";
        break;
      case "update":
        url = "http://localhost:4000/updateOrder";
        break;
      case "read":
        url = "http://localhost:4000/viewOrder";
        break;
      case "delete":
        url = "http://localhost:4000/deleteOrder";
        break;
      default:
        url = "No value found";
    }

    await fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "order");
        alert(data);
      })
      .catch((error) => {
        console.log(error);
        alert("You dont have enough permissions");
      });
  };
  return (
    <div>
      <h1>Roles</h1>
      {rpt?.resource_access?.[KEYCLOAK_BACKEND_CLIENT]?.roles
        .sort()
        .map((item, index) => (
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
            key={index}
          >
            <h5>{item !== "uma_protection" && item}</h5>
          </div>
        ))}
    </div>
  );
};

export default Role;
