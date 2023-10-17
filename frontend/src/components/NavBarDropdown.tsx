"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, User } from "react-feather";

export default function Dropdown(props: { initials: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function toggle() {
    setIsOpen((old) => !old);
  }

  const transClass = isOpen ? "flex" : "hidden";

  return (
    <>
      <div className="relative">
        <button
          className="flex rounded-full border border-white h-9 w-9 overflow-hidden justify-center items-center"
          onClick={toggle}
        >
          <p className="text-white body-small">{props.initials}</p>
        </button>
        <div
          className={`absolute origin-right right-0 top-11 rounded text-primary_default bg-white flex flex-col w-[138px] shadow-[0_4px_4px_0_rgba(66,61,137,0.10)]  ${transClass}`}
        >
          <button className="text-center p-2 w-[138px] rounded flex flex-row gap-3 align-middle hover:bg-primary_default hover:text-white">
            <User className=" w-4 h-4" />
            <p className="body">Min profil</p>
          </button>
          <button
            className="text-center p-2 w-[138px] rounded flex flex-row gap-3 align-middle hover:bg-primary_default hover:text-white"
            onClick={() => signOut()}
          >
            <LogOut className=" w-4 h-4" />
            <p className="body">Logg ut</p>
          </button>
        </div>
      </div>
    </>
  );
}
