"use client";
import { YearRange } from "@/types";
import FilterButton from "./Buttons/FilterButton";
import { useYearsXpFilter } from "@/hooks/staffing/useYearsXpFilter";

export const yearRanges: YearRange[] = [
  { label: "0-2 Kilimanjaro", urlString: "0-2", start: 0, end: 2 },
  { label: "3-4 Mont Blanc", urlString: "3-4", start: 3, end: 4 },
  { label: "5-7 Denali", urlString: "5-7", start: 5, end: 7 },
  { label: "8-11 Cerro Torre", urlString: "8-11", start: 8, end: 11 },
  { label: "12+ K2", urlString: "12", start: 12 },
];

export default function ExperienceFilter() {
  const { toggleYearFilter, filteredYears } = useYearsXpFilter();

  if (yearRanges.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="small">Erfaring</p>
        <div className="flex flex-col gap-2 w-52">
          {yearRanges?.map((range, index) => (
            <FilterButton
              key={range.label}
              label={range.label}
              onClick={() => toggleYearFilter(range)}
              checked={filteredYears
                .map((y) => y.urlString)
                .includes(range.urlString)}
            />
          ))}
        </div>
      </div>
    );
  }
}
