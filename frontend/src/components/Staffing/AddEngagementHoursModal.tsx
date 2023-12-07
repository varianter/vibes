import React, { RefObject, useContext, useEffect, useState } from "react";
import { Consultant, ProjectWithCustomerModel } from "@/types";
import { DateTime } from "luxon";
import { generateWeekList } from "@/components/Staffing/helpers/GenerateWeekList";
import { LargeModal } from "@/components/Modals/LargeModal";
import DropDown from "@/components/DropDown";
import ActionButton from "@/components/Buttons/ActionButton";
import IconActionButton from "@/components/Buttons/IconActionButton";
import { ArrowLeft, ArrowRight, Briefcase } from "react-feather";
import { AddConsultantCell } from "./AddConsultantCell";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { SelectOption } from "../ReactSelect";

export function AddEngagementHoursModal({
  modalRef,
  chosenConsultants,
  project,
}: {
  modalRef: RefObject<HTMLDialogElement>;
  weekSpan: number;
  chosenConsultants: Consultant[];
  project?: ProjectWithCustomerModel;
}) {
  const weekSpanOptions = ["8 uker", "12 uker", "26 uker"];
  const [selectedWeekSpan, setSelectedWeekSpan] = useState<number>(8);
  const [firstVisibleDay, setFirstVisibleDay] = useState<DateTime>(
    DateTime.now(),
  );

  const { consultants } = useContext(FilteredContext);

  const [consultantList, setConsultantList] =
    useState<Consultant[]>(chosenConsultants);

  function handleAddConsultant(option: SelectOption) {
    const consultant = consultants.find((c) => c.id == option.value);
    if (consultant) setConsultantList([...consultantList, consultant]);
  }

  function setWeekSpan(weekSpanString: string) {
    const weekSpanNum = parseInt(weekSpanString.split(" ")[0]);
    setSelectedWeekSpan(weekSpanNum);
  }

  const [weekList, setWeekList] = useState<DateTime[]>(
    generateWeekList(firstVisibleDay, selectedWeekSpan),
  );

  useEffect(() => {
    setWeekList(generateWeekList(firstVisibleDay, selectedWeekSpan));
  }, [firstVisibleDay, selectedWeekSpan]);

  return (
    <LargeModal modalRef={modalRef} project={project} showCloseButton={true}>
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <div className="flex flex-row gap-2">
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
              onClick={() => setFirstVisibleDay(DateTime.now())}
            >
              Nåværende uke
            </ActionButton>
            <IconActionButton
              variant={"secondary"}
              icon={<ArrowLeft />}
              onClick={() =>
                setFirstVisibleDay(
                  firstVisibleDay.minus({ week: selectedWeekSpan - 1 }),
                )
              }
            />
            <IconActionButton
              variant={"secondary"}
              icon={<ArrowRight />}
              onClick={() =>
                setFirstVisibleDay(
                  firstVisibleDay.plus({ week: selectedWeekSpan - 1 }),
                )
              }
            />
          </div>
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
            <col span={1} className="w-8" />
            <col span={1} className="w-[190px]" />
            {weekList.map((booking, index) => (
              <col key={index} span={1} />
            ))}
          </colgroup>
          <thead>
            <tr className="sticky -top-6 bg-white z-10">
              <th colSpan={2} className="pt-3 pl-2 -left-2 relative bg-white">
                <div className="flex flex-row gap-3 pb-4 items-center">
                  <p className="normal-medium ">Konsulenter</p>
                  <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                    {consultantList?.length}
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
            {consultantList?.map((consultant) => (
              <AddEngagementHoursRow
                key={consultant.id}
                consultant={consultant}
                weekList={weekList}
              />
            ))}
            <tr>
              <AddConsultantCell onAddConsultant={handleAddConsultant} />
            </tr>
          </tbody>
        </table>
      </div>
    </LargeModal>
  );
}

function AddEngagementHoursRow({
  consultant,
  weekList,
}: {
  consultant: Consultant;
  weekList: DateTime[];
}) {
  return (
    <tr>
      <td>
        <div className="flex justify-center items-center w-8 h-8 bg-offer rounded-lg">
          <Briefcase className="text-black w-4 h-4" />
        </div>
      </td>
      <td>
        <p className="text-black text-start small pl-2">{consultant.name}</p>
      </td>
      {weekList.map((day) => (
        /*Notat til senere:
        day er første dagen i den gitte uka, og dette tallet kan bli brukt til å finne ukenr og år når man skal sende/lagre dataen om timene.
        Kan gjøre at vi må håndtere ting forskjellig når vi skal redigere et engasjement
      */
        <td key={day.weekNumber} className=" p-0.5">
          <div className="flex justify-end items-center bg-offer/30  rounded-lg h-full">
            <p className="small-medium text-black/75 p-2">0</p>
          </div>
        </td>
      ))}
    </tr>
  );
}
