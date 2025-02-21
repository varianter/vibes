"use server";

import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import {
  MockCompetences,
  MockConsultants,
  MockDepartments,
  MockEngagements,
  MockOrganisations,
} from "../../mockdata/mockData";
import {
  ConsultantReadModel,
  ConsultantWithForecast,
  EmployeeItemChewbacca,
} from "@/api-types";

type HttpMethod = "GET" | "PUT" | "POST" | "DELETE";

export async function callApiNoParse<Body>(
  path: string,
  method: HttpMethod,
  bodyInit?: Body,
): Promise<Response | undefined> {
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

  const response = await fetch(completeUrl, options);
  return response;
}

export async function callApi<T, Body>(
  path: string,
  method: HttpMethod,
  bodyInit?: Body,
): Promise<T | undefined> {
  if (process.env.NEXT_PUBLIC_NO_AUTH) {
    return mockedCall<T>(path);
  }
  const response = await callApiNoParse(path, method, bodyInit);
  if (!response || response.status == 204 || !response.ok) {
    const responseText = await response?.text();
    console.error(`Failed from ${path}. Response text: ${responseText}`);
    return;
  }
  const contentType = response.headers.get("Content-Type");
  let result: T;

  if (contentType && contentType.includes("application/json")) {
    result = await response.json();
  } else {
    result = (await response.text()) as unknown as T;
  }

  return result as T;
}

export async function fetchWithToken<ReturnType>(
  path: string,
): Promise<ReturnType | undefined> {
  return callApi<ReturnType, undefined>(path, "GET");
}

export async function fetchForecastWithToken(
  path: string,
): Promise<ConsultantWithForecast[] | undefined> {
  return callForecastEmployee(path);
}

export async function fetchEmployeesWithImageAndToken(
  path: string,
): Promise<ConsultantReadModel[] | undefined> {
  return await callEmployee(path);
}

/**
 * Fetches data from the specified URL with a timeout.
 *
 * @param url - The URL to fetch data from.
 * @param timeoutInMilliseconds - The timeout duration in milliseconds (default: 10000).
 * @returns A promise that resolves to the fetched data or null if an error occurs or the timeout is reached.
 */
async function fetchWithTimeoutOrNull<T>(
  url: string,
  timeoutInMilliseconds: number = 10000,
): Promise<T | null> {
  try {
    const response = await Promise.race([
      fetch(url),
      new Promise((_, reject) =>
        setTimeout(() => {
          reject(
            new Error(
              `Timeout - response from "${url}" took longer than specified timeout: ${timeoutInMilliseconds}ms.`,
            ),
          );
        }, timeoutInMilliseconds),
      ),
    ]);

    return await (response as Response).json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function callForecastEmployee(path: string) {
  if (process.env.NEXT_PUBLIC_NO_AUTH) {
    return mockedCall<undefined>(path);
  }

  const session = await getCustomServerSession(authOptions);

  if (!session || !session.access_token) return;

  const apiBackendUrl = process.env.BACKEND_URL ?? "http://localhost:7172/v0";

  const headers = new Headers();
  const bearer = `Bearer ${session.access_token}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  const completeUrl = `${apiBackendUrl}/${path}`;

  try {
    const [response, employeeResponse] = await Promise.all([
      fetch(completeUrl, options),
      fetchWithTimeoutOrNull<{ employees: EmployeeItemChewbacca[] }>(
        `https://chewie-webapp-ld2ijhpvmb34c.azurewebsites.net/employees`,
      ),
    ]);

    const consultantsRes: ConsultantWithForecast[] = await response.json();
    const employees = employeeResponse?.employees || [];

    const consultants = consultantsRes?.map((consultant) => {
      const imageCons = employees.find(
        (imageConsultant) =>
          imageConsultant.email === consultant.consultant.email,
      );
      return {
        ...consultant,
        consultant: {
          ...consultant.consultant,
          imageThumbUrl: imageCons?.imageThumbUrl,
        },
      };
    });

    return consultants;
  } catch (e) {
    console.error(e);
    throw new Error(`${options.method} ${completeUrl} failed`);
  }
}

export async function callEmployee(path: string) {
  if (process.env.NEXT_PUBLIC_NO_AUTH) {
    return mockedCall<undefined>(path);
  }

  const session = await getCustomServerSession(authOptions);

  if (!session || !session.access_token) return;

  const apiBackendUrl = process.env.BACKEND_URL ?? "http://localhost:7172/v0";

  const headers = new Headers();
  const bearer = `Bearer ${session.access_token}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  const completeUrl = `${apiBackendUrl}/${path}`;

  try {
    const [response, employeeResponse] = await Promise.all([
      fetch(completeUrl, options),
      fetchWithTimeoutOrNull<{ employees: EmployeeItemChewbacca[] }>(
        `https://chewie-webapp-ld2ijhpvmb34c.azurewebsites.net/employees`,
      ),
    ]);

    const consultantsRes: ConsultantReadModel[] = await response.json();
    const employees = employeeResponse?.employees || [];

    const consultants = consultantsRes?.map((consultant) => {
      const imageCons = employees.find(
        (imageConsultant) => imageConsultant.email === consultant.email,
      );
      return {
        ...consultant,
        imageThumbUrl: imageCons?.imageThumbUrl,
      };
    });

    return consultants;
  } catch (e) {
    console.error(e);
    throw new Error(`${options.method} ${completeUrl} failed`);
  }
}

export async function putWithTokenNoParse<BodyType>(
  path: string,
  body?: BodyType,
): Promise<Response | undefined> {
  return callApiNoParse<BodyType>(path, "PUT", body);
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
    if (path.includes("competences")) {
      resolve(MockCompetences as T);
    }
  });
}
