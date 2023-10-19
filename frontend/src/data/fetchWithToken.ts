import { MockConsultants } from "../../mockdata/mockConsultants";
import { MockDepartments } from "../../mockdata/mockDepartments";
import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";

export async function fetchWithToken<T>(path: string): Promise<T | undefined> {
  if (process.env.NEXT_PUBLIC_NO_AUTH) {
    return mockedCall<T>(path);
  }

  const session = await getCustomServerSession(authOptions);

  if (!session || !session.access_token) return;

  const apiBackendUrl = process.env.BACKEND_URL ?? "http://localhost:7172/v0";

  // @ts-ignore
  const headers = new Headers();
  const bearer = `Bearer ${session.access_token}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };
  try{
    const response = await fetch(`${apiBackendUrl}/${path}`, options);
    return (await response.json()) as T;
  } catch (e) {
    console.log(`${apiBackendUrl}/${path}`)
    console.error(e)
  }
}

function mockedCall<T>(path: string): Promise<T> {
  return new Promise((resolve) => {
    if (path.includes("consultants")) {
      resolve(MockConsultants as T);
    }
    if (path.includes("departments")) {
      resolve(MockDepartments as T);
    }
  });
}
