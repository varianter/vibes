import { CompetenceReadModel, DepartmentReadModel } from "@/api-types";
import { Context, useCallback, useContext, useEffect } from "react";
import { toggleValueFromFilter } from "./UrlStringFilter";
import { FilteredContext } from "../ConsultantFilterProvider";

export function useDepartmentFilter(context: Context<any> = FilteredContext) {
  const { departments } = useContext(context);
  const { isDisabledHotkeys, updateFilters, activeFilters } =
    useContext(context);
  const departmentFilter = activeFilters.departmentFilter;

  const filteredDepartments = departmentFilter
    .split(",")
    .map((id: string) =>
      departments.find((d: CompetenceReadModel) => d.id === id),
    )
    .filter(
      (dept: DepartmentReadModel) => dept !== undefined,
    ) as DepartmentReadModel[];

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
        .filter((d: DepartmentReadModel) => d.hotkey)
        .filter((d: DepartmentReadModel) => keyCode.includes(`${d.hotkey!}`))
        .forEach((d: DepartmentReadModel) => toggleDepartmentFilter(d));
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
