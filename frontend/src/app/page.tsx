import ActionButton from "@/components/Buttons/ActionButton";
import OrganisationButton from "@/components/OrganisationSelector";
import OrganisationSelector from "@/components/OrganisationSelector";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { Organisation } from "@/types";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Root() {
  const orgs = (await fetchWithToken<Organisation[]>("organisations")) ?? [];

  const cookieStore = cookies();
  const chosenOrg = cookieStore.get("chosenOrg")?.value;

  if (orgs.find((o) => o.urlKey == chosenOrg)) {
    redirect(`/${chosenOrg}/bemanning`);
  }

  function setUrlKey(urlKey: string): void {
    cookieStore.set("chosenOrg", urlKey);
  }

  return (
    <ul className="main h-screen flex items-center justify-center gap-4">
      {/*<OrganisationSelector orgs={orgs} />*/}
      {orgs.map((o) => (
        <li key={o.urlKey}>
          <Link href={`/${o.urlKey}/bemanning`}>
            <OrganisationButton setCookie={setUrlKey} org={o} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
