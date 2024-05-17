import React, { useEffect, useState } from "react";
import { KEYCLOAK_BACKEND_CLIENT } from "../envConstants";
import { useKeycloak } from "@react-keycloak/web";
import HomePage from "./Homepage";
import AuthrizedElement from "../components/AuthrizedElement";
import { Link, NavLink, Outlet, Route, Routes } from "react-router-dom";
import AdminPage from "./AdminPage";
import { jwtDecode } from "jwt-decode";
import { routesList } from "../utilities/constants";

const Sidebar = () => {
  const { keycloak, initialized } = useKeycloak();
  const [rpt, setRpt] = useState(null);

  useEffect(() => {
    keycloak && !keycloak.authenticated && keycloak.login();
  }, []);

  useEffect(() => {
    requestRpt();
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
        setRpt(jwtDecode(data));
      })
      .catch((error) => console.log(error));
  };

  console.log(rpt);

  return (
    <div
      style={{
        display: "flex",
        maxWidth: "100vw",
        maxHeight: "100vw",
        minWidth: "100vw",
      }}
    >
      <div
        style={{
          minWidth: "20vw",
          maxWidth: "20vw",
          maxHeight: "100vh",
          minHeight: "10vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: " #f0f5f5",
        }}
      >
        <h1 style={{ marginBottom: "50px" }}>{KEYCLOAK_BACKEND_CLIENT}</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AuthrizedElement roles={["ROLE_ADMIN"]}>
            <Link to="/admin" style={{ margin: "10px 0px" }}>
              Admin
            </Link>
          </AuthrizedElement>
          {routesList?.map((each) => (
            <Link to={each?.pathName} style={{ margin: "10px 0px" }}>
              {each?.name}
            </Link>
          ))}
        </div>
        <div>
          {keycloak && !keycloak.authenticated && (
            <button style={{}} onClick={() => keycloak.login()}>
              Login
            </button>
          )}
          {keycloak && keycloak.authenticated && (
            <button onClick={() => keycloak.logout()}>
              Logout ({keycloak.tokenParsed.preferred_username})
            </button>
          )}
        </div>
      </div>
      <div
        style={{
          margin: "20px",
          minWidth: "77vw",
          maxWidth: "80vw",
          minHeight: "100vh",
          maxHeight: "100vh",
          overflow: "scroll",
        }}
      >
        {/* <h1>{`Welcome, ${keycloak.tokenParsed.preferred_username.toUpperCase()}`}</h1> */}
        <Outlet context={[rpt]} />
      </div>
    </div>
  );
};

export default Sidebar;
