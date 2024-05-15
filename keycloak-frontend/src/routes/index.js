import { useKeycloak } from "@react-keycloak/web";

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Menu from "../pages/Menu";
import HomePage from "../pages/Homepage";
import { PrivateRoute } from "../utilities/PrivateRoute";
import ProtectedPage from "../pages/ProtectedPage";
import { clientRoles, realmRoles } from "../utilities/constants";

export const AppRouter = () => {
  const { keycloak, initialized } = useKeycloak();
  if (!initialized) {
    return <h3>Loading ... !!!</h3>;
  }
  return (
    <div style={{ margin: "20px" }}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route
            path="/protected/*"
            element={
              <PrivateRoute roles={["ClientAdmin"]} component={ProtectedPage} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
