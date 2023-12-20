import React, { RefObject, useEffect, useState, useContext } from "react";
import {
  ConsultantReadModel,
  EngagementState,
  ProjectWithCustomerModel,
} from "@/api-types";
import { LargeModal } from "@/components/Modals/LargeModal";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { useRouter } from "next/navigation";
import { AddConsultantCell } from "../AddConsultantCell";
import { SelectOption } from "../../ComboBox";
import { ConsultantWithWeekHours } from "@/types";
import { addNewConsultatWHours, generateConsultatsWithHours } from "./utils";
import { AddEngagementHoursRow } from "./AddEngagementHoursRow";
import WeekSelector from "@/components/WeekSelector";
import { useWeekSelectors } from "@/hooks/useWeekSelectors";
import { WeekSpanTableHead } from "../WeekTableHead";

export function AddEngagementHoursModal({
  modalRef,
  chosenConsultants,
  project,
}: {
  modalRef: RefObject<HTMLDialogElement>;
  chosenConsultants: ConsultantReadModel[];
  project?: ProjectWithCustomerModel;
}) {
  const {
    weekSpanOptions,
    weekList,
    selectedWeekSpan,
    resetSelectedWeek,
    incrementSelectedWeek,
    decrementSelectedWeek,
    setWeekSpan,
  } = useWeekSelectors();

  const { consultants, setIsDisabledHotkeys } = useContext(FilteredContext);

  const [chosenProject, setProject] = useState(project);

  const [selectedConsultants, setSelectedConsultants] = useState<
    ConsultantWithWeekHours[]
  >([]);

  const [selectedConsultantsFirstEdited, setSelectedConsultantsFirstEdited] =
    useState(false);

  const remainingConsultants = consultants.filter(
    (c) => !selectedConsultants.find((c2) => c2.consultant.id == c.id),
  );

  useEffect(() => setProject(project), [project]);

  function handleAddConsultant(option: SelectOption) {
    const consultant = remainingConsultants.find((c) => c.id == option.value);
    if (consultant) {
      setSelectedConsultants([
        ...addNewConsultatWHours(
          selectedConsultants,
          consultant,
          chosenProject?.projectId || 0,
          chosenProject?.bookingType || EngagementState.Order,
        ),
      ]);
    }
  }

  useEffect(() => {
    if (chosenProject != undefined && selectedConsultantsFirstEdited == false) {
      setSelectedConsultants(
        generateConsultatsWithHours(
          weekList,
          chosenConsultants,
          chosenProject.projectId || 0,
          chosenProject.bookingType,
        ),
      );
      setSelectedConsultantsFirstEdited(true);
    }
  }, [
    chosenConsultants,
    selectedConsultantsFirstEdited,
    chosenProject,
    weekList,
  ]);

  const router = useRouter();

  return (
    <LargeModal
      modalRef={modalRef}
      project={chosenProject}
      showCloseButton={true}
      onClose={() => {
        setSelectedConsultantsFirstEdited(false);
        setSelectedConsultants([]);
        setProject(undefined);
        setIsDisabledHotkeys(false), router.refresh();
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
            <col span={1} className="w-8" />
            <col span={1} className="w-[190px]" />
            {weekList.map((day) => (
              <col key={day.weekNumber} span={1} />
            ))}
          </colgroup>
          <WeekSpanTableHead
            title={"Konsulenter"}
            number={selectedConsultants?.length}
            weekList={weekList}
            selectedWeekSpan={selectedWeekSpan}
          />

          <tbody>
            {selectedConsultants?.map((consultant) => (
              <AddEngagementHoursRow
                key={consultant.consultant.id}
                consultant={consultant.consultant}
                weekList={weekList}
                project={chosenProject}
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
