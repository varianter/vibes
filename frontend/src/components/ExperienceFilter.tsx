"use client";
import { YearRange } from "@/types";
import FilterButton from "./Buttons/FilterButton";
import { useExperienceFilter } from "@/hooks/staffing/useExperienceFilter";
import { useState } from "react";

export default function ExperienceFilter() {
  const {
    activeExperienceFrom,
    setActiveExperienceFrom,
    activeExperienceTo,
    setActiveExperienceTo,
  } = useExperienceFilter();

  const [fromSearchIsActive, setFromSearchIsActive] = useState(false);
  const [toSearchIsActive, setToSearchIsActive] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <p className="small">Antall år erfaring</p>
      <div className="flex gap-2">
        <div className={`flex flex-col gap-2`}>
          <p className="small">Fra</p>
          <div
            className={`flex flex-row gap-2 border rounded-lg
            px-3 py-2 hover:bg-primary/10 hover:border-primary ${
              fromSearchIsActive ? "border-primary" : "border-primary/50"
            } `}
          >
            <input
              placeholder="Fra"
              id="yearsExperienceFrom"
              className="input focus:outline-none small w-full"
              type="number"
              onChange={(e) => setActiveExperienceFrom(e.target.value)}
              value={activeExperienceFrom}
              onFocus={() => setFromSearchIsActive(true)}
              onBlur={() => setFromSearchIsActive(false)}
            />
          </div>
        </div>
        <div className={`flex flex-col gap-2`}>
          <p className="small">Til</p>
          <div
            className={`flex flex-row gap-2 border rounded-lg
            px-3 py-2 hover:bg-primary/10 hover:border-primary ${
              toSearchIsActive ? "border-primary" : "border-primary/50"
            } `}
          >
            <input
              placeholder="Til"
              id="yearsExperienceTo"
              className="input focus:outline-none small w-full"
              type="number"
              onChange={(e) => setActiveExperienceTo(e.target.value)}
              value={activeExperienceTo}
              onFocus={() => setToSearchIsActive(true)}
              onBlur={() => setToSearchIsActive(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
