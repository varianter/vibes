import { MockConsultants } from "../../mockdata/mockConsultants";
import { MockDepartments } from "../../mockdata/mockDepartments";
import { authOptions, getCustomServerSession } from "@/app/api/auth/[...nextauth]/route";

export async function fetchWithToken(path: string) {
  if (process.env.NEXT_PUBLIC_NO_AUTH) {
    return mockedCall(path);
  }

  const session = await getCustomServerSession(authOptions)

  // @ts-ignore
  const headers = new Headers();
  const bearer = `Bearer ${session.access_token}`;

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