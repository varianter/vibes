import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import NavBarDropdown from "./NavBarDropdown";

export default async function NavBarUserIcon() {
  const session =
    !process.env.NEXT_PUBLIC_NO_AUTH &&
    (await getCustomServerSession(authOptions));

  const initials =
    session && session.user && session.user.name
      ? session.user.name
          .split(" ")
          .map((name) => name.charAt(0).toUpperCase())
          .join("")
      : "";

  if (session) {
    return <NavBarDropdown initials={initials} />;
  }
}
