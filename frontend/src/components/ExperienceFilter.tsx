"use client";
import { YearRange } from "@/types";
import FilterButton from "./FilterButton";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";

export const yearRanges: YearRange[] = [
  { label: "0-2", urlString: "0-2", start: 0, end: 2 },
  { label: "3-4", urlString: "3-4", start: 3, end: 4 },
  { label: "5-7", urlString: "5-7", start: 5, end: 7 },
  { label: "8-11", urlString: "8-11", start: 8, end: 11 },
  { label: "12+", urlString: "12", start: 12 },
];

export default function ExperienceFilter() {
  const { filteredYears, toggleYearFilter } = useFilteredConsultants();

  if (yearRanges.length > 0) {
    return (
      <div>
        <div className="flex flex-col gap-2">
          <p className="body-small">RÅ-år</p>
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
      </div>
    );
  }
}
