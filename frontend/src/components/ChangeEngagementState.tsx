"use client";

import {
  EngagementState,
  ProjectWithCustomerModel,
  UpdateProjectWriteModel,
} from "@/api-types";
import { useState } from "react";
import FilterButton from "./Buttons/FilterButton";
import { usePathname, useRouter } from "next/navigation";

export default function ChangeEngagementState({
  project,
}: {
  project: ProjectWithCustomerModel;
}) {
  const organisationName = usePathname().split("/")[1];

  const router = useRouter();

  const [engagementState, setEngagementState] = useState<EngagementState>(
    project.bookingType,
  );

  const isInternalProject = project.customerName === "Variant";

  async function handleChange(newState: EngagementState) {
    setEngagementState(newState);

    const currentDate = new Date();
    const startYear = currentDate.getFullYear();
    const startWeek = Math.ceil(
      (currentDate.getTime() - new Date(startYear, 0, 1).getTime()) /
        (7 * 24 * 60 * 60 * 1000),
    );

    const body: UpdateProjectWriteModel = {
      engagementId: project.projectId,
      projectState: newState,
      startYear: startYear,
      startWeek: startWeek,
      weekSpan: 26,
    };

    await submitAddEngagementForm(body);
    router.refresh();
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
        disabled={isInternalProject}
      />
      <FilterButton
        label="Ordre"
        rounded={true}
        value={EngagementState.Order}
        checked={engagementState === EngagementState.Order}
        onChange={(e) => handleChange(e.target.value as EngagementState)}
        disabled={isInternalProject}
      />

      <FilterButton
        label="Avsluttet"
        rounded={true}
        value={EngagementState.Closed}
        checked={engagementState === EngagementState.Closed}
        onChange={(e) => handleChange(e.target.value as EngagementState)}
        disabled={isInternalProject}
      />
      <FilterButton
        label="Tapt"
        rounded={true}
        value={EngagementState.Lost}
        checked={engagementState === EngagementState.Lost}
        onChange={(e) => handleChange(e.target.value as EngagementState)}
        disabled={isInternalProject}
      />
    </form>
  );
}
