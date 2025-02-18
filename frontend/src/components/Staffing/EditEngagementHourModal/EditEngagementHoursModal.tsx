import React, { RefObject, useEffect, useState, useContext } from "react";
import {
  ConsultantReadModel,
  EngagementState,
  ProjectWithCustomerModel,
} from "@/api-types";
import { LargeModal } from "@/components/Modals/LargeModal";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { usePathname, useRouter } from "next/navigation";
import { ConsultantWithWeekHours, Week } from "@/types";
import { EditEngagementHoursRow } from "./EditEngagementHoursRow";
import { addNewConsultatWHours } from "./utils";
import { weekToString } from "@/data/urlUtils";
import WeekSelector from "@/components/WeekSelector";
import { useWeekSelectors } from "@/hooks/useWeekSelectors";
import { WeekSpanTableHead } from "../WeekTableHead";
import { AddConsultantCell } from "../AddConsultantCell";
import { SelectOption } from "@/components/ComboBox";
import { AddEngagementHoursRow } from "./AddEngagementHoursRow";

export function EditEngagementHourModal({
  modalRef,
  project,
  onClose,
  numWorkHours,
}: {
  modalRef: RefObject<HTMLDialogElement>;
  project?: ProjectWithCustomerModel;
  onClose: () => void;
  numWorkHours: number;
}) {
  const {
    selectedWeek,
    weekSpanOptions,
    weekList,
    selectedWeekSpan,
    resetSelectedWeek,
    incrementSelectedWeek,
    decrementSelectedWeek,
    setSelectedWeekSpan,
  } = useWeekSelectors();

  const { consultants, setIsDisabledHotkeys } = useContext(FilteredContext);

  const [chosenProject, setProject] = useState(project);

  const [selectedConsultants, setSelectedConsultants] = useState<
    ConsultantReadModel[]
  >([]);

  const [selectedNewConsultants, setSelectedNewConsultants] = useState<
    ConsultantWithWeekHours[]
  >([]);

  const remainingConsultants = consultants.filter(
    (c) =>
      !selectedNewConsultants.find((c2) => c2.consultant.id == c.id) &&
      !selectedConsultants.find((c2) => c2.id == c.id),
  );

  useEffect(() => setProject(project), [project]);

  useEffect(() => {
    //check if selectedConsultants contains any of the selectedNewConsultants
    const newConsultants = selectedNewConsultants.map((c) => c.consultant.id);
    const consultants = selectedConsultants.map((c) => c.id);
    const intersection = newConsultants.filter((c) => consultants.includes(c));
    // remove the consultants that are in both lists from selectedNewConsultants
    if (intersection.length > 0) {
      setSelectedNewConsultants(
        selectedNewConsultants.filter(
          (c) => !intersection.includes(c.consultant.id),
        ),
      );
    }
  }, [selectedConsultants]);

  function handleAddConsultant(option: SelectOption) {
    const consultant = remainingConsultants.find((c) => c.id == option.value);
    if (consultant) {
      setSelectedNewConsultants([
        ...addNewConsultatWHours(
          selectedNewConsultants,
          consultant,
          chosenProject?.projectId || 0,
          chosenProject?.bookingType || EngagementState.Order,
        ),
      ]);
    }
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
        <WeekSelector
          weekSpan={selectedWeekSpan}
          weekSpanOptions={weekSpanOptions}
          setWeekSpan={setSelectedWeekSpan}
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
            orgUrl={organisationUrl}
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
                numWorkHours={numWorkHours}
              />
            ))}

            {selectedNewConsultants?.length > 0 && (
              <tr>
                <td
                  className={` pt-3 pb-3 small`}
                  colSpan={weekList.length + 2}
                >
                  Nylig lagt til:
                </td>
              </tr>
            )}

            {selectedNewConsultants?.map((consultant) => (
              <AddEngagementHoursRow
                key={consultant.consultant.id}
                consultant={consultant.consultant}
                weekList={weekList}
                project={chosenProject}
                consultantWWeekHours={consultant}
                numWorkHours={numWorkHours}
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
  console.time(
    "fetching consultants from project, EditEngagementHoursModal.tsx",
  );
  try {
    const data = await fetch(url, {
      method: "get",
    });
    return (await data.json()) as ConsultantReadModel[];
  } catch (e) {
    console.error("Error updating staffing", e);
  }
  console.timeEnd(
    "fetching consultants from project, EditEngagementHoursModal.tsx",
  );

  return [];
}
