import { Department } from "@/types";
import { useCallback, useContext, useEffect } from "react";
import { useUrlRouteFilter } from "./useUrlRouteFilter";
import { toggleValueFromFilter } from "./UrlStringFilter";
import { FilteredContext } from "@/components/FilteredConsultantProvider";

export function useDepartmentFilter() {
  const { departments } = useContext(FilteredContext);
  const { departmentFilter, updateRoute } = useUrlRouteFilter();

  const filteredDepartments = departmentFilter
    .split(",")
    .map((id) => departments.find((d) => d.id === id))
    .filter((dept) => dept !== undefined) as Department[];

  const toggleDepartmentFilter = useCallback(
    (d: Department) => {
      const newDepartmentFilter = toggleValueFromFilter(departmentFilter, d.id);
      updateRoute({ departments: newDepartmentFilter });
    },
    [departmentFilter, updateRoute],
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
      if (
        e.code.startsWith("Digit") &&
        (document.activeElement?.tagName.toLowerCase() !== "input" ||
          document.activeElement?.id === "checkbox")
      ) {
        handleDepartmentHotkey(e.code);
      }
      if (e.code.includes("0")) {
        updateRoute({ departments: "" });
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [updateRoute, departments, toggleDepartmentFilter]);

  return {
    departments,
    filteredDepartments,
    toggleDepartmentFilter,
  };
}
