import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import {
  MockConsultants,
  MockDepartments,
  MockEngagements,
  MockOrganisations,
} from "../../mockdata/mockData";

type HttpMethod = "GET" | "PUT" | "POST" | "DELETE";

export async function callApi<T, Body>(
  path: string,
  method: HttpMethod,
  bodyInit?: Body,
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

  let options;

  if (bodyInit) {
    headers.append("Content-Type", "application/json");
    options = {
      method: method,
      headers: headers,
      body: JSON.stringify(bodyInit),
    };
  } else {
    options = {
      method: method,
      headers: headers,
    };
  }

  const completeUrl = `${apiBackendUrl}/${path}`;

  try {
    const response = await fetch(completeUrl, options);
    if (response.status == 204) {
      return;
    }
    const json = await response.json();
    return json as T;
  } catch (e) {
    console.error(e);
    throw new Error(`${options.method} ${completeUrl} failed`);
  }
}

export async function fetchWithToken<ReturnType>(
  path: string,
): Promise<ReturnType | undefined> {
  return callApi<ReturnType, undefined>(path, "GET");
}

export async function putWithToken<ReturnType, BodyType>(
  path: string,
  body?: BodyType,
): Promise<ReturnType | undefined> {
  return callApi<ReturnType, BodyType>(path, "PUT", body);
}

export async function postWithToken<ReturnType, BodyType>(
  path: string,
  body?: BodyType,
): Promise<ReturnType | undefined> {
  return callApi<ReturnType, BodyType>(path, "POST", body);
}

export async function deleteWithToken<ReturnType, BodyType>(
  path: string,
  body?: BodyType,
): Promise<ReturnType | undefined> {
  return callApi<ReturnType, BodyType>(path, "DELETE", body);
}

function mockedCall<T>(path: string): Promise<T> {
  return new Promise((resolve) => {
    if (path.includes("staffings")) {
      resolve(MockConsultants as T);
    }
    if (path.includes("departments")) {
      resolve(MockDepartments as T);
    }
    if (path.includes("organisations")) {
      resolve(MockOrganisations as T);
    }
    if (path.includes("projects")) {
      resolve(MockEngagements as T);
    }
  });
}
