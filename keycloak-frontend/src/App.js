import React, { useEffect, useRef } from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { AppRouter } from "./routes";

// Wrap everything inside KeycloakProvider
const App = () => {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <AppRouter />
    </ReactKeycloakProvider>
  );
};

export default App;
