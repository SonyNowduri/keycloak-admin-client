import KcAdminClient from "@keycloak/keycloak-admin-client";
import {
  KEYCLOAK_ADMIN_PASSWORD,
  KEYCLOAK_ADMIN_USER,
  KEYCLOAK_BACKEND_CLIENT,
  KEYCLOAK_BACKEND_SECRET_KEY,
  KEYCLOAK_BASE_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_RPT_GRANT_TYPE,
  KEYCLOAK_TOKEN_ENDPOINT,
} from "../envConstants.js";

const kcAdminClient = new KcAdminClient({
  realmName: KEYCLOAK_REALM,
  baseUrl: KEYCLOAK_BASE_URL,
});

const AdminClientInit = async function (req, res) {
  await kcAdminClient.auth({
    username: KEYCLOAK_ADMIN_USER,
    password: KEYCLOAK_ADMIN_PASSWORD,
    grantType: "password",
    clientId: KEYCLOAK_BACKEND_CLIENT,
    clientSecret: KEYCLOAK_BACKEND_SECRET_KEY,
  });
};

AdminClientInit();

// List all users
const getAllUsersFromClient = async function (req, res) {
  const users = await kcAdminClient.users.find();
  return res.status(200).json(users);
  res.json({
    message: "List of all users",
    usersList: users,
    // response: kcAdminClient,
  });
};

// List all users
const getUserInfo = async function (req, res) {
  const users = await kcAdminClient.users.findOne({
    id: req.body.id,
  });
  res.json({
    message: "User Info",
    UserInfo: users,
  });
};

// To get the profile
const getProfile = async function (req, res) {
  const profileInfo = await kcAdminClient.users.getProfile();
  res.json({
    message: "Profile Info",
    profileInfo: profileInfo,
  });
};

// to get the list of all groups
const getAllGroups = async function (req, res) {
  const groups = await kcAdminClient.groups.find();
  res.json({
    message: "List of all groups",
    groupsList: groups,
  });
};

// To create a user
const createUser = async function (req, res) {
  const response = await kcAdminClient.users.create({
    realm: KEYCLOAK_BACKEND_CLIENT,
    username: "sandhya",
    email: "sandhya@example.com",
  });
  res.json({
    message: "User Created Successfully",
    status: response,
  });
};

// to get the realm roles
const getRealmRoleMappings = async function (req, res) {
  const userRealmRoleMappings = await kcAdminClient.users.listRealmRoleMappings(
    {
      id: req.body.id,
    }
  );
  return res.status(200).json(userRealmRoleMappings);
  res.json({
    message: "User Realm Role Mappings",
    userRealmRoleMappings: userRealmRoleMappings,
  });
};

// to get the realm composite roles
const getRealmComposite = async function (req, res) {
  const userRealmRoleMappings =
    await kcAdminClient.users.listCompositeRealmRoleMappings({
      id: req.body.id,
    });
  res.json({
    message: "User Realm Role Mappings",
    userRealmRoleMappings: userRealmRoleMappings,
  });
};

// to get the role mappings
const getRoleMappings = async function (req, res) {
  const userRoleMappings = await kcAdminClient.users.listRoleMappings({
    id: req.params.id,
  });
  return res.status(200).json(userRoleMappings);
  res.json({
    message: "User Role Mappings",
    userRoleMappings: userRoleMappings,
  });
};

const authorization = async function (req, res) {
  const profileInfo = await kcAdminClient.users.Authorisation();
  res.json({
    message: "Profile Info",
    profileInfo: profileInfo,
  });
};

const getClientRegistrationPolicyProviders = async function (req, res) {
  const scopeMapping =
    await kcAdminClient.realms.getClientRegistrationPolicyProviders({
      realm: req.body.realm,
    });
  res.json({
    message: "POlicy",
    scopeMapping: scopeMapping,
  });
};

const getUserManagementPermission = async function (req, res) {
  const permissions = await kcAdminClient.realms.getUsersManagementPermissions({
    realm: req.body.realm,
  });
  res.json({
    message: "User Management Permissions",
    groupsList: permissions, // false
  });
};

//rolesid
const getCompositeRoles = async function (req, res) {
  const compositeRoles = await kcAdminClient.roles.findOneById({
    id: req.body.id,
  });
  res.json({
    message: "CompositeRoles",
    compositeRoles: compositeRoles,
  });
};

// Get client Information
const getClientInfo = async function (req, res) {
  const clientsInfo = await kcAdminClient.clients.findOne({
    id: req.body.id,
  });
  const policies = await kcAdminClient.clients.getResource({
    id: req.body.id,
  });
  res.json({
    message: "Client Info",
    UserInfo: policies,
  });
};

//getResource, getResourceServer, listPolicyProviders
const getResourceServer = async function (req, res) {
  const resourceServer = await kcAdminClient.clients.getResource({
    id: req.body.id,
  });
  res.json({
    message: "Resource Server",
    resourceServer: resourceServer,
  });
};

const updateFineGrainPermission = async function (req, res) {
  const fineGrainInfo = await kcAdminClient.clients.listScopesByResource({
    id: req.body.id,
    resourceName: req.body.resourceId,
  });
  res.json({
    info: fineGrainInfo,
  });
};

// client id
const listScopeMappings = async function (req, res) {
  const scopeMapping = await kcAdminClient.clients.listPolicies({
    id: req.body.id,
    // client: req.body.client,
  });
  res.json({
    message: "List Scope Mappings",
    scopeMapping: scopeMapping,
  });
};

const getUserCompleteDetails = async function (req, res) {
  const { userId } = req.body;
  const roleMappings = await kcAdminClient.users.listRealmRoleMappings({
    id: userId,
  });
  res.json({
    response: roleMappings,
  });
};

// List all users
const logoutSession = async function (req, res) {
  const users = await kcAdminClient.users.logout({
    id: req.body.id,
  });
  res.send(users);
  res.json({
    message: "User Info",
    UserInfo: users,
  });
};

const getRPToken = async function (req, res) {
  const userTokenResponse = await fetch(
    KEYCLOAK_TOKEN_ENDPOINT,

    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        authorization: `Bearer ${req.params.id}`,
      },
      body: new URLSearchParams({
        grant_type: KEYCLOAK_RPT_GRANT_TYPE,
        audience: KEYCLOAK_BACKEND_CLIENT,
      }),
    }
  );

  const data = await userTokenResponse.json();
  return res.status(200).json(data.access_token);
};

export {
  AdminClientInit,
  getAllUsersFromClient,
  getAllGroups,
  createUser,
  getUserManagementPermission,
  getProfile,
  getRealmRoleMappings,
  getRoleMappings,
  getCompositeRoles,
  getResourceServer,
  getUserInfo,
  listScopeMappings,
  getClientRegistrationPolicyProviders,
  authorization,
  getUserCompleteDetails,
  getRealmComposite,
  logoutSession,
  updateFineGrainPermission,
  getRPToken,
  getClientInfo,
};
