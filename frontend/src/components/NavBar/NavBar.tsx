import Image from "next/image";
import NavBarLink from "./NavBarLink";
import NavBarUserIcon from "./NavBarUserIcon";

export default function NavBar() {
  return (
    <div className="bg-primary_default w-full flex flex-row justify-between header">
      <div className="flex flex-row">
        <NavBarLink text="Bemanning" path={`bemanning`} />
      </div>
      <div className="flex flex-row gap-6 items-center">
        <Image
          className="variant-logo"
          alt="Variant logo"
          src="/images/variant-logo.svg"
          width="65"
          height="16"
        />
        <NavBarUserIcon />
      </div>
    </div>
  );
}
