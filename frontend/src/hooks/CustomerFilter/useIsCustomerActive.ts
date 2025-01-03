import { useContext, useEffect, useState } from "react";
import { FilteredCustomerContext } from "./CustomerFilterProvider";

function parseBooleanOrString(value: string | boolean) {
  if (typeof value === "string") {
    if (value === "true") {
      return true;
    } else if (value === "false") {
      return false;
    } else {
      return ""; //
    }
  } else {
    return value;
  }
}
export function useIsCustomerActive() {
  const { updateFilters, activeFilters } = useContext(FilteredCustomerContext);
  const isCustomerActiveFilter = activeFilters.isCustomerActiveFilter;
  const parsedActive = parseBooleanOrString(isCustomerActiveFilter);
  const valueForToggle = parsedActive === "" ? true : parsedActive;
  const [isCustomerActive, setIsCustomerActive] = useState<boolean | string>(
    valueForToggle,
  );
  function toggleActive() {
    setIsCustomerActive(!isCustomerActive);
  }

  useEffect(() => {
    updateFilters({ isCustomerActive: isCustomerActive });
  }, [isCustomerActive, updateFilters]);
  return { isCustomerActive, toggleActive };
}
