"use client";
import React, { useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Organisation } from "@/types";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Check, ChevronDown, ChevronUp } from "react-feather";

export default function NavBarOrganisationDropdown({
  organisations,
}: {
  organisations: Organisation[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const currentOrganisationUrl = usePathname().split("/")[1];
  const currentOrganisation = organisations.find(
    (o) => o.urlKey == currentOrganisationUrl,
  );

  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <>
      <div className="relative" ref={menuRef}>
        {currentOrganisation && (
          <>
            <button
              className={`p-2 rounded flex gap-2 text-white ${
                organisations.length > 1 && "hover:bg-white/10"
              }`}
              onClick={() => setIsOpen(!isOpen)}
              disabled={organisations.length == 1}
            >
              <p className="normal-medium">{currentOrganisation?.name}</p>
              {organisations.length > 1 &&
                (isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                ))}
            </button>
            <div
              className={`absolute right-0 top-[48px] z-50 rounded-lg text-primary bg-white flex flex-col w-[138px] shadow-xl p-1 ${
                !isOpen && "hidden"
              }`}
            >
              {organisations.map((organisation, index) => (
                <Link
                  key={index}
                  className="hover:bg-primary/10 px-3 py-2 rounded flex flex-row justify-between items-center "
                  href={`/${organisation.urlKey}/bemanning`}
                  onClick={() =>
                    localStorage.setItem("chosenUrlKey", organisation.urlKey)
                  }
                >
                  <p className="h-6 flex items-center normal-semibold text-primary">
                    {organisation.name}
                  </p>
                  {organisation == currentOrganisation && (
                    <Check className="h-6 w-6 text-primary" />
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
