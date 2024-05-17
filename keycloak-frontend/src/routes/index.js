import { useKeycloak } from "@react-keycloak/web";

import React from "react";
import { Route, Routes } from "react-router-dom";

import Menu from "../pages/Menu";
import HomePage from "../pages/Homepage";
import { PrivateRoute } from "../utilities/PrivateRoute";
import ProtectedPage from "../pages/ProtectedPage";
import { clientRoles, realmRoles } from "../utilities/constants";
import Sidebar from "../pages/Sidebar";
import AdminPage from "../pages/AdminPage";
import Role from "../pages/Role";
import UserInfo from "../pages/UserInfo";
import Resource from "../pages/Resource";
import UsersPage from "../pages/UsersPage";

export const AppRouter = () => {
  const { keycloak, initialized } = useKeycloak();
  if (!initialized) {
    return <h3>Loading ... !!!</h3>;
  }
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Sidebar />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/users" element={<UsersPage />} />

          <Route path="/role" element={<Role />} />
          <Route path="/resource" element={<Resource />} />
          <Route path="/profile" element={<UserInfo />} />
        </Route>
      </Routes>
    </div>
  );
};
