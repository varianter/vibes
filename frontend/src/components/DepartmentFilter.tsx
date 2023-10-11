"use client";
import FilterButton from "./FilterButton";
import useDepartmentsApi from "@/hooks/useDepartmentsApi";

export default function DepartmentFilter() {
  const { data } = useDepartmentsApi();

  return (
    <div>
      <div className="flex flex-col gap-2">
        <p className="body-small">Avdelinger</p>
        <div className="flex flew-row flex-wrap gap-2">
          {data?.map((location, index) => (
            <FilterButton key={index} filterName={location.name} />
          ))}
        </div>
      </div>
    </div>
  );
}
