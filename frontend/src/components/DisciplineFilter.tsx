"use client";

import FilterButton from "./Buttons/FilterButton";
import { useDisciplinesFilter } from "@/hooks/staffing/useDisciplinesFilter";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { Context } from "react";
import { DisciplineReadModel } from "@/api-types";

export default function DisciplineFilter({
  context = FilteredContext,
}: {
  context?: Context<any>;
}) {
  const { disciplines, filteredDisciplines, toggleDisciplineFilter } =
    useDisciplinesFilter(context);
  if (disciplines.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="small">Faggruppe</p>
        <div className="flex flex-col gap-2 w-52">
          {disciplines?.map((discipline: DisciplineReadModel) => (
            <FilterButton
              key={discipline.id}
              label={discipline.name}
              onClick={() => toggleDisciplineFilter(discipline)}
              checked={filteredDisciplines
                .map((d) => d.id)
                .includes(discipline.id)}
            />
          ))}
        </div>
      </div>
    );
  }
}
