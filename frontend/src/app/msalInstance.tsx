import { msalConfig } from "@/authConfig";
import { PublicClientApplication } from "@azure/msal-browser";
//@ts-ignore
export const msalInstance = new PublicClientApplication(msalConfig);
