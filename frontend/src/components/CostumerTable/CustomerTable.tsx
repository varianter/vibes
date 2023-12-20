"use client";
import { CustomersWithProjectsReadModel } from "@/api-types";
import EngagementRow from "./EngagementRow";
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
    incrementSelectedWeek,
    decrementSelectedWeek,
    setWeekSpan,
  } = useWeekSelectors();

  return (
    <div className="main p-4 pt-5 w-full flex flex-col gap-8">
      <h1>{customer?.customerName}</h1>
      <WeekSelector
        weekSpan={selectedWeekSpan}
        weekSpanOptions={weekSpanOptions}
        setWeekSpan={setWeekSpan}
        resetSelectedWeek={resetSelectedWeek}
        decrementSelectedWeek={decrementSelectedWeek}
        incrementSelectedWeek={incrementSelectedWeek}
      />

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
        />

        <CustomerTableBody />
      </table>
    </div>
  );
  function CustomerTableBody() {
    return (
      <tbody>
        {customer.activeEngagements?.map((engagement) => (
          <EngagementRow
            key={engagement.engagementId}
            engagement={engagement}
            orgUrl={orgUrl}
            selectedWeek={selectedWeek}
            selectedWeekSpan={selectedWeekSpan}
            weekList={weekList}
          />
        ))}
        <tr>
          <td colSpan={2}>
            <div className="flex flex-row gap-3 pb-4 items-center">
              <p className="normal-medium ">Inaktive engasjement</p>
              <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                {customer.inactiveEngagements?.length}
              </p>
            </div>
          </td>
        </tr>
        {customer.inactiveEngagements?.map((engagement) => (
          <EngagementRow
            key={engagement.engagementId}
            engagement={engagement}
            orgUrl={orgUrl}
            selectedWeek={selectedWeek}
            selectedWeekSpan={selectedWeekSpan}
            weekList={weekList}
          />
        ))}
      </tbody>
    );
  }
}
