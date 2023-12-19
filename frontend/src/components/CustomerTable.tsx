"use client";
import { CustomersWithProjectsReadModel } from "@/api-types";
import { Week } from "@/types";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import InfoBox from "./InfoBox";
import EngagementRow from "./EngagementRow";
import DropDown from "./DropDown";
import ActionButton from "./Buttons/ActionButton";
import IconActionButton from "./Buttons/IconActionButton";
import { ArrowLeft, ArrowRight } from "react-feather";
import { generateWeekList } from "./Staffing/helpers/GenerateWeekList";

export default function CustomerTable({
  customer,
  orgUrl,
}: {
  customer: CustomersWithProjectsReadModel;
  orgUrl: string;
}) {
  const weekSpanOptions = ["8 uker", "12 uker", "26 uker"];
  const [selectedWeekSpan, setSelectedWeekSpan] = useState<number>(8);
  const [selectedWeek, setSelectedWeek] = useState<Week>({
    year: DateTime.now().year,
    weekNumber: DateTime.now().weekNumber,
  });

  const [weekList, setWeekList] = useState<DateTime[]>(
    generateWeekList(
      DateTime.now().set({
        weekYear: selectedWeek.year,
        weekNumber: selectedWeek.weekNumber,
      }),
      selectedWeekSpan,
    ),
  );

  useEffect(() => {
    setWeekList(
      generateWeekList(
        DateTime.now().set({
          weekYear: selectedWeek.year,
          weekNumber: selectedWeek.weekNumber,
        }),
        selectedWeekSpan,
      ),
    );
  }, [selectedWeek, selectedWeekSpan]);

  function changeSelectedWeek(numberOfWeeks: number) {
    const date = selectedWeek
      ? DateTime.now().set({
          weekYear: selectedWeek.year,
          weekNumber: selectedWeek.weekNumber,
        })
      : DateTime.now();

    const newDate = date.plus({ week: numberOfWeeks });

    setSelectedWeek({ year: newDate.year, weekNumber: newDate.weekNumber });
  }

  function resetSelectedWeek() {
    setSelectedWeek({
      year: DateTime.now().year,
      weekNumber: DateTime.now().weekNumber,
    });
  }

  function incrementSelectedWeek() {
    changeSelectedWeek(selectedWeekSpan - 1);
  }

  function decrementSelectedWeek() {
    changeSelectedWeek(-(selectedWeekSpan - 1));
  }

  function setWeekSpan(weekSpanString: string) {
    const weekSpanNum = parseInt(weekSpanString.split(" ")[0]);
    setSelectedWeekSpan(weekSpanNum);
  }

  return (
    <div className="flex flex-row h-full">
      <div className="sidebar z-10">
        <div className=" bg-primary/5 h-full flex flex-col gap-6 p-4 w-[300px]">
          <div className="flex flex-row justify-between items-center gap-6">
            <h1 className="">Info</h1>
          </div>
          <div className="flex flex-col gap-2">
            <p className="small">Om</p>
            <InfoBox
              infoName={"Navn på kunde"}
              infoValue={customer?.customerName}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="small">Bemanning</p>
            <InfoBox
              infoName={"Antall aktive engasjement"}
              infoValue={customer?.activeEngagements?.length.toString()}
            />
            <InfoBox
              infoName={"Antall inaktive engasjement"}
              infoValue={customer?.inactiveEngagements?.length.toString()}
            />
          </div>
        </div>
      </div>
      {customer && (
        <div className="p-4 pt-5 w-full flex flex-col gap-8">
          <h1>{customer?.customerName}</h1>
          <div className="flex flex-row gap-2 justify-end">
            <DropDown
              startingOption={
                selectedWeekSpan
                  ? selectedWeekSpan + " uker"
                  : weekSpanOptions[0]
              }
              dropDownOptions={weekSpanOptions}
              dropDownFunction={setWeekSpan}
            />
            <ActionButton
              variant="secondary"
              onClick={() => resetSelectedWeek()}
            >
              Nåværende uke
            </ActionButton>
            <IconActionButton
              variant={"secondary"}
              icon={<ArrowLeft />}
              onClick={() => decrementSelectedWeek()}
            />
            <IconActionButton
              variant={"secondary"}
              icon={<ArrowRight />}
              onClick={() => incrementSelectedWeek()}
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

            <thead>
              <tr>
                <th colSpan={2}>
                  <div className="flex flex-row gap-3 pb-4 items-center">
                    <p className="normal-medium ">Aktive engasjement</p>
                    <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                      {customer?.activeEngagements?.length}
                    </p>
                  </div>
                </th>
                {weekList.map((day) => (
                  <th key={day.weekNumber} className=" px-2 py-1 pt-3 ">
                    <div className="flex flex-col gap-1">
                      <div
                        className={`flex justify-end ${
                          selectedWeekSpan >= 26
                            ? "min-h-[30px] flex-col mb-2 gap-[1px] items-end"
                            : "flex-row gap-2"
                        }`}
                      >
                        <p className="normal text-right">{day.weekNumber}</p>
                      </div>
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
            <tbody>
              {customer?.activeEngagements?.map((engagement) => (
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
                      {customer?.inactiveEngagements?.length}
                    </p>
                  </div>
                </td>
              </tr>
              {customer?.inactiveEngagements?.map((engagement) => (
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
          </table>
        </div>
      )}
    </div>
  );
}
