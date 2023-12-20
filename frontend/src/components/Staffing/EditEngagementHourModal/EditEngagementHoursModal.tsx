import React, { RefObject, useEffect, useState, useContext } from "react";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import { LargeModal } from "@/components/Modals/LargeModal";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { usePathname, useRouter } from "next/navigation";
import { Week } from "@/types";
import { EditEngagementHoursRow } from "./EditEngagementHoursRow";
import { weekToString } from "@/data/urlUtils";
import WeekSelector from "@/components/WeekSelector";
import { useWeekSelectors } from "@/hooks/useWeekSelectors";
import { WeekSpanTableHead } from "../WeekTableHead";

export function EditEngagementHourModal({
  modalRef,
  project,
  onClose,
}: {
  modalRef: RefObject<HTMLDialogElement>;
  project?: ProjectWithCustomerModel;
  onClose: () => void;
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

  const { setIsDisabledHotkeys } = useContext(FilteredContext);

  const [chosenProject, setProject] = useState(project);

  const [selectedConsultants, setSelectedConsultants] = useState<
    ConsultantReadModel[]
  >([]);

  useEffect(() => setProject(project), [project]);

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
            <col span={1} className="w-10" />
            <col span={1} className="w-[190px]" />
            {selectedConsultants
              .at(0)
              ?.bookings.map((_, index) => <col key={index} span={1} />)}
          </colgroup>
          <WeekSpanTableHead
            title={"Konsulenter"}
            number={selectedConsultants?.length}
            weekList={weekList}
            selectedWeekSpan={selectedWeekSpan}
          />
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
