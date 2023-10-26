import PrimaryButton from "@/components/PrimaryButton";
import { fetchWithToken } from "@/data/fetchWithToken";
import { Organisation } from "@/types";
import Link from "next/link";

export default async function Root() {
  const orgs = (await fetchWithToken<Organisation[]>("organisations")) ?? [];
  return (
    <ul className="h-screen flex items-center justify-center gap-4">
      {orgs.map((o) => (
        <li key={o.urlKey}>
          <Link href={`/${o.urlKey}/bemanning`}>
            <PrimaryButton label={o.name} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
