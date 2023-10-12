import { fetchWithToken } from "@/data/fetchWithToken";
import { Department } from "@/types";

export default async function getDepartment() {
  return (await fetchWithToken("departments")) as Department[];
}
