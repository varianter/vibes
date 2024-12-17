import { useState, useEffect, useContext, Context } from "react";

export function useNameSearch(context: Context<any>) {
  const { updateFilters, activeFilters } = useContext(context);
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
