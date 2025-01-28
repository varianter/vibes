"use client";
import { useDepartmentFilter } from "@/hooks/staffing/useDepartmentFilter";
import FilterButton from "./Buttons/FilterButton";
import { Context } from "react";
import { DepartmentReadModel } from "@/api-types";

export default function DepartmentFilter({
  context,
}: {
  context: Context<any>;
}) {
  const { departments, filteredDepartments, toggleDepartmentFilter } =
    useDepartmentFilter(context);

  if (departments.length > 0) {
    departments.sort((a: DepartmentReadModel, b: DepartmentReadModel) => {
      if (!(a.hotkey || b.hotkey)) {
        return a.id.localeCompare(b.id);
      }
      const aHotKey = a.hotkey || 999;
      const bHotKey = b.hotkey || 999;

      return aHotKey - bHotKey;
    });

    return (
      <div className="flex flex-col gap-2">
        <p className="small">Avdeling</p>
        <div className="flex flex-col gap-2 w-52">
          {departments?.map(
            (department: DepartmentReadModel, index: number) => (
              <FilterButton
                key={department.id}
                label={department.name}
                onClick={() => toggleDepartmentFilter(department)}
                checked={filteredDepartments
                  .map((d) => d.id)
                  .includes(department.id)}
              />
            ),
          )}
        </div>
      </div>
    );
  }
}
