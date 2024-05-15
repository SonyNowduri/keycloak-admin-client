import { withKeycloak } from "@react-keycloak/web";
import React, { useEffect } from "react";
import AuthorizedFunction from "../utilities/AuthorizedFunction";

const Menu = ({ keycloak, keycloakInitialized }) => {
  useEffect(() => {
    keycloak && !keycloak.authenticated && keycloak.login();
  }, []);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>
          {" "}
          Welcome
          {keycloak && keycloak.authenticated
            ? ` ${keycloak.tokenParsed.preferred_username.toUpperCase()} `
            : ""}
        </h2>{" "}
        <div>
          {keycloak && !keycloak.authenticated && (
            <button className="btn-link" onClick={() => keycloak.login()}>
              Login
            </button>
          )}
          {keycloak && keycloak.authenticated && (
            <button className="btn-link" onClick={() => keycloak.logout()}>
              Logout ({keycloak.tokenParsed.preferred_username})
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default withKeycloak(Menu);
