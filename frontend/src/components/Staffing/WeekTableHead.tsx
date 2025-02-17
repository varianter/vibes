import { isCurrentWeek } from "@/hooks/staffing/dateTools";
import { DateTime } from "luxon";
import { useCallback, useMemo } from "react";
import InfoPill from "./InfoPill";
import { Calendar } from "react-feather";
import { useOrganizationContext } from "@/context/organization";
import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "@/data/apiCallsWithToken";

type Props = {
  title: string;
  number: number;
  weekList: DateTime[];
  selectedWeekSpan: number;
  orgUrl?: string;
};

export function WeekSpanTableHead({
  title,
  number,
  weekList,
  selectedWeekSpan,
  orgUrl,
}: Props) {
  const { organizations } = useOrganizationContext();
  const currentOrganization = useMemo(
    () => organizations.find((o) => o.urlKey === orgUrl),
    [organizations, orgUrl],
  );

  const hoursPerWorkday = currentOrganization?.hoursPerWorkday ?? 0;

  // TODO: loading indicator(s)
  const { data: publicHolidays } = useQuery({
    queryKey: ["publicHolidays", orgUrl],
    queryFn: () =>
      fetchWithToken<string[]>(`${orgUrl}/vacations/publicHolidays`),
    enabled: orgUrl !== undefined,
  });

  const getHolidayHoursForWeek = useCallback(
    (firstDayOfWeek: DateTime) => {
      if (!publicHolidays) {
        return 0;
      }
      const daySpan = [firstDayOfWeek];
      for (let i = 1; i < 5; i++) {
        daySpan.push(firstDayOfWeek.plus({ days: i }));
      }

      let publicHolidayHours = 0;

      daySpan.forEach((day) => {
        if (
          publicHolidays.length > 0 &&
          publicHolidays.includes(
            `${day.year.toString()}-${
              day.month > 9 ? day.month.toString() : "0" + day.month.toString()
            }-${day.day > 9 ? day.day.toString() : "0" + day.day.toString()}`,
          )
        ) {
          publicHolidayHours += hoursPerWorkday;
        }
      });

      return publicHolidayHours;
    },
    [publicHolidays, hoursPerWorkday],
  );

  return (
    <thead>
      <tr>
        <th colSpan={2}>
          <div className="flex flex-row gap-3  items-center">
            <p className="normal-medium ">{title}</p>
            <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
              {number}
            </p>
          </div>
        </th>
        {weekList.map((day) => (
          <th key={day.weekNumber} className=" px-2 py-1 pt-3 ">
            <div className="flex flex-col gap-1">
              {isCurrentWeek(day.weekNumber, day.year) ? (
                <div className="flex flex-row gap-2 items-center justify-end">
                  {getHolidayHoursForWeek(day) > 0 && (
                    <InfoPill
                      text={getHolidayHoursForWeek(day).toLocaleString(
                        "nb-No",
                        {
                          maximumFractionDigits: 1,
                          minimumFractionDigits: 0,
                        },
                      )}
                      icon={<Calendar size="12" />}
                      colors={"bg-holiday text-holiday_darker w-fit"}
                      variant={selectedWeekSpan < 24 ? "wide" : "medium"}
                    />
                  )}
                  <div className="h-2 w-2 rounded-full bg-primary" />

                  <p className="normal-medium text-right">{day.weekNumber}</p>
                </div>
              ) : (
                <div
                  className={`flex justify-end ${
                    selectedWeekSpan >= 26
                      ? "min-h-[30px] flex-col mb-2 gap-[1px] items-end"
                      : "flex-row gap-2"
                  }`}
                >
                  {getHolidayHoursForWeek(day) > 0 && (
                    <InfoPill
                      text={getHolidayHoursForWeek(day).toLocaleString(
                        "nb-No",
                        {
                          maximumFractionDigits: 1,
                          minimumFractionDigits: 0,
                        },
                      )}
                      icon={<Calendar size="12" />}
                      colors={"bg-holiday text-holiday_darker w-fit"}
                      variant={selectedWeekSpan < 24 ? "wide" : "medium"}
                    />
                  )}
                  <p className="normal text-right">{day.weekNumber}</p>
                </div>
              )}

              <p
                className={`xsmall text-black/75 text-right ${
                  selectedWeekSpan >= 26 && "hidden"
                }`}
              >
                {(day.day < 10 ? "0" + day.day : day.day) +
                  "." +
                  day.month +
                  " - " +
                  (day.plus({ days: 4 }).day < 10
                    ? "0" + day.plus({ days: 4 }).day
                    : day.plus({ days: 4 }).day) +
                  "." +
                  day.plus({ days: 4 }).month}
              </p>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
