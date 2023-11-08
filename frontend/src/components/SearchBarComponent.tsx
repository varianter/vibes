"use client";
import { useEffect, useRef, useState } from "react";
import { Search } from "react-feather";
import { useNameSearch } from "@/hooks/staffing/useNameSearch";

export default function SearchBarComponent({
  hidden = false,
}: {
  hidden?: boolean;
}) {
  const { setNameSearch, activeNameSearch } = useNameSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchIsActive, setIsSearchActive] = useState(false);

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
    <>
      {hidden ? (
        <input
          placeholder=""
          id="hiddenSearch"
          className="input invisible-input"
          onChange={(e) => setNameSearch(e.target.value)}
          ref={inputRef}
          value={activeNameSearch}
          onFocus={() => console.log("F")}
        />
      ) : (
        <div className={`flex flex-col gap-2`}>
          <p className="body-small">Søk</p>
          <div
            className={`flex flex-row gap-2 border rounded-lg
            px-3 py-2 w-full hover:bg-primary_l4 hover:border-primary_default ${
              searchIsActive ? "border-primary_default" : "border-primary_l1"
            } `}
          >
            <Search className="text-primary_default h-4 w-4" />

            <input
              placeholder="Søk etter konsulent"
              id="consultantSearch"
              className="input w-[131px] focus:outline-none body-small"
              onChange={(e) => setNameSearch(e.target.value)}
              ref={inputRef}
              value={activeNameSearch}
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
