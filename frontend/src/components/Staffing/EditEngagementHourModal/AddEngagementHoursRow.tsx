import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import { ConsultantWithWeekHours } from "@/types";
import { DateTime } from "luxon";
import { useState } from "react";
import { getColorByStaffingType, getIconByBookingType } from "../helpers/utils";
import { dayToWeek, getBookingTypeFromProjectState } from "./utils";
import { DetailedEngagementModalCell } from "./DetailedEngagementModalCell";

export function AddEngagementHoursRow({
  consultant,
  weekList,
  project,
  consultantWWeekHours,
  numWorkHours,
}: {
  consultant: ConsultantReadModel;
  weekList: DateTime[];
  project?: ProjectWithCustomerModel;
  consultantWWeekHours?: ConsultantWithWeekHours;
  numWorkHours: number;
}) {
  const [hourDragValue, setHourDragValue] = useState<number | undefined>(
    undefined,
  );
  const [startDragWeek, setStartDragWeek] = useState<number | undefined>(
    undefined,
  );
  const [currentDragWeek, setCurrentDragWeek] = useState<number | undefined>(
    undefined,
  );
  const [consultantWHours, setConsultantsWHours] = useState<
    ConsultantWithWeekHours | undefined
  >(consultantWWeekHours);

  function updateHours(res?: ConsultantReadModel) {
    if (!res) {
      return;
    }
    const consultant: ConsultantWithWeekHours = consultantWHours || {
      consultant: res,
      weekWithHours: [],
    };
    weekList.map((d) => {
      const resHours = findProjectHours(res, d);

      const hoursForWeek = consultant.weekWithHours.find(
        (w) => w.week == dayToWeek(d),
      );

      if (hoursForWeek) {
        hoursForWeek.hours = resHours ?? hoursForWeek.hours ?? 0;
      } else {
        consultant.weekWithHours.push({
          week: dayToWeek(d),
          hours: resHours || 0,
        });
      }
    });
    setConsultantsWHours({ ...consultant });
  }

  function findProjectHours(consultant: ConsultantReadModel, day: DateTime) {
    return consultant?.detailedBooking
      .find((db) => db.bookingDetails.projectId == project?.projectId)
      ?.hours.find((h) => h.week == dayToWeek(day))?.hours;
  }

  return (
    <tr className="h-8 p-0.5">
      <td
        className={`flex justify-center items-center w-8 h-8 ${getColorByStaffingType(
          getBookingTypeFromProjectState(project?.bookingType),
        )} rounded-lg ml-3`}
      >
        {getIconByBookingType(
          getBookingTypeFromProjectState(project?.bookingType),
          16,
        )}
      </td>
      <td>
        <p className="text-black text-start small pl-2">{consultant.name}</p>
      </td>
      {weekList.map((day) => (
        <DetailedEngagementModalCell
          key={dayToWeek(day)}
          project={project}
          consultant={consultant}
          hourDragValue={hourDragValue}
          currentDragWeek={currentDragWeek}
          startDragWeek={startDragWeek}
          setHourDragValue={setHourDragValue}
          setStartDragWeek={setStartDragWeek}
          setCurrentDragWeek={setCurrentDragWeek}
          numWeeks={weekList.length}
          firstDayInWeek={day}
          initHours={
            consultantWHours?.weekWithHours.find(
              (w) => w.week == dayToWeek(day),
            )?.hours || 0
          }
          updateHours={updateHours}
          numWorkHours={numWorkHours}
        />
      ))}
    </tr>
  );
}
