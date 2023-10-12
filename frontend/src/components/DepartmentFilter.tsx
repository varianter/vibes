"use client";
import FilterButton from "./FilterButton";
import useDepartmentsApi from "@/hooks/useDepartmentsApi";
import { CircularProgress } from "@mui/material";

export default function DepartmentFilter() {
  const { data, isLoading } = useDepartmentsApi();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (data) {
    return (
      <div>
        <div className="flex flex-col gap-2">
          <p className="body-small">Avdelinger</p>
          <div className="flex flew-row flex-wrap gap-2 w-52">
            {data?.map((department, index) => (
              <FilterButton key={index} filterName={department} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
