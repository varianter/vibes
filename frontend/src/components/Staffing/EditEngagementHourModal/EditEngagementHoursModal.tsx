import React, { RefObject, useEffect, useState, useContext } from "react";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import { DateTime } from "luxon";
import { LargeModal } from "@/components/Modals/LargeModal";
import DropDown from "@/components/DropDown";
import ActionButton from "@/components/Buttons/ActionButton";
import IconActionButton from "@/components/Buttons/IconActionButton";
import { ArrowLeft, ArrowRight, Calendar } from "react-feather";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { usePathname, useRouter } from "next/navigation";
import { Week } from "@/types";
import { isCurrentWeek } from "@/hooks/staffing/dateTools";
import InfoPill from "../InfoPill";
import { EditEngagementHoursRow } from "./EditEngagementHoursRow";
import { weekToString } from "@/data/urlUtils";

export function EditEngagementHourModal({
  modalRef,
  project,
  onClose,
}: {
  modalRef: RefObject<HTMLDialogElement>;
  project?: ProjectWithCustomerModel;
  onClose: () => void;
}) {
  const weekSpanOptions = ["8 uker", "12 uker", "26 uker"];
  const [selectedWeekSpan, setSelectedWeekSpan] = useState<number>(8);
  const [selectedWeek, setSelectedWeek] = useState<Week>({
    year: DateTime.now().year,
    weekNumber: DateTime.now().weekNumber,
  });

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

  const { setIsDisabledHotkeys } = useContext(FilteredContext);

  const [chosenProject, setProject] = useState(project);

  const [selectedConsultants, setSelectedConsultants] = useState<
    ConsultantReadModel[]
  >([]);

  useEffect(() => setProject(project), [project]);

  function setWeekSpan(weekSpanString: string) {
    const weekSpanNum = parseInt(weekSpanString.split(" ")[0]);
    setSelectedWeekSpan(weekSpanNum);
  }

  const organisationUrl = usePathname().split("/")[1];

  useEffect(() => {
    if (chosenProject != undefined) {
      fetchConsultantsFromProject(
        chosenProject,
        organisationUrl,
        selectedWeek,
        selectedWeekSpan,
      ).then((res) => {
        setSelectedConsultants([
          // Use spread to make a new list, forcing a re-render
          ...res,
        ]);
      });
    }
  }, [chosenProject, organisationUrl, selectedWeek, selectedWeekSpan]);

  const router = useRouter();

  return (
    <LargeModal
      modalRef={modalRef}
      project={chosenProject}
      showCloseButton={true}
      onClose={() => {
        setSelectedConsultants([]);
        setProject(undefined);
        resetSelectedWeek();
        setIsDisabledHotkeys(false), router.refresh();
        onClose();
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-row gap-2 justify-end">
          <DropDown
            startingOption={
              selectedWeekSpan ? selectedWeekSpan + " uker" : weekSpanOptions[0]
            }
            dropDownOptions={weekSpanOptions}
            dropDownFunction={setWeekSpan}
          />
          <ActionButton variant="secondary" onClick={() => resetSelectedWeek()}>
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
            <col span={1} className="w-10" />
            <col span={1} className="w-[190px]" />
            {selectedConsultants
              .at(0)
              ?.bookings.map((_, index) => <col key={index} span={1} />)}
          </colgroup>
          <thead>
            <tr>
              <th colSpan={2}>
                <div className="flex flex-row gap-3 pb-4 items-center">
                  <p className="normal-medium ">Konsulenter</p>
                  <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                    {selectedConsultants?.length}
                  </p>
                </div>
              </th>
              {selectedConsultants.at(0)?.bookings?.map((booking) => (
                <th key={booking.weekNumber} className=" px-2 py-1 pt-3 ">
                  <div className="flex flex-col gap-1">
                    {isCurrentWeek(booking.weekNumber, booking.year) ? (
                      <div className="flex flex-row gap-2 items-center justify-end">
                        {booking.bookingModel.totalHolidayHours > 0 && (
                          <InfoPill
                            text={booking.bookingModel.totalHolidayHours.toFixed(
                              1,
                            )}
                            icon={<Calendar size="12" />}
                            colors={"bg-holiday text-holiday_darker w-fit"}
                            variant={selectedWeekSpan < 24 ? "wide" : "medium"}
                          />
                        )}
                        <div className="h-2 w-2 rounded-full bg-primary" />

                        <p className="normal-medium text-right">
                          {booking.weekNumber}
                        </p>
                      </div>
                    ) : (
                      <div
                        className={`flex justify-end ${
                          selectedWeekSpan >= 26
                            ? "min-h-[30px] flex-col mb-2 gap-[1px] items-end"
                            : "flex-row gap-2"
                        }`}
                      >
                        {booking.bookingModel.totalHolidayHours > 0 && (
                          <InfoPill
                            text={booking.bookingModel.totalHolidayHours.toFixed(
                              1,
                            )}
                            icon={<Calendar size="12" />}
                            colors={"bg-holiday text-holiday_darker w-fit"}
                            variant={selectedWeekSpan < 24 ? "wide" : "medium"}
                          />
                        )}
                        <p className="normal text-right">
                          {booking.weekNumber}
                        </p>
                      </div>
                    )}

                    <p
                      className={`xsmall text-black/75 text-right ${
                        selectedWeekSpan >= 26 && "hidden"
                      }`}
                    >
                      {booking.dateString}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedConsultants?.map((consultant) => (
              <EditEngagementHoursRow
                key={consultant.id}
                consultant={consultant}
                detailedBooking={
                  consultant.detailedBooking.filter(
                    (db) => db.bookingDetails.projectId == project?.projectId,
                  )[0]
                }
                consultants={selectedConsultants}
                setConsultants={setSelectedConsultants}
              />
            ))}
          </tbody>
        </table>
      </div>
    </LargeModal>
  );
}

async function fetchConsultantsFromProject(
  project: ProjectWithCustomerModel,
  organisationUrl: string,
  selectedWeek: Week,
  selectedWeekSpan: number,
) {
  const url = `/${organisationUrl}/bemanning/api/projects/staffings?projectId=${
    project.projectId
  }&selectedWeek=${weekToString(
    selectedWeek,
  )}&selectedWeekSpan=${selectedWeekSpan}`;

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
