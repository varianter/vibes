"use client";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import React, { useContext, useEffect, useState } from "react";
import { Plus } from "react-feather";
import { DetailedBookingRows } from "@/components/Staffing/DetailedBookingRows";
import { useModal } from "@/hooks/useModal";
import { usePathname } from "next/navigation";
import {
  dayToWeek,
  getBookingTypeFromProjectState,
} from "../Staffing/EditEngagementHourModal/utils";
import { useWeekSelectors } from "@/hooks/useWeekSelectors";
import { setDetailedBookingHours } from "@/components/Staffing/DetailedBookingRows";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { DateTime } from "luxon";
import Image from "next/image";
import { MonthCell } from "./MonthCell";
import {
  bookingForMonth,
  transformToMonthlyData,
} from "./TransformWeekDataToMonth";

export default function ForecastRows({
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
  const { setIsDisabledHotkeys } = useContext(FilteredContext);
  const { selectedWeekFilter } = useContext(FilteredContext).activeFilters;

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
  const bookingsPerMonth = transformToMonthlyData(consultant.bookings);

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
          {/* //utkommentert foreløpig, kan slettes om vi ikke skal ha mulighet til å utvide raden <button
            className={`p-2 rounded-lg ml-2 hover:bg-primary hover:bg-opacity-10 ${
              isListElementVisible && "rotate-180"
            }`}
            onClick={toggleListElementVisibility}
          >
            <ChevronDown className={`text-primary w-6 h-6`} />
          </button> */}
        </td>
        <td>
          <div className="flex justify-start gap-1 items-center">
            <div className="flex flex-row justify-center self-center gap-2 w-3/12">
              {consultant.imageThumbUrl ? (
                <Image
                  src={consultant.imageThumbUrl}
                  alt={consultant.name}
                  className="w-10 h-10 rounded-md self-center object-contain"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="w-10 h-10 rounded-md bg-primary"></div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-7/12 ">
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
          </div>
        </td>
        {currentConsultant.forecasts?.map((b, index) => (
          <MonthCell
            bookedHoursPerMonth={bookingForMonth(
              bookingsPerMonth,
              b.month,
              b.year,
            )}
            key={index}
            hasBeenEdited={b.hasBeenChanged}
            forecastValue={b.forecastValue + b.valueAddedManually}
            month={b.month}
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
