"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "react-feather";

export default function SearchBarComponent() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    router.push(`/bemanning?search=${searchText}`);
  }, [searchText, router]);

  useEffect(() => {
    function keyDownHandler(e: { code: string }) {
      if (
        (e.code.startsWith("Key") || e.code.includes("Backspace")) &&
        inputRef.current
      ) {
        inputRef.current.focus();
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
        <Search className="text-primary_default" />
        <input
          placeholder="Søk etter konsulent"
          className="input w-36 focus:outline-none body-small "
          onChange={(e) => setSearchText(e.target.value)}
          autoFocus
          ref={inputRef}
        ></input>
      </div>
    </div>
  );
}
