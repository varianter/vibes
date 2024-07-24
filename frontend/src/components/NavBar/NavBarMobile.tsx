"use client";

import { OrganisationReadModel } from "@/api-types";
import { useState } from "react";
import NavBarLink from "./NavBarLink";
import NavBarOrganisationDropdown from "./NavBarOrganisationDropdown";
import NavBarDropdown from "./NavBarDropdown";
import { Menu, X } from "react-feather";

export default function NavBarMobile({
  orgs,
  initial,
  navBarLinks,
}: {
  orgs: OrganisationReadModel[];
  initial: string;
  navBarLinks: { text: string; path: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col w-full min-h-[55px] py-4">
      <div className="flex justify-end">
        <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-2 items-center">
          {navBarLinks.map((link, index) => (
            <NavBarLink key={index} text={link.text} path={link.path} />
          ))}
          <NavBarOrganisationDropdown organisations={orgs} />
          <NavBarDropdown initial={initial} />
        </div>
      )}
    </div>
  );
}
