"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "react-feather";

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
          className={`absolute origin-right right-0 bg-primary_default text-white flex flex-col w-[138px] border border-primary_l1 rounded-sm ${transClass}`}
        >
          <button
            className="text-center p-2 w-[138px] flex flex-row gap-3 align-middle hover:opacity-70"
            onClick={() => signOut()}
          >
            <LogOut className="text-white w-4 h-4" />
            <p className="body">Logg ut</p>
          </button>
        </div>
      </div>
    </>
  );
}
