import React, { RefObject, useEffect, useState, useContext } from "react";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import { DateTime } from "luxon";
import { generateWeekList } from "@/components/Staffing/helpers/GenerateWeekList";
import { LargeModal } from "@/components/Modals/LargeModal";
import DropDown from "@/components/DropDown";
import ActionButton from "@/components/Buttons/ActionButton";
import IconActionButton from "@/components/Buttons/IconActionButton";
import { ArrowLeft, ArrowRight } from "react-feather";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { useRouter } from "next/navigation";
import { AddConsultantCell } from "../AddConsultantCell";
import { SelectOption } from "../../ComboBox";
import { ConsultantWithWeekHours } from "@/types";
import { addNewConsultatWHours, generateConsultatsWithHours } from "./utils";
import { AddEngagementHoursRow } from "./AddEngagementHoursRow";

export function AddEngagementHoursModal({
  modalRef,
  chosenConsultants,
  project,
}: {
  modalRef: RefObject<HTMLDialogElement>;
  chosenConsultants: ConsultantReadModel[];
  project?: ProjectWithCustomerModel;
}) {
  const weekSpanOptions = ["8 uker", "12 uker", "26 uker"];
  const [selectedWeekSpan, setSelectedWeekSpan] = useState<number>(8);
  const [firstVisibleDay, setFirstVisibleDay] = useState<DateTime>(
    DateTime.now(),
  );

  const { consultants, setIsDisabledHotkeys } = useContext(FilteredContext);

  const [weekList, setWeekList] = useState<DateTime[]>(
    generateWeekList(firstVisibleDay, selectedWeekSpan),
  );

  const [selectedConsultants, setSelectedConsultants] = useState<
    ConsultantWithWeekHours[]
  >([]);

  const [selectedConsultantsFirstEdited, setSelectedConsultantsFirstEdited] =
    useState(false);

  useEffect(() => {
    setWeekList(generateWeekList(firstVisibleDay, selectedWeekSpan));
  }, [firstVisibleDay, selectedWeekSpan]);

  const remainingConsultants = consultants.filter(
    (c) => !selectedConsultants.find((c2) => c2.consultant.id == c.id),
  );

  function handleAddConsultant(option: SelectOption) {
    const consultant = remainingConsultants.find((c) => c.id == option.value);
    if (consultant) {
      setSelectedConsultants([
        ...addNewConsultatWHours(
          selectedConsultants,
          consultant,
          project?.projectId || 0,
        ),
      ]);
    }
  }

  function setWeekSpan(weekSpanString: string) {
    const weekSpanNum = parseInt(weekSpanString.split(" ")[0]);
    setSelectedWeekSpan(weekSpanNum);
  }

  useEffect(() => {
    if (project != undefined && selectedConsultantsFirstEdited == false) {
      setSelectedConsultants(
        generateConsultatsWithHours(
          weekList,
          chosenConsultants,
          project?.projectId || 0,
        ),
      );
      setSelectedConsultantsFirstEdited(true);
    }
  }, [chosenConsultants, selectedConsultantsFirstEdited, project, weekList]);

  const router = useRouter();

  return (
    <LargeModal
      modalRef={modalRef}
      project={project}
      showCloseButton={true}
      onClose={() => {
        setIsDisabledHotkeys(false), router.refresh();
      }}
    >
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
                    {selectedConsultants?.length}
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
            {selectedConsultants?.map((consultant) => (
              <AddEngagementHoursRow
                key={consultant.consultant.id}
                consultant={consultant.consultant}
                weekList={weekList}
                project={project}
                consultantWWeekHours={consultant}
              />
            ))}
            <tr>
              <AddConsultantCell
                onAddConsultant={handleAddConsultant}
                consultantList={remainingConsultants}
              />
            </tr>
          </tbody>
        </table>
      </div>
    </LargeModal>
  );
}
