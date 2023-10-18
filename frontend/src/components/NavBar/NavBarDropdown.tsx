"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, User } from "react-feather";

export default function NavBarDropdown(props: { initials: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="relative">
        <button
          className={`flex rounded-full border border-white h-9 min-w-[36px] justify-center items-center ${
            props.initials.length > 3 && "px-1"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="text-white body-small">{props.initials}</p>
        </button>
        <div
          className={`absolute right-0 top-11 rounded-b text-primary_default bg-white flex flex-col w-[138px] shadow-md ${
            !isOpen && "hidden"
          }`}
        >
          <button className="p-2 w-[138px] flex flex-row gap-3 hover:bg-primary_default hover:text-white">
            <User className="w-4 h-4" />
            <p className="body">Min profil</p>
          </button>
          <button
            className="p-2 w-[138px] rounded-b flex flex-row gap-3 hover:bg-primary_default hover:text-white"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4" />
            <p className="body">Logg ut</p>
          </button>
        </div>
      </div>
    </>
  );
}
