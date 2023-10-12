import { msalInstance } from "@/auth/msalInstance";
import { loginRequest } from "@/authConfig";
import { MockConsultants } from "../../mockdata/mockConsultants";
import { MockDepartments } from "../../mockdata/mockDepartments";

export async function fetchWithToken(path: string) {
  if (process.env.NEXT_PUBLIC_NO_AUTH) {
    return mockedCall(path);
  }

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
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

function mockedCall(path: string) {
  if (path.includes("/variants")) {
    return MockConsultants;
  }
  if (path.includes("/departments")) {
    return MockDepartments;
  }
}