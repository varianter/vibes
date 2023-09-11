import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/authConfig";
//@ts-ignore
export const msalInstance = new PublicClientApplication(msalConfig);
