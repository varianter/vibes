"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterButton({ filterName }: { filterName: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isButtonActive, setIsButtonActive] = useState(checkFilterInUrl);

  function handleFilterClick() {
    setIsButtonActive((prevState) => !prevState);

    const currentSearch = searchParams.get("search");
    const currentFilter = searchParams.get("filter") || "";
    const filters = currentFilter.split(",");
    const filterIndex = filters.indexOf(filterName);
    const newFilters = [...filters];
    if (filterIndex === -1) {
      newFilters.push(filterName);
    } else {
      newFilters.splice(filterIndex, 1);
    }
    const newFilterString = newFilters.join(",").replace(/^,/, "");
    router.push(
      `${pathname}?search=${currentSearch}&filter=${newFilterString}`,
    );
  }

  function checkFilterInUrl() {
    const currentFilter = searchParams.get("filter") || "";
    return currentFilter.includes(filterName);
  }

  return (
    <button
      onClick={() => handleFilterClick()}
      className={`px-3 py-2 border-2 rounded-full ${
        isButtonActive
          ? "bg-primary_default text-white border-transparent "
          : "border-primary_default border-opacity-50 text-primary_default hover:bg-primary_default hover:bg-opacity-10"
      }`}
    >
      <p className="interaction-chip">{filterName}</p>
    </button>
  );
}
