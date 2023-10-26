import SecondaryButton from "@/components/SecondaryButton";
import { fetchWithToken } from "@/data/fetchWithToken";
import { Organisation } from "@/types";
import Link from "next/link";

export default async function Root() {
  const orgs = (await fetchWithToken<Organisation[]>("organisations")) ?? [];
  return (
    <ul className="h-[calc(100vh-52px)] overflow-auto flex items-center justify-center gap-4">
      {orgs.map((o) => (
        <li key={o.urlKey}>
          <Link href={`/${o.urlKey}/bemanning`}>
            <SecondaryButton label={o.name} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
