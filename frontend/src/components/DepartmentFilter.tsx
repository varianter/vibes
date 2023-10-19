"use client";
import { URL_PATH } from "@/constants";
import FilterButton from "./FilterButton";
import { Department } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

async function getDepartments(setDepartments: Function) {
  try {
    const data = await fetch(`${URL_PATH}/bemanning/api/departments`, {
      method: "get",
    });

    const departments = await data.json();
    setDepartments(departments);
  } catch (e) {
    console.error("Error fetching number of installations:", e);
  }
}

export default function DepartmentFilter() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const route = useRouter();

  useEffect(() => {
    getDepartments(setDepartments);
  }, []);

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
                number={index + 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
