import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { useOutletContext } from "react-router-dom";

const UserInfo = (props) => {
  const { keycloak, initialized } = useKeycloak();
  const [rpt] = useOutletContext();

  return (
    <div>
      {initialized ? (
        keycloak.authenticated && (
          <div>
            <h3>ID : {keycloak.subject}</h3>
            <h3> Name: {keycloak.tokenParsed.name}</h3>
            <h3> Email: {keycloak.tokenParsed.email}</h3>

            <pre>{JSON.stringify(rpt || keycloak, undefined, 2)}</pre>
          </div>
        )
      ) : (
        <h2>keycloak initializing ....!!!!</h2>
      )}
    </div>
  );
};

export default UserInfo;
