import { DepartmentReadModel } from "@/api-types";
import { useCallback, useContext, useEffect } from "react";
import { toggleValueFromFilter } from "./UrlStringFilter";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useDepartmentFilter() {
  const { departments } = useContext(FilteredContext);
  const { isDisabledHotkeys, updateFilters, activeFilters } =
    useContext(FilteredContext);
  const departmentFilter = activeFilters.departmentFilter;

  const filteredDepartments = departmentFilter
    .split(",")
    .map((id) => departments.find((d) => d.id === id))
    .filter((dept) => dept !== undefined) as DepartmentReadModel[];

  const toggleDepartmentFilter = useCallback(
    (d: DepartmentReadModel) => {
      const newDepartmentFilter = toggleValueFromFilter(departmentFilter, d.id);
      updateFilters({ departments: newDepartmentFilter });
    },
    [departmentFilter, updateFilters],
  );

  // To handle hotkeys 0,1,2,... for departments
  useEffect(() => {
    function handleDepartmentHotkey(keyCode: string) {
      departments
        .filter((d) => d.hotkey)
        .filter((d) => keyCode.includes(`${d.hotkey!}`))
        .forEach((d) => toggleDepartmentFilter(d));
    }

    function keyDownHandler(e: { code: string }) {
      if (isDisabledHotkeys) return;
      if (
        e.code.startsWith("Digit") &&
        (document.activeElement?.tagName.toLowerCase() !== "input" ||
          document.activeElement?.id === "checkbox")
      ) {
        handleDepartmentHotkey(e.code);
      }
      if (e.code.includes("0")) {
        updateFilters({ departments: "" });
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [updateFilters, departments, toggleDepartmentFilter, isDisabledHotkeys]);

  return {
    departments,
    filteredDepartments,
    toggleDepartmentFilter,
  };
}
