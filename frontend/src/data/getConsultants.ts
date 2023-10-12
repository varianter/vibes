import { fetchWithToken } from "@/data/fetchWithToken";
import { Variant } from "@/types";

export async function getConsultants() {
  return (await fetchWithToken("variants")) as Variant[];
}
