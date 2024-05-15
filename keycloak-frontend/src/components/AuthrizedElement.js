import { useKeycloak } from "@react-keycloak/web";
import AuthorizedFunction from "../utilities/AuthorizedFunction";

// export type currentUserRole = any[] | undefined;

export default function AuthrizedElement({ roles, children }) {
  const { keycloak } = useKeycloak();
  return AuthorizedFunction(roles) && children;
}
