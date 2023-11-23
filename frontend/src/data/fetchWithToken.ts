import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import {
  MockConsultants,
  MockDepartments,
  MockOrganisations,
} from "../../mockdata/mockData";

type HttpMethod = "GET" | "PUT" | "POST";

export async function callApi<T>(
  path: string,
  method: HttpMethod,
): Promise<T | undefined> {
  if (process.env.NEXT_PUBLIC_NO_AUTH) {
    return mockedCall<T>(path);
  }

  const session = await getCustomServerSession(authOptions);

  if (!session || !session.access_token) return;

  const apiBackendUrl = process.env.BACKEND_URL ?? "http://localhost:7172/v0";

  const headers = new Headers();
  const bearer = `Bearer ${session.access_token}`;

  headers.append("Authorization", bearer);

  const options = {
    method: method,
    headers: headers,
  };

  const completeUrl = `${apiBackendUrl}/${path}`;

  try {
    const response = await fetch(completeUrl, options);
    const json = await response.json();
    return json as T;
  } catch (e) {
    console.error(e);
    throw new Error(`${options.method} ${completeUrl} failed`);
  }
}

export async function fetchWithToken<T>(path: string): Promise<T | undefined> {
  return callApi<T>(path, "GET");
}

export async function putWithToken<T>(path: string): Promise<T | undefined> {
  return callApi<T>(path, "PUT");
}

export async function postWithToken<T>(path: string): Promise<T | undefined> {
  return callApi<T>(path, "POST");
}

function mockedCall<T>(path: string): Promise<T> {
  return new Promise((resolve) => {
    if (path.includes("consultants")) {
      resolve(MockConsultants as T);
    }
    if (path.includes("departments")) {
      resolve(MockDepartments as T);
    }
    if (path.includes("organisations")) {
      resolve(MockOrganisations as T);
    }
  });
}
