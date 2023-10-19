import FilterButton from "./FilterButton";
import { fetchWithToken } from "@/data/fetchWithToken";
import { Department } from "@/types";

export default async function DepartmentFilter() {
  const departments =
    (await fetchWithToken<Department[]>(
      "organisations/variant-norge/departments",
    )) ?? [];

  if (departments.length > 0) {
    return (
      <div>
        <div className="flex flex-col gap-2">
          <p className="body-small">Avdelinger</p>
          <div className="flex flew-row flex-wrap gap-2 w-52">
            {departments?.map((department, index) => (
              <FilterButton key={index} filterName={department.name} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
