import { fetchWithToken } from "@/api/fetchWithToken";
import { Department } from "@/types";

export default async function getDepartment() {
  return (await fetchWithToken("departments")) as Department[];
}
