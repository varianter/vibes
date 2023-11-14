import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import NavBarDropdown from "./NavBarDropdown";

export default async function NavBarUserIcon() {
  const session =
    !process.env.NEXT_PUBLIC_NO_AUTH &&
    (await getCustomServerSession(authOptions));

  const initial =
    session && session.user && session.user.name ? session.user.name[0] : "N";

  return <NavBarDropdown initial={initial} />;
}
