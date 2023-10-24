"use client";
import { useEffect, useRef, useState } from "react";
import { Search } from "react-feather";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";

export default function SearchBarComponent() {
  const { currentNameSearch, setNameSearch } = useFilteredConsultants();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function keyDownHandler(e: { code: string }) {
      if (
        (e.code.startsWith("Key") || e.code.includes("Backspace")) &&
        inputRef &&
        inputRef.current
      ) {
        inputRef.current.focus();
      }
      if (e.code.includes("Escape")) {
        setNameSearch("");
      }
      if (e.code.startsWith("Digit")) {
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [setNameSearch]);

  return (
    <div className="flex flex-col gap-2">
      <p className="body-small">Søk</p>
      <div className="flex flex-row gap-2 rounded-lg border border-primary_l1 px-3 py-2 w-max">
        <Search className="text-primary_default h-4 w-4" />
        <input
          placeholder="Søk etter konsulent"
          className="input w-[131px] focus:outline-none body-small "
          onChange={(e) => setNameSearch(e.target.value)}
          ref={inputRef}
          value={currentNameSearch}
        ></input>
      </div>
    </div>
  );
}
