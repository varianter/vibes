"use client";
import FilterButton from "./FilterButton";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";

export default function DepartmentFilter() {
  const { departments, filteredDepartments, toggleDepartmentFilter } =
    useFilteredConsultants();

  if (departments.length > 0) {
    return (
      <div>
        <div className="flex flex-col gap-2">
          <p className="body-small">Avdelinger</p>
          <div className="flex flex-col gap-2 w-52">
            {departments?.map((department, index) => (
              <FilterButton
                key={department.id}
                label={department.name}
                onClick={() => toggleDepartmentFilter(department)}
                checked={filteredDepartments
                  .map((d) => d.id)
                  .includes(department.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
