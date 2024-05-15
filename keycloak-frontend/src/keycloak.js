import Keycloak from "keycloak-js";
import {
  KEYCLOAK_AUTH_SERVER_URL,
  KEYCLOAK_FRONTEND_CLIENT,
  KEYCLOAK_REALM,
} from "./envConstants";

const keycloakConfig = {
  url: KEYCLOAK_AUTH_SERVER_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_FRONTEND_CLIENT,
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
