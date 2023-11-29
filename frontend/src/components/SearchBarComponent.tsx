"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Search } from "react-feather";
import { useNameSearch } from "@/hooks/staffing/useNameSearch";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export default function SearchBarComponent({
  hidden = false,
}: {
  hidden?: boolean;
}) {
  const { setNameSearch, activeNameSearch } = useNameSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchIsActive, setIsSearchActive] = useState(false);
  const { isDisabledHotkeys } = useContext(FilteredContext);

  useEffect(() => {
    function keyDownHandler(e: { code: string }) {
      if (isDisabledHotkeys) return;
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
      if (e.code.startsWith("Digit") || e.code.includes("Period")) {
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [isDisabledHotkeys, setNameSearch]);

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
        />
      ) : (
        <div className={`flex flex-col gap-2`}>
          <p className="small">Søk</p>
          <div
            className={`flex flex-row gap-2 border rounded-lg
            px-3 py-2 w-full hover:bg-primary/10 hover:border-primary ${
              searchIsActive ? "border-primary" : "border-primary/50"
            } `}
          >
            <Search className="text-primary h-6 w-6" />

            <input
              placeholder="Søk etter konsulent"
              id="consultantSearch"
              className="input w-[131px] focus:outline-none small"
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
