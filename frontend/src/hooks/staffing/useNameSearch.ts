import { useState, useEffect } from "react";
import { useUrlRouteFilter } from "./useUrlRouteFilter";

export function useNameSearch() {
  const { searchFilter } = useUrlRouteFilter();
  const { updateRoute } = useUrlRouteFilter();

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
      if (lastSearchKeyStrokeTime && Date.now() - lastSearchKeyStrokeTime > 0) {
        updateRoute({ search: activeNameSearch });
      }
    }, 0);

    // this will clear Timeout
    // when component unmount like in willComponentUnmount
    // and show will not change to true
    return () => {
      clearTimeout(nameSearchDebounceTimer);
    };
  }, [activeNameSearch, lastSearchKeyStrokeTime, updateRoute]);

  return { activeNameSearch, setNameSearch };
}
