import Image from "next/image";
import NavBarLink from "./NavBarLink";
import NavBarUserIcon from "./NavBarUserIcon";
import OrganisationSelector from "../OrganisationSelector";
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
        <NavBarUserIcon />
      </div>
    </div>
  );
}
