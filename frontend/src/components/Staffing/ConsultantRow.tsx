"use client";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import React, { useContext, useEffect, useState } from "react";
import { AlertCircle, ChevronDown, Plus } from "react-feather";
import { DetailedBookingRows } from "@/components/Staffing/DetailedBookingRows";
import { WeekCell } from "@/components/Staffing/WeekCell";
import { useModal } from "@/hooks/useModal";
import { EditEngagementHourModal } from "./EditEngagementHourModal/EditEngagementHoursModal";
import { usePathname } from "next/navigation";
import { AddEngagementForm } from "./AddEngagementForm";
import {
  dayToWeek,
  getBookingTypeFromProjectState,
} from "./EditEngagementHourModal/utils";
import { useWeekSelectors } from "@/hooks/useWeekSelectors";
import { setDetailedBookingHours } from "./NewDetailedBookingRow";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { DateTime } from "luxon";
import Image from "next/image";

export default function ConsultantRows({
  consultant,
  numWorkHours,
}: {
  consultant: ConsultantReadModel;
  numWorkHours: number;
}) {
  const [currentConsultant, setCurrentConsultant] =
    useState<ConsultantReadModel>(consultant);
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [hoveredRowWeek, setHoveredRowWeek] = useState(-1);
  const [isAddStaffingHovered, setIsAddStaffingHovered] = useState(false);
  const [addNewRow, setAddNewRow] = useState(false);
  const { weekList, setSelectedWeekSpan } = useWeekSelectors();
  const { setIsDisabledHotkeys } = useContext(FilteredContext);
  const { selectedWeekFilter, weekSpan } =
    useContext(FilteredContext).activeFilters;

  const [newWeekList, setNewWeekList] = useState<DateTime[]>(weekList);

  useEffect(() => {
    setSelectedWeekSpan(consultant.bookings.length);
    setCurrentConsultant(consultant);
    if (selectedWeekFilter) {
      setNewWeekList([]);
      Array.from({ length: weekSpan }).map((_, index) => {
        setNewWeekList((old) => [
          ...old,
          DateTime.fromISO(
            `${selectedWeekFilter?.year}-W${selectedWeekFilter?.weekNumber}`,
          ).plus({ weeks: index }),
        ]);
      });
    }
  }, [consultant.bookings.length, consultant]);

  const columnCount = currentConsultant.bookings.length ?? 0;

  function toggleListElementVisibility() {
    setIsListElementVisible((old) => !old);
  }

  const {
    closeModal: closeChangeEngagementModal,
    openModal: openChangeEngagementModal,
    modalRef: changeEngagementModalRef,
  } = useModal({
    closeOnBackdropClick: false,
  });

  const [selectedProjectId, setSelectedProjectId] = useState<
    number | undefined
  >(undefined);
  const [selectedProject, setSelectedProject] = useState<
    ProjectWithCustomerModel | undefined
  >(undefined);

  const organisationUrl = usePathname().split("/")[1];

  useEffect(() => {
    async function fetchProject() {
      const url = `/${organisationUrl}/bemanning/api/projects?projectId=${selectedProjectId}`;

      try {
        const data = await fetch(url, {
          method: "get",
        });
        setSelectedProject((await data.json()) as ProjectWithCustomerModel);
      } catch (e) {
        console.error("Error updating staffing", e);
      }
    }
    selectedProjectId && fetchProject();
  }, [organisationUrl, selectedProjectId]);

  function openEngagementAndSetID(id: number) {
    setSelectedProjectId(id);
    openChangeEngagementModal();
  }

  function onCloseEngagementModal() {
    setSelectedProject(undefined);
    setSelectedProjectId(undefined);
  }

  function handleNewEngagementCancelled() {
    setAddNewRow(false);
    setIsDisabledHotkeys(false);
  }

  async function handleNewEngagement(project: ProjectWithCustomerModel) {
    setAddNewRow(false);
    setIsDisabledHotkeys(false);
    setSelectedProject(project);

    if (
      project !== undefined &&
      !currentConsultant.detailedBooking.some(
        (e) =>
          e.bookingDetails.projectId === project.projectId &&
          e.bookingDetails.type ===
            getBookingTypeFromProjectState(project?.bookingType),
      )
    ) {
      try {
        const body = {
          hours: 0,
          bookingType: getBookingTypeFromProjectState(project?.bookingType),
          organisationUrl: organisationUrl,
          consultantId: currentConsultant.id,
          bookingId: `${project?.projectId}`,
          startWeek: dayToWeek(newWeekList[0]),
        };
        const res = await setDetailedBookingHours(body);

        if (res) {
          const tempCurrentConsultant = { ...currentConsultant };

          const newDetailedBooking = res.detailedBooking.find(
            (e) => e.bookingDetails.projectId === project.projectId,
          );

          if (newDetailedBooking) {
            newDetailedBooking.hours = newWeekList.map((e) => {
              return { week: dayToWeek(e), hours: 0 };
            });
            tempCurrentConsultant.detailedBooking.push(newDetailedBooking);
            setCurrentConsultant(tempCurrentConsultant);
          }
        }
      } catch (e) {
        console.error("Error updating staffing", e);
      }
    }
  }

  function getAlert() {
    const dates = consultant.detailedBooking
      .filter((e) => e.bookingDetails.projectId > 0)
      .map((e) => e.bookingDetails.endDateAgreement);

    if (dates.some((e) => e === null)) {
      return <AlertCircle color="red" size={20} />;
    } else if (dates.length > 0) {
      const newestDate = dates.reduce((a, b) => {
        return new Date(a as string) < new Date(b as string) ? a : b;
      });

      const now = DateTime.now();
      const endDate = DateTime.fromISO(newestDate as string);
      if (endDate < now) {
        return <AlertCircle color="orange" size={20} />;
      } else {
        return null;
      }
    }
  }

  return (
    <>
      <tr
        className="h-[52px]"
        onMouseEnter={() => setIsRowHovered(true)}
        onMouseLeave={() => setIsRowHovered(false)}
      >
        <td
          className={`border-l-2 ${
            isListElementVisible
              ? "border-l-secondary"
              : isRowHovered
              ? "border-l-primary"
              : "border-l-primary/5"
          } `}
        >
          <button
            className={`p-2 rounded-lg ml-2 hover:bg-primary hover:bg-opacity-10 ${
              isListElementVisible && "rotate-180"
            }`}
            onClick={toggleListElementVisibility}
          >
            <ChevronDown className={`text-primary w-6 h-6`} />
          </button>
        </td>
        <td>
          <div className="flex gap-1 items-center">
            {getAlert()}
            <div className="flex flex-row align-center self-center gap-2">
              {consultant.imageThumbUrl ? (
                <Image
                  src={consultant.imageThumbUrl}
                  alt={consultant.name}
                  className="w-8 h-8 rounded-full self-center object-contain"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary"></div>
              )}
            </div>
            <div className="flex flex-col gap-1 ">
              <p
                className={`text-black text-start ${
                  isListElementVisible ? "normal-medium" : "normal"
                }`}
              >
                {currentConsultant.name}
              </p>
              <p className="xsmall text-black/75 text-start">
                {`${currentConsultant.yearsOfExperience} års erfaring`}
              </p>
            </div>
            {isListElementVisible && (
              <EditEngagementHourModal
                modalRef={changeEngagementModalRef}
                project={selectedProject}
                onClose={onCloseEngagementModal}
                numWorkHours={numWorkHours}
              />
            )}
          </div>
        </td>
        {currentConsultant.bookings.map((b, index) => (
          <WeekCell
            key={index}
            bookedHoursPerWeek={b}
            isListElementVisible={isListElementVisible}
            setIsListElementVisible={setIsListElementVisible}
            consultant={currentConsultant}
            setHoveredRowWeek={setHoveredRowWeek}
            hoveredRowWeek={hoveredRowWeek}
            columnCount={columnCount}
            isLastCol={index == currentConsultant.bookings.length - 1}
            isSecondLastCol={index == currentConsultant.bookings.length - 2}
            numWorkHours={numWorkHours}
          />
        ))}
      </tr>
      {isListElementVisible &&
        currentConsultant.detailedBooking &&
        currentConsultant.detailedBooking.map((db, index) => (
          <DetailedBookingRows
            key={index}
            consultant={currentConsultant}
            detailedBooking={db}
            openEngagementAndSetID={openEngagementAndSetID}
            numWorkHours={numWorkHours}
          />
        ))}
      {isListElementVisible && addNewRow && (
        <tr>
          <td
            className={`border-l-2 ${
              isListElementVisible
                ? "border-l-secondary"
                : isRowHovered
                ? "border-l-primary"
                : "border-l-primary/5"
            } `}
          ></td>
          <td>
            <AddEngagementForm
              closeEngagementModal={handleNewEngagement}
              consultant={currentConsultant}
              onCancel={handleNewEngagementCancelled}
            />
          </td>
        </tr>
      )}

      {isListElementVisible && (
        <tr>
          <td
            className={`border-l-2 ${
              isListElementVisible
                ? "border-l-secondary"
                : isRowHovered
                ? "border-l-primary"
                : "border-l-primary/5"
            } `}
          ></td>
          <td>
            {!addNewRow && (
              <button
                onClick={() => {
                  setAddNewRow(true);
                  setIsDisabledHotkeys(true);
                }}
                className="flex flex-row items-center min-w-max gap-2 h-[52px]"
                onMouseEnter={() => setIsAddStaffingHovered(true)}
                onMouseLeave={() => setIsAddStaffingHovered(false)}
              >
                <span
                  className={`w-8 h-8 flex justify-center items-center rounded bg-primary/0 ${
                    isAddStaffingHovered && "bg-primary/10"
                  }`}
                >
                  <Plus size={16} className="text-primary" />
                </span>

                <p className="small text-primary">Legg til bemanning</p>
              </button>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
