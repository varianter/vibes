import { isCurrentWeek } from "@/hooks/staffing/dateTools";
import { DateTime } from "luxon";

export function WeekSpanTableHead({
  title,
  number,
  weekList,
  selectedWeekSpan,
}: {
  title: string;
  number: number;
  weekList: DateTime[];
  selectedWeekSpan: number;
}) {
  return (
    <thead>
      <tr>
        <th colSpan={2}>
          <div className="flex flex-row gap-3 pb-4 items-center">
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
