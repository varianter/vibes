"use client";

import {
  EngagementState,
  EngagementWriteModel,
  ProjectWithCustomerModel,
} from "@/api-types";
import { FormEvent, useEffect, useState } from "react";
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

  function handleChange(newState: EngagementState) {
    setEngagementState(newState);
  }

  useEffect(() => {
    const body: EngagementWriteModel = {
      customerName: project.customerName,
      projectName: project.projectName,
      bookingType: engagementState,
      isBillable: project.isBillable,
    };

    submitAddEngagementForm(body);
  }, [engagementState]);

  async function submitAddEngagementForm(body: EngagementWriteModel) {
    const url = `/${organisationName}/bemanning/api/projects`;
    try {
      const data = await fetch(url, {
        method: "put",
        body: JSON.stringify({
          ...body,
        }),
      });
      return (await data.json()) as ProjectWithCustomerModel;
    } catch (e) {
      console.error("Error updating engagement state", e);
    }
  }

  // Handler for form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Needed to prevent the form from refreshing the page
    event.preventDefault();
    event.stopPropagation();
    // Add your submission logic here

    const body: EngagementWriteModel = {
      customerName: project.customerName,
      projectName: project.projectName,
      bookingType: engagementState,
      isBillable: project.isBillable,
    };

    await submitAddEngagementForm(body);
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
