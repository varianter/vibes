"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "react-feather";

export default function SearchBarComponent() {
  const inputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "";
  const pathname = usePathname();
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || "",
  );
  const router = useRouter();

  useEffect(() => {
    router.push(`${pathname}?search=${searchText}&filter=${currentFilter}`);
  }, [searchText, router, pathname, currentFilter]);

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
        setSearchText("");
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
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <p className="body-small">Søk</p>
      <div className="flex flex-row gap-2 rounded-lg border border-primary_l1 px-3 py-2 w-max">
        <Search className="text-primary_default h-4 w-4" />
        <input
          placeholder="Søk etter konsulent"
          className="input w-36 focus:outline-none body-small "
          onChange={(e) => setSearchText(e.target.value)}
          ref={inputRef}
          value={searchText}
        ></input>
      </div>
    </div>
  );
}
