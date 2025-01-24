import { ConsultantReadModel } from "@/api-types";
import { ConsultantForecastReadModel, YearRange } from "@/types";

function filterSearch(search: string, consultant: ConsultantReadModel) {
  if (!search || search.length === 0) return true;
  return consultant.name.match(new RegExp(`(?<!\\p{L})${search}.*\\b`, "giu"));
}
function filterDepartment(
  departmentFilter: string,
  consultant: ConsultantReadModel,
) {
  if (!departmentFilter || departmentFilter.length === 0) return true;
  return departmentFilter.includes(consultant.department.id);
}

function filterCompetence(
  competenceFilter: string,
  consultant: ConsultantReadModel,
) {
  if (!competenceFilter || competenceFilter.length === 0) return true;
  return competenceFilter
    .toLowerCase()
    .split(",")
    .map((c) => c.trim())
    .some((c) =>
      consultant.competences.map((c) => c.id.toLowerCase()).includes(c),
    );
}
function inYearRanges(
  consultant: ConsultantReadModel,
  yearRanges: YearRange[],
) {
  for (const range of yearRanges) {
    if (
      consultant.yearsOfExperience >= range.start &&
      (!range.end || consultant.yearsOfExperience <= range.end)
    )
      return true;
  }
  return false;
}

function filterRawYear(
  yearFilter: YearRange[],
  consultant: ConsultantReadModel,
) {
  if (yearFilter.length === 0) return true;
  return inYearRanges(consultant, yearFilter);
}

function filterAvailable(consultant: ConsultantReadModel) {
  return !consultant.isOccupied;
}

function experienceRange(
  consultant: ConsultantReadModel,
  experienceFrom: string,
  experienceTo: string,
) {
  const experienceRange = {
    start: parseInt(experienceFrom),
    end: parseInt(experienceTo),
  };
  if (
    (Number.isNaN(experienceRange.start) ||
      consultant.yearsOfExperience >= experienceRange.start) &&
    (Number.isNaN(experienceRange.end) ||
      consultant.yearsOfExperience <= experienceRange.end)
  )
    return true;
  else {
    return false;
  }
}
function filterExperience(
  experienceFrom: string,
  experienceTo: string,
  consultant: ConsultantReadModel,
) {
  if (experienceFrom === "" && experienceTo === "") return true;
  return experienceRange(consultant, experienceFrom, experienceTo);
}
export {
  filterDepartment,
  filterCompetence,
  filterRawYear,
  filterSearch,
  filterExperience,
  filterAvailable,
};
