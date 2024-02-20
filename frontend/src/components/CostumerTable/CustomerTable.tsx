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

export default function CustomerTable({
  customer,
  orgUrl,
}: {
  customer: CustomersWithProjectsReadModel;
  orgUrl: string;
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

  return (
    <div className="main p-4 pt-5 w-full flex flex-col gap-8">
      <h1>{customer?.customerName}</h1>

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
          />
        ))}
      </>
    );
  }
}
