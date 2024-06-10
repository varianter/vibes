"use client";

import {
  EngagementState,
  ProjectWithCustomerModel,
  UpdateProjectWriteModel,
} from "@/api-types";
import { useState } from "react";
import FilterButton from "./Buttons/FilterButton";
import { usePathname } from "next/navigation";

export default function ChangeEngagementState({
  project,
}: {
  project: ProjectWithCustomerModel;
}) {
  const organisationName = usePathname().split("/")[1];

  const [engagementState, setEngagementState] = useState<EngagementState>(
    project.bookingType,
  );

  async function handleChange(newState: EngagementState) {
    setEngagementState(newState);

    const body: UpdateProjectWriteModel = {
      engagementId: project.projectId,
      projectState: newState,
      startYear: 2024,
      startWeek: 35,
      weekSpan: 8,
    };

    await submitAddEngagementForm(body);
  }

  async function submitAddEngagementForm(body: UpdateProjectWriteModel) {
    const url = `/${organisationName}/bemanning/api/projects/updateState`;
    try {
      const data = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          ...body,
        }),
      });
      return (await data.json()) as ProjectWithCustomerModel;
    } catch (e) {
      console.error("Error updating engagement state", e);
    }
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
        value={EngagementState.Closed}
        checked={engagementState === EngagementState.Closed}
        onChange={(e) => handleChange(e.target.value as EngagementState)}
      />
    </form>
  );
}
