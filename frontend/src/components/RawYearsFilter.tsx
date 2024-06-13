"use client";
import { YearRange } from "@/types";
import FilterButton from "./Buttons/FilterButton";
import { useRawYearsFilter } from "@/hooks/staffing/useRawYearFilter";

export const rawYearRanges: YearRange[] = [
  { label: "0-2 Kilimanjaro", urlString: "0-2", start: 0, end: 2 },
  { label: "3-4 Mont Blanc", urlString: "3-4", start: 3, end: 4 },
  { label: "5-7 Denali", urlString: "5-7", start: 5, end: 7 },
  { label: "8-11 Cerro Torre", urlString: "8-11", start: 8, end: 11 },
  { label: "12+ K2", urlString: "12", start: 12 },
];

export default function RawYearsFilter() {
  const { toggleYearFilter, filteredYears } = useRawYearsFilter();

  if (rawYearRanges.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="small">Rå-år</p>
        <div className="flex flex-col gap-2 w-52">
          {rawYearRanges?.map((range, _) => (
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
