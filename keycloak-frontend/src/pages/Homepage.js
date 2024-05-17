import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import AuthrizedElement from "../components/AuthrizedElement";
import { jwtDecode } from "jwt-decode";
import { clientRoles, scopesList } from "../utilities/constants";
import Menu from "./Menu";
import { KEYCLOAK_BACKEND_CLIENT } from "../envConstants";

const HomePage = () => {
  const { keycloak, initialized } = useKeycloak();
  const [status, setStatus] = useState(false);
  const [usersList, setUsersList] = useState(null);
  const [rpt, setRpt] = useState(null);
  const [getRoleMappings, setRoleMappings] = useState(null);
  const [allStatus, setAllStatus] = useState({
    admin: false,
    it: false,
    hr: false,
    user: false,
    accounts: false,
    emp: false,
    order: false,
    preprod: false,
    qc: false,
  });
  const [permission, setPermissions] = useState([]);

  useEffect(() => {
    requestRpt();
    getCompleteData();
  }, []);

  const requestRpt = async () => {
    const token = await fetch(
      `http://localhost:4000/rptoken/${keycloak.token}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${keycloak.token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(jwtDecode(data), "drontend");
        setRpt(jwtDecode(data));
      })
      .catch((error) => console.log(error));
  };

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

  const userRoleMapping = async (name) => {
    console.log(name);
    setAllStatus((previousState) => ({
      ...previousState,
      [name]: true,
    }));
    await fetch(`http://localhost:4000/getRoleMappings/${keycloak?.subject}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRoleMappings(data);
      })
      .catch((error) => console.log(error));
  };

  const getCompleteData = () => {
    const data = {
      userId: rpt?.sub,
      clientRoles:
        rpt?.resource_access?.[KEYCLOAK_BACKEND_CLIENT]?.roles.sort(),
      scopes: rpt?.authorization?.permissions,
    };
    setPermissions([data]);
  };

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
      <h1>Home</h1>
      <Menu />

      <div>
        {rpt?.authorization?.permissions.map((item, index) => (
          <div style={{ display: "flex", alignItems: "center" }} key={index}>
            <p>{item?.rsname !== "Default Resource" && item?.rsname}</p>

            {item?.rsname !== "Default Resource" &&
              scopesList.map((each, index) => (
                <button
                  key={index}
                  style={{ margin: "10px" }}
                  onClick={(e) => onClickScope(each)}
                >
                  {each}
                </button>
              ))}
          </div>
        ))}
      </div>

      <AuthrizedElement roles={["ROLE_ADMIN"]}>
        <h3>You have ADMIN Access</h3>
        <button onClick={() => getUsersList()}>Get Users</button>
        <pre>{status ? JSON.stringify(usersList, undefined, 2) : ""}</pre>
      </AuthrizedElement>

      <AuthrizedElement roles={["ROLE_ORDER_MANAGER"]}>
        <h3>You have Order Access</h3>
        <button onClick={() => userRoleMapping("order")}>
          Get Role Mappings
        </button>
        <pre>
          {allStatus.order ? JSON.stringify(getRoleMappings, undefined, 2) : ""}
        </pre>
      </AuthrizedElement>

      <AuthrizedElement roles={["ROLE_PRE_PRODUCTION_MANAGER"]}>
        <h3>You have Pre Production Access</h3>
        <button onClick={() => userRoleMapping("preprod")}>
          Get Role Mappings
        </button>
        <pre>
          {allStatus.preprod
            ? JSON.stringify(getRoleMappings, undefined, 2)
            : ""}
        </pre>
      </AuthrizedElement>
      <AuthrizedElement roles={["ROLE_QUALITY_ANALYST"]}>
        <h3>You have Quality Control Access</h3>
        <button onClick={() => userRoleMapping("qc")}>Get Role Mappings</button>
        <pre>
          {allStatus.qc ? JSON.stringify(getRoleMappings, undefined, 2) : ""}
        </pre>
      </AuthrizedElement>

      {/* <button onClick={() => getCompleteData()}>Get Data</button> */}
      {initialized && permission.length !== 0 ? (
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

      <hr />
      <h3> User Info</h3>

      {initialized ? (
        keycloak.authenticated && (
          <pre>{JSON.stringify(rpt || keycloak, undefined, 2)}</pre>
        )
      ) : (
        <h2>keycloak initializing ....!!!!</h2>
      )}
    </div>
  );
};
export default HomePage;
