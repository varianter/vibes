// Config object to be passed to Msal on creation
const msalClientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const msalTenantId = process.env.NEXT_PUBLIC_TENANT_ID;
export const msalConfig = {
  auth: {
    clientId: msalClientId,
    authority: `https://login.microsoftonline.com/${msalTenantId}`,
    redirectUri: "/",
    postLogoutRedirectUri: "/",
  },
  system: {
    allowNativeBroker: false, // Disables WAM Broker
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"],
};
