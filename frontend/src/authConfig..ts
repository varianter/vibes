// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId: "",
    authority: "https://login.microsoftonline.com/<tenant-id>",
    redirectUri: "/",
    postLogoutRedirectUri: "/"
  },
  system: {
    allowNativeBroker: false, // Disables WAM Broker
  }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"]
};
