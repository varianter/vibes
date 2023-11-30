import OrganisationSelector from "@/components/OrganisationSelector";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { Organisation } from "@/types";

export default async function Root() {
  const orgs = (await fetchWithToken<Organisation[]>("organisations")) ?? [];

  return (
    <ul className="main h-screen flex items-center justify-center gap-4">
      <OrganisationSelector orgs={orgs} />
    </ul>
  );
}
