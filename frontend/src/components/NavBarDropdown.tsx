"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";

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
          className={`absolute origin-right right-0 bg-primary_l4 w-24 flex flex-col p-4 rounded-sm ${transClass}`}
        >
          <button
            className="hover:opacity-70 text-center "
            onClick={() => signOut()}
          >
            Logg ut
          </button>
        </div>
      </div>
    </>
  );
}
