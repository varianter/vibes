"use client";
import {
  CustomersWithProjectsReadModel,
  EngagementReadModel,
} from "@/api-types";
import EngagementRow from "./EngagementRow";
import { useDepartmentFilter } from "@/hooks/staffing/useDepartmentFilter";
import WeekSelector from "../WeekSelector";
import { useWeekSelectors } from "@/hooks/useWeekSelectors";
import { WeekSpanTableHead } from "../Staffing/WeekTableHead";
import { AgreementEdit } from "../Agreement/AgreementEdit";
import ActionButton from "../Buttons/ActionButton";
import { useParams } from "next/navigation";
import { useState } from "react";
import ActivateButton from "../Buttons/ActivateButton";

export default function CustomerTable({
  customer,
  orgUrl,
  numWorkHours,
}: {
  customer: CustomersWithProjectsReadModel;
  orgUrl: string;
  numWorkHours: number;
}) {
  const {
    selectedWeek,
    weekSpanOptions,
    weekList,
    selectedWeekSpan,
    resetSelectedWeek,
    setSelectedWeekSpan,
    incrementSelectedWeek,
    decrementSelectedWeek,
  } = useWeekSelectors();

  const { filteredDepartments } = useDepartmentFilter();
  const [isActive, setIsActive] = useState<boolean>(customer.isActive);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { organisation } = useParams();

  async function onActivate(customerId: number, active: boolean) {
    if (isLoading) return;
    setIsLoading(true);
    setIsActive(active);
    try {
      const response = await fetch(
        `/${organisation}/kunder/api?customerId=${customerId}&activate=${active}`,
        {
          method: "PUT",
        },
      );
      if (response.status !== 200) {
        setIsActive(!active);
      }
    } catch {
      setIsActive(!active);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="main p-4 pt-5 w-full flex flex-col gap-8">
      <div className="flex flex-row justify-between">
        <h1>{customer?.customerName}</h1>
        <ActivateButton
          onClick={() => onActivate(customer.customerId, !customer.isActive)}
          mode={isActive ? "deactivate" : "activate"}
        >
          {isActive ? "Deaktiver" : "Aktiver"}
        </ActivateButton>
      </div>

      <div className="flex flex-row justify-between">
        <div className="h-4">
          {filteredDepartments.length > 0 && (
            <p className="small-medium">
              {` ${filteredDepartments.map((d) => d.name).join(", ")}`}
            </p>
          )}
        </div>
        <WeekSelector
          weekSpan={selectedWeekSpan}
          weekSpanOptions={weekSpanOptions}
          setWeekSpan={setSelectedWeekSpan}
          resetSelectedWeek={resetSelectedWeek}
          decrementSelectedWeek={decrementSelectedWeek}
          incrementSelectedWeek={incrementSelectedWeek}
        />
      </div>

      <table
        className={`w-full ${
          selectedWeekSpan > 23
            ? "min-w-[1400px]"
            : selectedWeekSpan > 11
            ? "min-w-[850px]"
            : "min-w-[700px]"
        } table-fixed`}
      >
        <colgroup>
          <col span={1} className="w-16" />
          <col span={1} className="w-[190px]" />
          {weekList.map((_, index) => (
            <col key={index} span={1} />
          ))}
        </colgroup>

        <WeekSpanTableHead
          title={"Aktive engasjement"}
          number={customer?.activeEngagements?.length}
          weekList={weekList}
          selectedWeekSpan={selectedWeekSpan}
          orgUrl={orgUrl}
        />

        <tbody>
          <EngagementsRows engagements={customer.activeEngagements} />

          <tr>
            <td colSpan={2}>
              <div className="flex flex-row gap-3 py-2 items-center ">
                <p className="normal-medium">Inaktive engasjement</p>
                <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                  {customer.inactiveEngagements?.length}
                </p>
              </div>
            </td>
          </tr>

          <EngagementsRows engagements={customer.inactiveEngagements} />
        </tbody>
      </table>
      <AgreementEdit customer={customer} />
    </div>
  );

  function EngagementsRows({
    engagements,
  }: {
    engagements: EngagementReadModel[];
  }) {
    return (
      <>
        {engagements.map((engagement) => (
          <EngagementRow
            key={engagement.engagementId}
            engagement={engagement}
            orgUrl={orgUrl}
            selectedWeek={selectedWeek}
            selectedWeekSpan={selectedWeekSpan}
            weekList={weekList}
            numWorkHours={numWorkHours}
          />
        ))}
      </>
    );
  }
}
