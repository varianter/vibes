import { redirect } from "next/navigation";
import { fetchWithToken } from "@/data/fetchWithToken";
import { Consultant, Organisation } from "@/types";
import Link from "next/link";

export default async function Root() {
  const orgs = await fetchWithToken<Organisation[]>('organisations') ?? []
  return <ul>
    {orgs.map(o =>  <li key={o.urlKey}><Link href={`/${o.urlKey}/bemanning`}>{o.name}</Link></li>)}
  </ul>
  //redirect("/bemanning");
}
