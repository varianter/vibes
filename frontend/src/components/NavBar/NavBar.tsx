import NavBarLink from "./NavBarLink";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { OrganisationReadModel } from "@/api-types";
import NavBarOrganisationDropdown from "./NavBarOrganisationDropdown";
import NavBarMobile from "./NavBarMobile";
import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import NavBarDropdown from "./NavBarDropdown";

export const navBarLinks: { text: string; path: string }[] = [
  { text: "Bemanning", path: "bemanning" },
  { text: "Kunder", path: "kunder" },
  { text: "Konsulenter", path: "konsulenter" },
  { text: "Rapporter", path: "rapport" },
];

export default async function NavBar() {
  const orgs =
    (await fetchWithToken<OrganisationReadModel[]>("organisations")) ?? [];

  const session =
    !process.env.NEXT_PUBLIC_NO_AUTH &&
    (await getCustomServerSession(authOptions));

  const initial =
    session && session.user && session.user.name ? session.user.name[0] : "N";

  return (
    <div className="bg-primary w-full header px-4">
      <div className="hidden sm:flex flex-row justify-between">
        <div className="flex flex-row gap-8">
          {navBarLinks.map((link, index) => (
            <NavBarLink key={index} text={link.text} path={link.path} />
          ))}
        </div>
        <div className="flex flex-row gap-4 items-center">
          <NavBarOrganisationDropdown organisations={orgs} />
          <div className="w-[1px] h-8 bg-white/20" />
          <NavBarDropdown initial={initial} />
        </div>
      </div>
      <div className="flex sm:hidden">
        <NavBarMobile orgs={orgs} initial={initial} />
      </div>
    </div>
  );
}
