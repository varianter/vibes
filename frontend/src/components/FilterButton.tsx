"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function FilterButton({
  filterName,
  number,
}: {
  filterName: string;
  number: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isButtonActive, setIsButtonActive] = useState(checkFilterInUrl);

  const handleFilterClick = useCallback(() => {
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
    router.push(`/bemanning?search=${currentSearch}&filter=${newFilterString}`);
  }, [filterName, router, searchParams]);

  function checkFilterInUrl() {
    const currentFilter = searchParams.get("filter") || "";
    return currentFilter.includes(filterName);
  }

  useEffect(() => {
    function keyDownHandler(e: { code: string }) {
      if (e.code.startsWith("Digit") && e.code.includes(number.toString())) {
        handleFilterClick();
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [handleFilterClick, number]);

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
