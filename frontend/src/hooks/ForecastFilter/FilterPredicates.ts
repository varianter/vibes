import { ConsultantForecastReadModel, YearRange } from "@/types";

function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}
let filterSearch = curry(searchName);
function searchName(
  consultant: ConsultantForecastReadModel,
  search: () => string,
) {
  return consultant.name.match(
    new RegExp(`(?<!\\p{L})${search()}.*\\b`, "giu"),
  );
}
let filterDepartment = curry(department);
function department(
  departmentFilter: string,
  consultant: ConsultantForecastReadModel,
) {
  console.log(
    consultant.name,
    departmentFilter.includes(consultant.department.id),
  );
  return departmentFilter.includes(consultant.department.id);
}
let filterCompetence = curry(competence);
function competence(
  consultant: ConsultantForecastReadModel,
  competenceFilter: string,
) {
  return competenceFilter
    .toLowerCase()
    .split(",")
    .map((c) => c.trim())
    .some((c) =>
      consultant.competences.map((c) => c.id.toLowerCase()).includes(c),
    );
}
function inYearRanges(
  consultant: ConsultantForecastReadModel,
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
let filterRawYear = curry(rawYear);
function rawYear(
  consultant: ConsultantForecastReadModel,
  yearFilter: YearRange[],
) {
  return inYearRanges(consultant, yearFilter);
}

function available(consultant: ConsultantForecastReadModel) {
  return !consultant.isOccupied;
}

function experienceRange(
  consultant: ConsultantForecastReadModel,
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
let filterExperience = curry(experience);
function experience(
  experienceFrom: string,
  experienceTo: string,
  consultant: ConsultantForecastReadModel,
) {
  return experienceRange(consultant, experienceFrom, experienceTo);
}
export {
  filterSearch,
  filterDepartment,
  filterCompetence,
  filterRawYear,
  available,
  filterExperience,
};
