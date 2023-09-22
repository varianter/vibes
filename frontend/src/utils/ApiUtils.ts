import { msalInstance } from "@/app/msalInstance";
import { loginRequest } from "@/authConfig";

export async function fetchWithToken(path: string) {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw Error(
      "No active account! Verify a user has been signed in and setActiveAccount has been called.",
    );
  }

  if (!process.env.NEXT_PUBLIC_APP_SCOPE) {
    throw new Error(
      "Environment variable: NEXT_PUBLIC_APP_SCOPE is missing or empty",
    );
  }

  const response = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account: account,
    scopes: [process.env.NEXT_PUBLIC_APP_SCOPE ?? ""],
  });

  // @ts-ignore
  const headers = new Headers();
  const bearer = `Bearer ${response.accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  try {
    const response = await fetch(path, options);
    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error);
  }
}
