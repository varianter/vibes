import ActionButton from "@/components/Buttons/ActionButton";
import SecondaryButton from "@/components/SecondaryButton";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { Organisation } from "@/types";
import Link from "next/link";

export default async function Root() {
  const orgs = (await fetchWithToken<Organisation[]>("organisations")) ?? [];
  return (
    <ul className="main h-screen flex items-center justify-center gap-4">
      {orgs.map((o) => (
        <li key={o.urlKey}>
          <Link href={`/${o.urlKey}/bemanning`}>
            <ActionButton variant="secondary">{o.name}</ActionButton>
          </Link>
        </li>
      ))}
    </ul>
  );
}
