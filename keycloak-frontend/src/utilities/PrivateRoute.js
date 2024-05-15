import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthorizedFunction from "./AuthorizedFunction";

export function PrivateRoute({ component: Component, roles }) {
  const { keycloak } = useKeycloak();

  return (
    <Routes>
      <Route
        children={(props) => {
          return AuthorizedFunction(roles) ? (
            <Component {...props} />
          ) : (
            <Navigate to={{ pathname: "/" }} />
          );
        }}
      />
    </Routes>
  );
}
