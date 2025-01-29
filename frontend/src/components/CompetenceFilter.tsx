"use client";
import { useDepartmentFilter } from "@/hooks/staffing/useDepartmentFilter";
import FilterButton from "./Buttons/FilterButton";
import { useCompetencesFilter } from "@/hooks/staffing/useCompentencesFilter";
import {
  FilterContextType,
  FilteredContext,
} from "@/hooks/ConsultantFilterProvider";
import { Context } from "react";
import { ForecastContextType } from "@/hooks/ForecastFilter/ForecastFilterProvider";
import { CompetenceReadModel } from "@/api-types";

export default function CompetenceFilter({
  context = FilteredContext,
}: {
  context?: Context<any>;
}) {
  const { competences, filteredCompetences, toggleCompetenceFilter } =
    useCompetencesFilter(context);
  if (competences.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="small">Kompetanse</p>
        <div className="flex flex-col gap-2 w-52">
          {competences?.map((competence: CompetenceReadModel) => (
            <FilterButton
              key={competence.id}
              label={competence.name}
              onClick={() => toggleCompetenceFilter(competence)}
              checked={filteredCompetences
                .map((d) => d.id)
                .includes(competence.id)}
            />
          ))}
        </div>
      </div>
    );
  }
}
