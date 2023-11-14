import Image from "next/image";
import NavBarLink from "./NavBarLink";
import NavBarUserIcon from "./NavBarUserIcon";

export default function NavBar() {
  return (
    <div className="bg-primary w-full flex flex-row justify-between header px-4">
      <div className="flex flex-row gap-8">
        <NavBarLink text="Bemanning" path={`bemanning`} />
      </div>
      <div className="flex flex-row gap-4 items-center">
        <div className="border-r border-white/20 py-2">
          <Image
            className="variant-logo mr-4"
            alt="Variant logo"
            src="/images/variant-logo.svg"
            width="65"
            height="16"
          />
        </div>
        <NavBarUserIcon />
      </div>
    </div>
  );
}
