"use client";
import { useDepartmentFilter } from "@/hooks/staffing/useDepartmentFilter";
import FilterButton from "./Buttons/FilterButton";
import { useCompetencesFilter } from "@/hooks/staffing/useCompentencesFilter";

export default function CompetenceFilter() {
  const { competences, filteredCompetences, toggleCompetenceFilter } =
    useCompetencesFilter();

  if (competences.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="small">Avdeling</p>
        <div className="flex flex-col gap-2 w-52">
          {competences?.map((competence, index) => (
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
