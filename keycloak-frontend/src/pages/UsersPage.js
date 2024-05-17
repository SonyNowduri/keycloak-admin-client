import { useKeycloak } from "@react-keycloak/web";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { scopesList } from "../utilities/constants";
import { KEYCLOAK_BACKEND_CLIENT } from "../envConstants";
import AuthrizedElement from "../components/AuthrizedElement";

const UsersPage = () => {
  const { keycloak, initialized } = useKeycloak();
  const [rpt] = useOutletContext();

  const [status, setStatus] = useState(false);

  const [usersList, setUsersList] = useState(null);
  const [getRoleMappings, setRoleMappings] = useState(null);

  const userRoleMapping = async (name) => {
    console.log(name);

    await fetch(`http://localhost:4000/getRoleMappings/${keycloak?.subject}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRoleMappings(data?.clientMappings?.[KEYCLOAK_BACKEND_CLIENT]);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <h1>User Access</h1>
      <AuthrizedElement roles={["ROLE_ORDER_MANAGER"]}>
        <h3 style={{ margin: "10px 0px" }}>You have Order Access</h3>
      </AuthrizedElement>

      <AuthrizedElement roles={["ROLE_PRE_PRODUCTION_MANAGER"]}>
        <h3 style={{ margin: "10px 0px" }}>You have Pre Production Access</h3>
      </AuthrizedElement>
      <AuthrizedElement roles={["ROLE_QUALITY_ANALYST"]}>
        <h3 style={{ margin: "10px 0px" }}>You have Quality Control Access</h3>
      </AuthrizedElement>
      <button
        onClick={() => userRoleMapping()}
        style={{
          height: "50px",
          width: "150px",
          borderRadius: "10px",
          marginTop: "40px",
          cursor: "pointer",
          border: "2px solid black",
        }}
      >
        Get Role Mappings
      </button>
      <pre>
        {getRoleMappings !== null
          ? JSON.stringify(getRoleMappings, undefined, 2)
          : ""}
      </pre>
    </div>
  );
};

export default UsersPage;
