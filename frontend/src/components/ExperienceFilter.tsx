"use client";
import { YearRange } from "@/types";
import FilterButton from "./Buttons/FilterButton";
import { useExperienceFilter } from "@/hooks/staffing/useExperienceFilter";
import { useState } from "react";

export default function ExperienceFilter() {
  const { toggleYearFilter, filteredYears } = useExperienceFilter();

  const [activeExperienceFromSearch, setExperienceFromSearch] =
    useState<number>(0);
  const [fromSearchIsActive, setFromSearchIsActive] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <p className="small">Erfaring</p>
      <div className="flex flex-col gap-2 w-52">
        <div className={`flex flex-col gap-2`}>
          <p className="small">Fra</p>
          <div
            className={`flex flex-row gap-2 border rounded-lg
            px-3 py-2 w-full hover:bg-primary/10 hover:border-primary ${
              fromSearchIsActive ? "border-primary" : "border-primary/50"
            } `}
          >
            <input
              placeholder="Fra"
              id="yearsExperienceFrom"
              className="input w-[131px] focus:outline-none small"
              type="number"
              onChange={(e) =>
                setExperienceFromSearch(parseInt(e.target.value))
              }
              // ref={inputRef}
              value={activeExperienceFromSearch}
              onFocus={() => setFromSearchIsActive(true)}
              onBlur={() => setFromSearchIsActive(false)}
            />
          </div>
        </div>
        <div>
          <p>Til</p>
          <input type="text"></input>
        </div>
      </div>
    </div>
  );
}
