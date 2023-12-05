"use server";

import { cookies } from "next/headers";

export async function setOrganisationInCookie(urlKey: string) {
  const cookieStore = cookies();
  cookieStore.set("chosenOrg", urlKey);
}
