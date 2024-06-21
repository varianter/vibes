import { useState, useEffect, useContext } from "react";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useNameSearch() {
  const { updateFilters, activeFilters } = useContext(FilteredContext);
  const searchFilter = activeFilters.searchFilter;

  function setNameSearch(newSearch: string) {
    setActiveNameSearch(newSearch);
  }

  const [activeNameSearch, setActiveNameSearch] =
    useState<string>(searchFilter);

  useEffect(() => {
    updateFilters({ search: activeNameSearch });
  }, [activeNameSearch, updateFilters]);

  return { activeNameSearch, setNameSearch };
}
