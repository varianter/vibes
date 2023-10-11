"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "react-feather";

const SearchBar = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    router.push(`/bemanning?search=${searchText}`);
  }, [searchText, router]);

  return (
    <div className="flex flex-col gap-2">
      <p className="body-small">Søk</p>
      <div className="flex flex-row gap-2 rounded-lg border border-primary_l1 px-3 py-2 w-max">
        <Search className="text-primary_default" />
        <input
          placeholder="Søk etter konsulent"
          className="input w-36 focus:outline-none body-small "
          onChange={(e) => setSearchText(e.target.value)}
        ></input>
      </div>
    </div>
  );
};

export default SearchBar;
