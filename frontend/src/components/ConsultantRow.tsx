"use client";
import {
  BookedHoursPerWeek,
  BookingType,
  Consultant,
  DetailedBooking,
  WeeklyHours,
} from "@/types";
import { ReactElement, useContext, useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  ChevronDown,
  Coffee,
  FileText,
  Minus,
  Moon,
  Plus,
  Sun,
} from "react-feather";
import InfoPill, { InfoPillVariant } from "./InfoPill";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { usePathname, useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useModal } from "@/hooks/useModal";
import EasyModal from "./EasyModal";

export default function ConsultantRows({
  consultant,
}: {
  consultant: Consultant;
}) {
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [hoveredRowWeek, setHoveredRowWeek] = useState(-1);

  const columnCount = consultant.bookings.length ?? 0;

  const { openModal, modalRef } = useModal();

  function toggleListElementVisibility() {
    setIsListElementVisible(!isListElementVisible);
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
          <div className="flex flex-col gap-1 ">
            <p
              className={`text-black text-start ${
                isListElementVisible ? "normal-medium" : "normal"
              }`}
            >
              {consultant.name}
            </p>
            <p className="xsmall text-black/75 text-start">
              {`${consultant.yearsOfExperience} års erfaring`}
            </p>
          </div>
        </td>
        {consultant.bookings?.map((b, index) => (
          <WeekCell
            key={index}
            bookedHoursPerWeek={b}
            isListElementVisible={isListElementVisible}
            setIsListElementVisible={setIsListElementVisible}
            consultant={consultant}
            setHoveredRowWeek={setHoveredRowWeek}
            hoveredRowWeek={hoveredRowWeek}
            columnCount={columnCount}
            isLastCol={index == consultant.bookings.length - 1}
            isSecondLastCol={index == consultant.bookings.length - 2}
          />
        ))}
      </tr>
      {isListElementVisible &&
        consultant.detailedBooking &&
        consultant.detailedBooking.map((db, index) => (
          <DetailedBookingRows
            key={index}
            consultant={consultant}
            detailedBooking={db}
          />
        ))}
      {isListElementVisible && (
        <tr>
          <td className={`${"border-l-secondary border-l-2"}`}></td>
          <td>
            <div className="flex flex-row items-center gap-2">
              <button
                className="w-8 h-8 flex justify-center items-center rounded bg-primary/0 hover:bg-primary/10"
                onClick={openModal}
              >
                <Plus size={16} className="text-primary" />
              </button>
              <EasyModal
                modalRef={modalRef}
                title={"Nytt Engasjement"}
                onClose={() => console.log("onClose")}
                showCloseButton
              >
                <div className="h-[300px]"></div>
              </EasyModal>
              <p className="small text-primary">Legg til bemanning</p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function getColorByStaffingType(type: BookingType): string {
  switch (type) {
    case BookingType.Offer:
      return "bg-offer";
    case BookingType.Booking:
      return "bg-primary/[3%]";
    case BookingType.Vacation:
      return "bg-vacation";
    case BookingType.PlannedAbsence:
      return "bg-absence";
    case BookingType.Available:
      return "bg-available";
    default:
      return "";
  }
}

function getIconByBookingType(type: BookingType): ReactElement {
  switch (type) {
    case BookingType.Offer:
      return <FileText size={16} className="text-primary_darker" />;
    case BookingType.Booking:
      return <Briefcase size={16} className="text-black" />;
    case BookingType.Vacation:
      return <Sun size={16} className="text-vacation_darker" />;
    case BookingType.PlannedAbsence:
      return <Moon size={16} className="text-absence_darker" />;
    case BookingType.Available:
      return <Coffee size={16} className="text-available_darker" />;
    default:
      return <></>;
  }
}

function WeekCell(props: {
  bookedHoursPerWeek: BookedHoursPerWeek;
  isListElementVisible: boolean;
  setIsListElementVisible: Function;
  consultant: Consultant;
  setHoveredRowWeek: (number: number) => void;
  hoveredRowWeek: number;
  columnCount: number;
  isLastCol: boolean;
  isSecondLastCol: boolean;
}) {
  const {
    bookedHoursPerWeek: bookedHoursPerWeek,
    isListElementVisible,
    setIsListElementVisible,
    consultant,
    setHoveredRowWeek,
    hoveredRowWeek,
    columnCount,
    isLastCol,
    isSecondLastCol,
  } = props;

  let pillNumber = 0;

  if (bookedHoursPerWeek.bookingModel.totalOffered > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalOverbooking > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalPlannedAbstences > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalVacationHours > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalSellableTime > 0) {
    pillNumber++;
  }

  return (
    <td
      key={bookedHoursPerWeek.weekNumber}
      className={`h-[52px] ${isLastCol ? "py-0.5 pl-0.5" : "p-0.5"}`}
    >
      <div
        className={`flex flex-col gap-1 p-2 justify-end rounded w-full h-full relative border border-transparent hover:border-primary/50 hover:cursor-pointer ${
          bookedHoursPerWeek.bookingModel.totalOverbooking > 0
            ? `bg-black text-white`
            : bookedHoursPerWeek.bookingModel.totalSellableTime > 0
            ? `bg-available/50`
            : `bg-primary/[3%]`
        }`}
        onMouseEnter={() => setHoveredRowWeek(bookedHoursPerWeek.weekNumber)}
        onMouseLeave={() => setHoveredRowWeek(-1)}
        onClick={() => setIsListElementVisible(!isListElementVisible)}
      >
        {hoveredRowWeek != -1 &&
          hoveredRowWeek == bookedHoursPerWeek.weekNumber && (
            <HoveredWeek
              hoveredRowWeek={hoveredRowWeek}
              consultant={consultant}
              isLastCol={isLastCol}
              isSecondLastCol={isSecondLastCol}
              columnCount={columnCount}
            />
          )}
        <div className="flex flex-row justify-end gap-1">
          {bookedHoursPerWeek.bookingModel.totalOffered > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalOffered.toFixed(1)}
              colors="bg-offer text-primary_darker border-primary_darker"
              icon={<FileText size="12" />}
              variant={getInfopillVariantByColumnCount(columnCount)}
            />
          )}
          {bookedHoursPerWeek.bookingModel.totalSellableTime > 0 &&
            getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
              <InfoPill
                text={bookedHoursPerWeek.bookingModel.totalSellableTime.toFixed(
                  1,
                )}
                colors="bg-available text-available_darker border-available_darker"
                icon={<Coffee size="12" />}
                variant={getInfopillVariantByColumnCount(columnCount)}
              />
            )}
          {bookedHoursPerWeek.bookingModel.totalVacationHours > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalVacationHours.toFixed(
                1,
              )}
              colors="bg-vacation text-vacation_darker border-vacation_darker"
              icon={<Sun size="12" />}
              variant={getInfopillVariantByColumnCount(columnCount)}
            />
          )}
          {bookedHoursPerWeek.bookingModel.totalOverbooking > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalOverbooking.toFixed(1)}
              colors="bg-overbooked_darker text-white border-white"
              icon={<AlertTriangle size="12" />}
              variant={getInfopillVariantByColumnCount(columnCount)}
            />
          )}
        </div>
        <p
          className={`text-right ${
            isListElementVisible ? "normal-medium" : "normal"
          }`}
        >
          {bookedHoursPerWeek.bookingModel.totalBillable}
        </p>
      </div>
    </td>
  );
}

function isWeekBookingZeroHours(
  detailedBooking: DetailedBooking,
  hoveredRowWeek: number,
): boolean {
  return (
    detailedBooking.hours.filter(
      (weekHours) =>
        weekHours.week % 100 == hoveredRowWeek && weekHours.hours != 0,
    ).length == 0
  );
}

function HoveredWeek(props: {
  hoveredRowWeek: number;
  consultant: Consultant;
  isLastCol: boolean;
  isSecondLastCol: boolean;
  columnCount: number;
}) {
  const {
    hoveredRowWeek,
    consultant,
    isLastCol,
    isSecondLastCol,
    columnCount,
  } = props;

  const nonZeroHoursDetailedBookings = consultant.detailedBooking.filter(
    (d) => !isWeekBookingZeroHours(d, hoveredRowWeek),
  );

  const freeTime = consultant.bookings.find(
    (b) => b.weekNumber == hoveredRowWeek,
  )?.bookingModel.totalSellableTime;

  if (freeTime && freeTime > 0) {
    nonZeroHoursDetailedBookings.push({
      bookingDetails: {
        type: BookingType.Available,
        projectName: "",
        customerName: "Ledig Tid",
        projectId: "",
      },
      hours: [
        {
          id: 0,
          week: hoveredRowWeek,
          hours:
            consultant.bookings.find((b) => b.weekNumber == hoveredRowWeek)
              ?.bookingModel.totalSellableTime || 0,
        },
      ],
    });
  }

  return (
    <>
      <div
        className={`rounded-lg bg-white gap-3 min-w-[222px] p-3 shadow-xl absolute bottom-full mb-2 flex flex-col z-20 pointer-events-none ${
          isLastCol || (isSecondLastCol && columnCount >= 26)
            ? "right-0 "
            : "left-1/2 -translate-x-1/2"
        } ${nonZeroHoursDetailedBookings.length == 0 && "hidden"}`}
      >
        {nonZeroHoursDetailedBookings.map((detailedBooking, index) => (
          <div
            key={index}
            className={`flex flex-row gap-2 justify-between items-center
            ${
              index < nonZeroHoursDetailedBookings.length - 1 &&
              "pb-3 border-b border-black/10"
            }`}
          >
            <div className="flex flex-row gap-2 items-center">
              <div
                className={`h-8 w-8 flex justify-center align-middle items-center rounded ${getColorByStaffingType(
                  detailedBooking.bookingDetails.type,
                )}`}
              >
                {getIconByBookingType(detailedBooking.bookingDetails.type)}
              </div>
              <div className="flex flex-col">
                <p
                  className={`xsmall text-black/75 ${
                    !(
                      detailedBooking.bookingDetails.type ==
                        BookingType.Offer ||
                      detailedBooking.bookingDetails.type == BookingType.Booking
                    ) && "hidden"
                  }`}
                >
                  {detailedBooking.bookingDetails.projectName}
                </p>
                <p className="small text-black whitespace-nowrap">
                  {detailedBooking.bookingDetails.customerName}
                </p>
              </div>
            </div>
            <p className="small text-black/75">
              {
                detailedBooking.hours.find(
                  (hour) => hour.week % 100 == hoveredRowWeek,
                )?.hours
              }
            </p>
          </div>
        ))}
      </div>
      <div
        className={`absolute bottom-full mb-[2px] left-1/2 -translate-x-1/2 flex items-center z-50 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white border-r-[8px] border-r-transparent pointer-events-none ${
          nonZeroHoursDetailedBookings.length == 0 && "hidden"
        }`}
      ></div>
    </>
  );
}

function DetailedBookingRows(props: {
  consultant: Consultant;
  detailedBooking: DetailedBooking;
}) {
  const { consultant, detailedBooking } = props;

  return (
    <tr
      key={`${consultant.id}-details-${detailedBooking.bookingDetails.customerName}`}
      className="h-fit"
    >
      <td className="border-l-secondary border-l-2"></td>
      <td className="flex flex-row gap-2 justify-start p-0.5">
        <div
          className={`h-8 w-8 flex justify-center align-middle items-center rounded ${getColorByStaffingType(
            detailedBooking.bookingDetails.type,
          )}`}
        >
          {getIconByBookingType(detailedBooking.bookingDetails.type)}
        </div>
        <div className="flex flex-col justify-center">
          <p
            className={`xsmall text-black/75 whitespace-nowrap text-ellipsis overflow-x-hidden max-w-[145px] ${
              !(
                detailedBooking.bookingDetails.type == BookingType.Offer ||
                detailedBooking.bookingDetails.type == BookingType.Booking
              ) && "hidden"
            }`}
          >
            {detailedBooking.bookingDetails.projectName}
          </p>
          <p className="text-black text-start small">
            {detailedBooking.bookingDetails.customerName}
          </p>
        </div>
      </td>
      {detailedBooking.hours
        .sort((a, b) => a.week - b.week)
        .map((hours) => (
          <DetailedBookingCell
            key={`${consultant.id}-details-${detailedBooking.bookingDetails.projectName}-${hours.week}`}
            detailedBooking={detailedBooking}
            detailedBookingHours={hours}
            consultant={consultant}
          />
        ))}
    </tr>
  );
}

async function setDetailedBookingHours(
  bookingId: number,
  hours: number,
  bookingType: string,
  organisationName: string,
  router: AppRouterInstance,
  consultantId: string,
  engagementId: string,
  week: number,
  setCellId: (cellId: number) => void,
) {
  const url =
    bookingId === 0
      ? `/${organisationName}/bemanning/api/updateHours?hours=${hours}&bookingType=${bookingType}&consultantID=${consultantId}&engagementID=${engagementId}&selectedWeek=${week}`
      : `/${organisationName}/bemanning/api/updateHours/${bookingId}?hours=${hours}&bookingType=${bookingType}`;

  try {
    const data = await fetch(url, {
      method: bookingId === 0 ? "post" : "put",
    });

    const res = await data.json();

    if (bookingId === 0) {
      setCellId(res);
    }

    router.refresh();
  } catch (e) {
    console.error("Error updating staffing", e);
  }
}

function DetailedBookingCell({
  detailedBooking,
  detailedBookingHours,
  consultant,
}: {
  detailedBooking: DetailedBooking;
  detailedBookingHours: WeeklyHours;
  consultant: Consultant;
}) {
  const [hours, setHours] = useState(detailedBookingHours.hours);
  const [cellId, setCellId] = useState(detailedBookingHours.id);
  const [isChangingHours, setIsChangingHours] = useState(false);
  const { setIsDisabledHotkeys } = useContext(FilteredContext);
  const router = useRouter();

  const organisationName = usePathname().split("/")[1];
  const numWeeks = detailedBooking.hours.length;

  function updateHours(hourlyChange?: number) {
    setIsDisabledHotkeys(false);
    setDetailedBookingHours(
      cellId,
      hours + (hourlyChange || 0),
      detailedBooking.bookingDetails.type,
      organisationName,
      router,
      consultant.id,
      detailedBooking.bookingDetails.projectId,
      detailedBookingHours.week,
      setCellId,
    );
  }

  return (
    <td className="h-8 p-0.5">
      <div
        className={`flex flex-row justify-center items-center rounded px-3 py-2 ${getColorByStaffingType(
          detailedBooking.bookingDetails.type ?? BookingType.Offer,
        )} ${hours == 0 && "bg-opacity-30"}`}
      >
        {isChangingHours && numWeeks <= 8 && (
          <button
            className="p-2 rounded-full hover:bg-primary/10 hidden lg:flex"
            onClick={() => {
              setHours(hours - 7.5), updateHours(-7.5);
            }}
          >
            <Minus className="w-4 h-4" />
          </button>
        )}

        <input
          type="number"
          min="0"
          step="7.5"
          value={hours}
          disabled={detailedBooking.bookingDetails.type == BookingType.Vacation}
          onChange={(e) => setHours(Number(e.target.value))}
          onFocus={() => {
            setIsDisabledHotkeys(true), setIsChangingHours(true);
          }}
          onBlur={() => updateHours()}
          className={`small-medium rounded w-full py-2 bg-transparent focus:outline-none min-w-[24px] ${
            isChangingHours && numWeeks <= 8 ? "text-center" : "text-right"
          } `}
        ></input>
        {isChangingHours && numWeeks <= 8 && (
          <button
            className="p-2 rounded-full hover:bg-primary/10 hidden lg:flex"
            onClick={() => {
              setHours(hours + 7.5), updateHours(7.5);
            }}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </td>
  );
}

function getInfopillVariantByColumnCount(count: number): InfoPillVariant {
  switch (true) {
    case 26 <= count:
      return "narrow";
    case 12 <= count && count < 26:
      return "medium";
    case count < 12:
      return "wide";
    default:
      return "wide";
  }
}
