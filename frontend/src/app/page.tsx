import OrganisationButton from "@/components/OrganisationButton";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { OrganisationReadModel } from "@/api-types";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Root() {
  const orgs =
    (await fetchWithToken<OrganisationReadModel[]>("organisations")) ?? [];

  const cookieStore = cookies();
  const chosenOrg = cookieStore.get("chosenOrg")?.value;

  if (orgs.find((o) => o.urlKey == chosenOrg)) {
    redirect(`/${chosenOrg}/bemanning`);
  }

  return (
    <ul className="main h-screen flex items-center justify-center gap-4">
      {orgs.map((o) => (
        <li key={o.urlKey}>
          <Link href={`/${o.urlKey}/bemanning`}>
            <OrganisationButton org={o} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
