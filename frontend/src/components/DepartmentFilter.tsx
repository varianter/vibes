"use client";
import FilterButton from "./FilterButton";
import { Department } from "@/types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

async function getDepartments(setDepartments: Function, pathName: string) {
  try {
    const data = await fetch(
      `${pathName}/api/departments?organisationName=${pathName.split("/")[1]}`,
      {
        method: "get",
      },
    );

    const departments = await data.json();
    setDepartments(departments);
  } catch (e) {
    console.error("Error fetching departments:", e);
  }
}

export default function DepartmentFilter() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const pathName = usePathname();

  useEffect(() => {
    getDepartments(setDepartments, pathName);
  }, [pathName]);

  if (departments.length > 0) {
    return (
      <div>
        <div className="flex flex-col gap-2">
          <p className="body-small">Avdelinger</p>
          <div className="flex flex-col gap-2 w-52">
            {departments?.map((department, index) => (
              <FilterButton
                key={index}
                filterName={department.name}
                hotKey={index + 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
