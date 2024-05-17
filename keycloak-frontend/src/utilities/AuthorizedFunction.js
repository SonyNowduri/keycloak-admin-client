import { useKeycloak } from "@react-keycloak/web";
import { KEYCLOAK_BACKEND_CLIENT } from "../envConstants";

export default function AuthorizedFunction(roles) {
  const { keycloak } = useKeycloak();
  console.log(roles, "roles");

  const isAutherized = () => {
    if (keycloak && roles) {
      return roles.some((r) => {
        const realm = keycloak.hasRealmRole(r);
        const resource = keycloak.hasResourceRole(r);
        const resourceAccess =
          keycloak.resourceAccess?.[KEYCLOAK_BACKEND_CLIENT]?.roles.includes(r);

        return realm || resource || resourceAccess;
      });
    }
    return false;
  };

  return isAutherized();
}
