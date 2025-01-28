"use client";
import {
  ConsultantReadModel,
  ForecastReadModel,
  ProjectWithCustomerModel,
  SingleConsultantReadModel,
} from "@/api-types";
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
import Image from "next/image";
import { MonthCell } from "./MonthCell";
import {
  bookingForMonth,
  transformToMonthlyData,
} from "./TransformWeekDataToMonth";

export default function ForecastRows({
  forecast,
  numWorkHours,
}: {
  forecast: ForecastReadModel;
  numWorkHours: number;
}) {
  const [currentForecast, setCurrentForecast] =
    useState<ForecastReadModel>(forecast);
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [hoveredRowWeek, setHoveredRowWeek] = useState(-1);
  const [isAddStaffingHovered, setIsAddStaffingHovered] = useState(false);
  const [addNewRow, setAddNewRow] = useState(false);
  const { setIsDisabledHotkeys } = useContext(FilteredContext);
  const { selectedWeekFilter } = useContext(FilteredContext).activeFilters;

  const columnCount = forecast.bookings.length ?? 0;

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
  const bookingsPerMonth = forecast.bookings;

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
    <tr
      className="h-[52px]"
      onMouseEnter={() => setIsRowHovered(true)}
      onMouseLeave={() => setIsRowHovered(false)}
    >
      {/* <td
          className={`border-l-2 ${
            isListElementVisible
              ? "border-l-secondary"
              : isRowHovered
              ? "border-l-primary"
              : "border-l-primary/5"
          } `}
        >
          //utkommentert foreløpig, kan slettes om vi ikke skal ha mulighet til å utvide raden <button
            className={`p-2 rounded-lg ml-2 hover:bg-primary hover:bg-opacity-10 ${
              isListElementVisible && "rotate-180"
            }`}
            onClick={toggleListElementVisibility}
          >
            <ChevronDown className={`text-primary w-6 h-6`} />
          </button>
        </td> */}
      <td>
        <div className="flex justify-start gap-1 items-center">
          <div className="flex flex-row justify-center self-center gap-2 w-3/12">
            {false ? (
              <Image
                src={""}
                alt=""
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
              {currentForecast.consultant.name}
            </p>
            <p className="xsmall text-black/75 text-start">
              {`${currentForecast.consultant.yearsOfExperience} års erfaring`}
            </p>
          </div>
        </div>
      </td>
      {currentForecast.forecasts?.map((f, index) => {
        const hasBeenEdited = f.calculatedPercentage != f.displayedPercentage;
        return (
          <MonthCell
            bookedHoursInMonth={
              bookingForMonth(currentForecast.bookings, f.month)!
            }
            key={index}
            hasBeenEdited={hasBeenEdited}
            forecastValue={f.calculatedPercentage}
            month={Number.parseInt(f.month.split("-")[1])}
            consultant={mapToConsultantReadModel(currentForecast)}
            setHoveredRowWeek={setHoveredRowWeek}
            hoveredRowWeek={hoveredRowWeek}
            columnCount={columnCount}
            isLastCol={index == currentForecast.bookings.length - 1}
            isSecondLastCol={index == currentForecast.bookings.length - 2}
            numWorkHours={numWorkHours}
          />
        );
      })}
    </tr>
  );
}

function mapToConsultantReadModel(f: ForecastReadModel): ConsultantReadModel {
  return {
    ...f.consultant,
    bookings: [],
    detailedBooking: [],
    isOccupied: false,
    startDate: new Date(f.consultant.startDate),
    endDate: new Date(f.consultant.endDate),
  };
}
