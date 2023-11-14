"use client";
import React, { useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "react-feather";
import { useOutsideClick } from "@/hooks/useOutsideClick";

export default function NavBarDropdown(props: { initials: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <>
      <div className="relative p-2" ref={menuRef}>
        <button
          className={`flex rounded-full border border-white h-9 min-w-[36px] justify-center items-center ${
            props.initials.length > 3 && "px-1"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="text-white small">{props.initials}</p>
        </button>
        <div
          className={`absolute right-0 top-11 rounded-b text-primary bg-white flex flex-col w-[138px] shadow-md ${
            !isOpen && "hidden"
          }`}
        >
          <button
            className="p-2 w-[138px] rounded-b flex flex-row gap-3 hover:bg-primary hover:text-white"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4" />
            <p className="normal">Logg ut</p>
          </button>
        </div>
      </div>
    </>
  );
}
