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
import { ConsultantReadModel, EmployeeItemChewbacca } from "@/api-types";

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

export async function fetchEmployeesWithImageAndToken(
  path: string,
): Promise<ConsultantReadModel[] | undefined> {
  return await callEmployee(path);
}

export async function callEmployee(path: string) {
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
    const response = await fetch(completeUrl, options);
    const imageResponse = await fetch(
      `https://chewie-webapp-ld2ijhpvmb34c.azurewebsites.net/employees`,
    );

    const { employees }: { employees: EmployeeItemChewbacca[] } =
      await imageResponse.json();

    const consultantsRes: ConsultantReadModel[] = await response.json();

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
