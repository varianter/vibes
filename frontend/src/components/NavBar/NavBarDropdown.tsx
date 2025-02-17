"use client";

import React, { useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "react-feather";
import { useOutsideClick } from "@/hooks/useOutsideClick";

export default function NavBarDropdown(props: { initial: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <div className="relative" ref={menuRef}>
      <button
        className={`flex rounded-full border border-white/50 h-8 w-8 justify-center items-center  ${
          isOpen ? "bg-white" : "hover:bg-white/10 hover:border-white"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className={`large ${isOpen ? "text-primary" : "text-white"}`}>
          {props.initial}
        </p>
      </button>
      <div
        className={`absolute right-0 top-[48px] z-50 rounded-lg text-primary bg-white flex flex-col w-[138px] shadow-xl p-1 ${
          !isOpen && "hidden"
        }`}
      >
        <button
          className="hover:bg-primary/10 px-3 py-2 rounded flex flex-row gap-3 items-center "
          onClick={() => signOut()}
        >
          <LogOut className="w-6 h-6" />
          <p className="h-6 flex items-center normal-semibold text-primary">
            Logg ut
          </p>
        </button>
      </div>
    </div>
  );
}
