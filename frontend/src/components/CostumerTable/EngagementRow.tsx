"use client";

import {
  ConsultantReadModel,
  EngagementReadModel,
  EngagementState,
} from "@/api-types";
import { useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { Week } from "@/types";
import { weekToString } from "@/data/urlUtils";
import { EditEngagementHoursRow } from "../Staffing/EditEngagementHourModal/EditEngagementHoursRow";
import { DateTime } from "luxon";
import { getBookingTypeFromProjectState } from "../Staffing/AddEngagementHoursModal/utils";

export default function EngagementRows({
  engagement,
  orgUrl,
  selectedWeek,
  selectedWeekSpan,
  weekList,
}: {
  engagement: EngagementReadModel;
  orgUrl: string;
  selectedWeek: Week;
  selectedWeekSpan: number;
  weekList: DateTime[];
}) {
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);

  function toggleListElementVisibility() {
    setIsListElementVisible((old) => !old);
  }

  const [selectedConsultants, setSelectedConsultants] = useState<
    ConsultantReadModel[]
  >([]);

  useEffect(() => {
    fetchConsultantsFromProject(
      engagement,
      orgUrl,
      selectedWeek,
      selectedWeekSpan,
    ).then((res) => {
      setSelectedConsultants([
        // Use spread to make a new list, forcing a re-render
        ...res,
      ]);
    });
  }, [engagement, orgUrl, selectedWeek, selectedWeekSpan]);

  return (
    <>
      <tr
        className="h-[52px]"
        onMouseEnter={() => setIsRowHovered(true)}
        onMouseLeave={() => setIsRowHovered(false)}
      >
        <td
          className={`border-l-2 ${
            isListElementVisible
              ? "border-l-secondary"
              : isRowHovered
              ? "border-l-primary"
              : "border-l-primary/5"
          } `}
        >
          <button
            className={`p-2 rounded-lg ml-2 hover:bg-primary hover:bg-opacity-10 ${
              isListElementVisible && "rotate-180"
            }`}
            onClick={toggleListElementVisibility}
          >
            <ChevronDown className={`text-primary w-6 h-6`} />
          </button>
        </td>
        <td>
          <div className="flex flex-col gap-1 ">
            <p
              className={`text-black text-start ${
                isListElementVisible ? "normal-medium" : "normal"
              }`}
            >
              {engagement.engagementName}
            </p>
            <p className="xsmall text-black/75 text-start">
              {`${selectedConsultants.length} konsulenter - ${
                engagement.isBillable ? "Fakturerbart" : "Ikke fakturerbart"
              }`}
            </p>
          </div>
        </td>
        {weekList.map((day) => (
          <td key={day.weekNumber} className={`h-[52px] p-0.5`}>
            <div
              className={`flex flex-col gap-1 p-2 justify-end rounded w-full h-full relative border border-transparent bg-primary/[3%] hover:border-primary/30 hover:cursor-pointer
          `}
              onClick={() => setIsListElementVisible(!isListElementVisible)}
            ></div>
          </td>
        ))}
      </tr>
      {isListElementVisible &&
        selectedConsultants &&
        selectedConsultants.map((consultant) => (
          <EditEngagementHoursRow
            key={consultant.id}
            consultant={consultant}
            detailedBooking={consultant.detailedBooking
              .filter(
                (db) =>
                  db.bookingDetails.projectId == engagement?.engagementId &&
                  db.bookingDetails.type ==
                    getBookingTypeFromProjectState(engagement.bookingType),
              )
              .at(0)}
            consultants={selectedConsultants}
            setConsultants={setSelectedConsultants}
            withBorder={true}
          />
        ))}
    </>
  );
}

export async function fetchConsultantsFromProject(
  engagement: EngagementReadModel,
  organisationUrl: string,
  selectedWeek: Week,
  selectedWeekSpan: number,
) {
  const url = `/${organisationUrl}/bemanning/api/projects/staffings?projectId=${
    engagement.engagementId
  }&selectedWeek=${weekToString(
    selectedWeek,
  )}&selectedWeekSpan=${selectedWeekSpan}${
    engagement.bookingType == EngagementState.Absence ? "&isAbsence=True" : ""
  }`;

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
