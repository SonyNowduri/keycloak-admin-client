import { useKeycloak } from "@react-keycloak/web";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { scopesList } from "../utilities/constants";
import { KEYCLOAK_BACKEND_CLIENT } from "../envConstants";

const Resource = () => {
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
      <h1>Resources</h1>
      {rpt?.authorization?.permissions.map((item, index) => (
        <div style={{ display: "flex", alignItems: "center" }} key={index}>
          <p>{item?.rsname !== "Default Resource" && item?.rsname}</p>

          {item?.rsname !== "Default Resource" &&
            scopesList.map((each, index) => (
              <button
                style={{
                  height: "50px",
                  width: "100px",
                  borderRadius: "10px",
                  marginTop: "20px",
                  cursor: "pointer",
                  border: "2px solid black",
                  margin: "20px",
                }}
                key={index}
                onClick={(e) => onClickScope(each)}
              >
                {each.toUpperCase()}
              </button>
            ))}
        </div>
      ))}
      <hr />
      {initialized ? (
        <table
          style={{
            width: "100%",
            border: "2px solid black",
            textAlign: "center",
          }}
        >
          <thead>
            <tr>
              <th style={{ maxWidth: "50px" }}>User Id</th>
              <th style={{ maxWidth: "50px" }}>Client Roles</th>
              <th style={{ maxWidth: "50px" }}>Resource</th>
              <th style={{ maxWidth: "50px" }}>Scopes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ maxWidth: "50px" }}>{rpt?.sub}</td>
              <td style={{ maxWidth: "50px" }}>
                {rpt?.resource_access?.[KEYCLOAK_BACKEND_CLIENT]?.roles
                  .sort()
                  .map((scope, idx) => (
                    <div key={idx}>{scope}</div>
                  ))}
              </td>

              <td style={{ maxWidth: "50px" }}>
                {rpt?.authorization?.permissions.sort().map((scope, idx) => (
                  <div key={idx}>
                    {scope?.rsname !== "Default Resource" ? scope?.rsname : ""}
                  </div>
                ))}
              </td>
              <td style={{ maxWidth: "50px" }}>
                {rpt?.authorization?.permissions.sort().map((item, index) => (
                  <div key={index}>{item?.scopes?.join(", ")}</div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        ""
      )}
    </div>
  );
};

export default Resource;
