"use client";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import InfoBox from "@/components/InfoBox";
import { weekToString } from "@/data/urlUtils";
import { setWeeklyTotalBillableForProject } from "@/hooks/staffing/useConsultantsFilter";
import { useWeekSelectors } from "@/hooks/useWeekSelectors";
import { Week } from "@/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// TODO: Call funtion and set a state when adding or removing consultants and hours
function Sidebar({ project }: { project: ProjectWithCustomerModel }) {
  const { selectedWeek, selectedWeekSpan } = useWeekSelectors();

  const [selectedConsultants, setSelectedConsultants] = useState<
    ConsultantReadModel[]
  >([]);

  const organisationUrl = usePathname().split("/")[1];

  useEffect(() => {
    if (project != undefined) {
      fetchConsultantsFromProject(
        project,
        organisationUrl,
        selectedWeek,
        selectedWeekSpan,
      ).then((res) => {
        setSelectedConsultants([
          // Use spread to make a new list, forcing a re-render
          ...res,
        ]);
      });
    }
  }, [project, organisationUrl, selectedWeek, selectedWeekSpan]);

  function calculateTotalHours() {
    const weeklyTotalBillableAndOffered = setWeeklyTotalBillableForProject(
      selectedConsultants,
      project,
    );
    var sum = 0;
    weeklyTotalBillableAndOffered.forEach((element) => {
      sum += element;
    });
    return sum.toString();
  }

  return (
    <div className="sidebar z-10">
      <div className=" bg-primary/5 h-full flex flex-col gap-6 p-4 w-[300px]">
        <div className="flex flex-col gap-6">
          <h2 className="text-h1">Filter</h2>
          <div className="flex flex-col gap-2">
            <h3>Om</h3>
            <InfoBox
              infoName="Navn på kunde"
              infoValue={project.customerName}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3>Bemanning</h3>
            <InfoBox
              infoName="Antall konsulenter"
              infoValue={selectedConsultants.length.toString()}
            />
            <InfoBox
              infoName="Planlagt timeforbruk"
              infoValue={calculateTotalHours()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

async function fetchConsultantsFromProject(
  project: ProjectWithCustomerModel,
  organisationUrl: string,
  selectedWeek: Week,
  selectedWeekSpan: number,
) {
  const url = `/${organisationUrl}/bemanning/api/projects/staffings?projectId=${project.projectId
    }&selectedWeek=${weekToString(
      selectedWeek,
    )}&selectedWeekSpan=${selectedWeekSpan}`;

  try {
    const data = await fetch(url, {
      method: "get",
    });
    return (await data.json()) as ConsultantReadModel[];
  } catch (e) {
    console.error("Error updating staffing", e);
  }

  return [];
}

export default Sidebar;
