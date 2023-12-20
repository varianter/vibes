import { useState, useEffect, useContext } from "react";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useNameSearch() {
  const { updateFilters, activeFilters } = useContext(FilteredContext);
  const searchFilter = activeFilters.searchFilter;

  function setNameSearch(newSearch: string) {
    setActiveNameSearch(newSearch);
    setLastSearchKeyStrokeTime(Date.now());
  }

  const [activeNameSearch, setActiveNameSearch] =
    useState<string>(searchFilter);

  const [lastSearchKeyStrokeTime, setLastSearchKeyStrokeTime] =
    useState<number>();

  useEffect(() => {
    const nameSearchDebounceTimer = setTimeout(() => {
      if (
        lastSearchKeyStrokeTime &&
        Date.now() - lastSearchKeyStrokeTime > 180
      ) {
        updateFilters({ search: activeNameSearch });
      }
    }, 180);

    // this will clear Timeout
    // when component unmount like in willComponentUnmount
    // and show will not change to true
    return () => {
      clearTimeout(nameSearchDebounceTimer);
    };
  }, [activeNameSearch, lastSearchKeyStrokeTime, updateFilters]);

  return { activeNameSearch, setNameSearch };
}
