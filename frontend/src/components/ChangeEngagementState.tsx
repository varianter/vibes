"use client";
import { EngagementState } from "@/api-types";
import { useState } from "react";

export default function ChangeEngagementState({
  currentEngagement,
}: {
  currentEngagement: EngagementState;
}) {
  const [engagementState, setEngagementState] =
    useState<EngagementState>(currentEngagement);

  const handleChange = (newState: EngagementState) => {
    setEngagementState(newState);
  };

  return (
    <form>
      <span>
        <label id="tilbud">
          Tilbud
          <input
            aria-labelledby="tilbud"
            type="radio"
            value={EngagementState.Offer}
            checked={engagementState === EngagementState.Offer}
            onChange={(e) => handleChange(e.target.value as EngagementState)}
          />
        </label>
      </span>
      <span>
        <label id="ordre">
          Ordre
          <input
            aria-labelledby="ordre"
            type="radio"
            value={EngagementState.Order}
            checked={engagementState === EngagementState.Order}
            onChange={(e) => handleChange(e.target.value as EngagementState)}
          />
        </label>
      </span>
      <span>
        <label id="avsluttet">
          Avsluttet
          <input
            aria-labelledby="avsluttet"
            type="radio"
            value={EngagementState.Absence}
            checked={engagementState === EngagementState.Absence}
            onChange={(e) => handleChange(e.target.value as EngagementState)}
          />
        </label>
      </span>
    </form>
  );
}
