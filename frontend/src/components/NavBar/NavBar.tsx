import NavBarLink from "./NavBarLink";
import NavBarUserIcon from "./NavBarUserIcon";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { Organisation } from "@/types";
import NavBarOrganisationDropdown from "./NavBarOrganisationDropdown";

export default async function NavBar() {
  const orgs = (await fetchWithToken<Organisation[]>("organisations")) ?? [];

  return (
    <div className="bg-primary w-full flex flex-row justify-between header px-4">
      <div className="flex flex-row gap-8">
        <NavBarLink text="Bemanning" path={`bemanning`} />
      </div>
      <div className="flex flex-row gap-4 items-center">
        <NavBarOrganisationDropdown organisations={orgs} />
        <div className="w-[1px] h-8 bg-white/20" />
        <NavBarUserIcon />
      </div>
    </div>
  );
}
