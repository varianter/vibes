import { loginRequest } from "../authConfig.";
import { msalInstance } from "../app/msalInstance";

export async function fetchWithToken(path: string) {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw Error(
      "No active account! Verify a user has been signed in and setActiveAccount has been called.",
    );
  }

  const response = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account: account,
  });

  // @ts-ignore
  const headers = new Headers();
  const bearer = `Bearer ${response.accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return (
    //@ts-ignore
    fetch(path, options)
      //@ts-ignore
      .then((response) => response.json())
      //@ts-ignore
      .catch((error) => console.log(error))
  );
}
