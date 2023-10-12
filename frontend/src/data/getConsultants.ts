import { fetchWithToken } from "@/api/fetchWithToken";
import { Variant } from "@/types";

export async function getConsultants() {
  return (await fetchWithToken("variants")) as Variant[];
}
