"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function FilterButton({
  filterName,
  number,
}: {
  filterName: string;
  number?: number;
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

  const clearFilter = useCallback(() => {
    setIsButtonActive(false);
    const currentSearch = searchParams.get("search");
    router.push(`/bemanning?search=${currentSearch}&filter=`);
  }, [router, searchParams]);

  useEffect(() => {
    function keyDownHandler(e: { code: string }) {
      if (
        number &&
        e.code.startsWith("Digit") &&
        e.code.includes(number.toString()) &&
        (document.activeElement?.tagName.toLowerCase() !== "input" ||
          document.activeElement?.id === "checkbox")
      ) {
        handleFilterClick();
      }
      if (e.code.includes("Escape")) {
        clearFilter();
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [clearFilter, handleFilterClick, number]);

  return (
    <div className="flex items-center">
      <input
        id="checkbox"
        type="checkbox"
        className="appearance-none border flex items-center border-primary_default m-[1px] mr-2 h-4 w-4 rounded-sm hover:bg-primary_l2 hover:border-primary_l2 checked:bg-primary_default"
        checked={isButtonActive}
        onChange={() => handleFilterClick()}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className={`absolute ml-[3px] pointer-events-none ${
          !isButtonActive && "hidden"
        }`}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.3536 2.64645C10.5488 2.84171 10.5488 3.15829 10.3536 3.35355L4.85355 8.85355C4.65829 9.04882 4.34171 9.04882 4.14645 8.85355L1.64645 6.35355C1.45118 6.15829 1.45118 5.84171 1.64645 5.64645C1.84171 5.45118 2.15829 5.45118 2.35355 5.64645L4.5 7.79289L9.64645 2.64645C9.84171 2.45118 10.1583 2.45118 10.3536 2.64645Z"
          fill="white"
        />
      </svg>
      <label className="body">{filterName}</label>
    </div>
  );
}
