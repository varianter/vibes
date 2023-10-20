import { fetchWithToken } from "@/data/fetchWithToken";
import { Organisation } from "@/types";
import Link from "next/link";

export default async function Root() {
  const orgs = (await fetchWithToken<Organisation[]>("organisations")) ?? [];
  return (
    <ul className="h-screen flex items-center justify-center gap-4">
      {orgs.map((o) => (
        <li key={o.urlKey}>
          <Link
            className="body-bold text-primary_default border-2 rounded-xl p-4 border-primary_l1 hover:bg-primary_default hover:bg-opacity-10 hover:border-primary_default"
            href={`/${o.urlKey}/bemanning`}
          >
            {o.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
