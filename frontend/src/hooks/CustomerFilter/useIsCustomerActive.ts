import { Context, useContext, useEffect, useState } from "react";

export function useIsCustomerActive(context: Context<any>) {
  const { updateFilters, activeFilters } = useContext(context);
  const isCustomerActiveFilter = activeFilters.isCustomerActiveFilter;

  const [isCustomerActive, setIsCustomerActive] = useState<boolean>(
    isCustomerActiveFilter,
  );
  function toggleActive() {
    setIsCustomerActive(!isCustomerActive);
  }

  useEffect(() => {
    updateFilters({ isCustomerActive: isCustomerActive });
  }, [isCustomerActive, updateFilters]);
  return { isCustomerActive, toggleActive };
}
