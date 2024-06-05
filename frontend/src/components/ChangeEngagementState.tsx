"use client";

import { EngagementState } from "@/api-types";
import { useState } from "react";
import FilterButton from "./Buttons/FilterButton";

export default function ChangeEngagementState({
  currentEngagement,
}: {
  currentEngagement: EngagementState;
}) {
  const [engagementState, setEngagementState] =
    useState<EngagementState>(currentEngagement);

  function handleChange(newState: EngagementState) {
    setEngagementState(newState);
  }

  return (
    <form className="flex flex-row gap-4">
      <FilterButton
        label="Tilbud"
        rounded={true}
        value={EngagementState.Offer}
        checked={engagementState === EngagementState.Offer}
        onChange={(e) => handleChange(e.target.value as EngagementState)}
      />
      <FilterButton
        label="Ordre"
        rounded={true}
        value={EngagementState.Order}
        checked={engagementState === EngagementState.Order}
        onChange={(e) => handleChange(e.target.value as EngagementState)}
      />

      <FilterButton
        label="Avsluttet"
        rounded={true}
        value={EngagementState.Absence}
        checked={engagementState === EngagementState.Absence}
        onChange={(e) => handleChange(e.target.value as EngagementState)}
      />
    </form>
  );
}
