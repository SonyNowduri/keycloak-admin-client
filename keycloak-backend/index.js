// Required packages
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Keycloak from "keycloak-connect";
import session from "express-session";

import {
  AdminClientInit,
  authorization,
  createUser,
  getAllGroups,
  getAllUsersFromClient,
  getClientInfo,
  getClientRegistrationPolicyProviders,
  getCompositeRoles,
  getProfile,
  getRPToken,
  getRealmComposite,
  getRealmRoleMappings,
  getResourceServer,
  getRoleMappings,
  getUserCompleteDetails,
  getUserInfo,
  getUserManagementPermission,
  listScopeMappings,
  logoutSession,
  updateFineGrainPermission,
} from "./controllers/admin.controller.js";
import {
  createOrder,
  deleteOrder,
  orderStatus,
  updateOrder,
  viewOrder,
} from "./controllers/user.controller.js";
import {
  KEYCLOAK_AUTH_SERVER_URL,
  KEYCLOAK_BACKEND_CLIENT,
  KEYCLOAK_BACKEND_SECRET_KEY,
  KEYCLOAK_REALM,
} from "./envConstants.js";
import { validateToken } from "./utils/validateToken.js";

const app = express();

const router = express.Router();
dotenv.config({ path: "./.env.example" });

const __filename = fileURLToPath(import.meta.url);

const publicDir = path.join(path.dirname(__filename), "./public");

app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());
app.use(cors());

app.set("view engine", "hbs");

const port = process.env.PORT;

// Checking the server running at which port
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});

//Error Handler
const errorHandler = (error, req, res, next) => {
  const status = error.status || 422;
  res.status(status).send(error.message);
};

const kcConfig = {
  realm: KEYCLOAK_REALM,
  "auth-server-url": KEYCLOAK_AUTH_SERVER_URL,
  "ssl-required": "external",
  resource: KEYCLOAK_BACKEND_CLIENT,
  "verify-token-audience": true,
  credentials: {
    secret: KEYCLOAK_BACKEND_SECRET_KEY,
  },
  "use-resource-role-mappings": true,
  "confidential-port": 0,
  "policy-enforcer": {
    credentials: {},
  },
};

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

app.use(
  session({
    secret: "thisShouldBeLongAndSecret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.set("trust proxy", true);
app.use(keycloak.middleware());

// Test Route
router.get("/", keycloak.protect(), (req, res) => {
  res
    .json({
      message: "API connection established.",
      status: "success",
    })
    .status(200);
});

// Register routes
app.use("/", router);
app.use("/admin", AdminClientInit);
app.use("/users", keycloak.protect(), validateToken, getAllUsersFromClient);
app.use("/groups", getAllGroups);
app.use("/createUser", createUser);
app.use("/userManagementPermissions", getUserManagementPermission);
app.use("/getProfileInfo", getProfile);
app.use("/getUserRoleMappings", getRealmRoleMappings);
app.use(
  "/getRoleMappings/:id",
  keycloak.protect(),
  validateToken,
  getRoleMappings
);
app.use("/getCompositeRoles", getCompositeRoles);
app.use("/getResourceServer", getResourceServer);
app.use("/getUserInfo", getUserInfo);
app.use("/listScopeMappings", listScopeMappings);
app.use(
  "/getClientRegistrationPolicyProviders",
  getClientRegistrationPolicyProviders
);
app.use("/authorization", authorization);
app.use("/getUserDetails", getUserCompleteDetails);
app.use("/getRealmComposite", getRealmComposite);
app.use("/logout", logoutSession);
app.use("/updateFineGrainPermission", updateFineGrainPermission);
app.use("/rptoken/:id", keycloak.protect(), validateToken, getRPToken);
app.use("/getClientInfo", getClientInfo);

app.use("/orderStatus", keycloak.enforcer(["orders:create"]), orderStatus);

app.use(
  "/createOrder",
  validateToken,
  keycloak.enforcer(["orders:create"]),
  createOrder
);
app.use(
  "/updateOrder",
  validateToken,
  keycloak.enforcer(["orders:update"]),
  updateOrder
);
app.use(
  "/viewOrder",
  validateToken,
  keycloak.enforcer("orders:read", { response_mode: "permissions" }),
  viewOrder
);
app.use(
  "/deleteOrder",
  validateToken,
  keycloak.enforcer(["orders:delete"]),
  deleteOrder
);

app.use(errorHandler);
