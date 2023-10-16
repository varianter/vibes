import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import Dropdown from "./NavBarDropdown";

export default async function NavBarUserIcon() {
  const session = await getCustomServerSession(authOptions);
  const initials =
    session.user?.name
      ?.split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("") || "";

  if (session) {
    return <Dropdown initials={initials} />;
  }
}
