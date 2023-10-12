import { fetchWithToken } from "@/api/fetchWithToken";

export async function getConsultants(){
  return await fetchWithToken('http://localhost:7172/v0/variants')
}



