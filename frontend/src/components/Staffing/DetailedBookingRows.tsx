import {
  AgreementStatus,
  BookingType,
  ConsultantReadModel,
  DetailedBooking,
  EngagementState,
  WeeklyHours,
} from "@/api-types";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  getColorByStaffingType,
  getIconByBookingType,
  updateProjects,
  upsertConsultantBooking,
} from "@/components/Staffing/helpers/utils";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { usePathname } from "next/navigation";
import {
  Edit3,
  Minus,
  Plus,
  ThumbsDown,
  ThumbsUp,
  AlertCircle,
  Loader,
  CheckCircle,
  Icon,
} from "react-feather";
import { updateBookingHoursBody, updateProjectStateBody } from "@/types";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { parseYearWeekFromString } from "@/data/urlUtils";
import Link from "next/link";

async function updateProjectState(
  organisationName: string,
  detailedBooking: DetailedBooking,
  state: EngagementState,
) {
  const url = `/${organisationName}/bemanning/api/projects/updateState`;
  const yearWeek = parseYearWeekFromString(
    detailedBooking.hours[0].week.toString() || undefined,
  );

  const body: updateProjectStateBody = {
    engagementId: `${detailedBooking.bookingDetails.projectId}`,
    projectState: state,
    isBillable: false,
    startWeek: yearWeek?.weekNumber || 0,
    startYear: yearWeek?.year || 0,
    weekSpan: detailedBooking.hours.length,
  };

  try {
    const data = await fetch(url, {
      method: "put",
      body: JSON.stringify(body),
    });
    return (await data.json()) as ConsultantReadModel[];
  } catch (e) {
    console.error("Error updating projectState", e);
  }
}

export function DetailedBookingRows(props: {
  consultant: ConsultantReadModel;
  detailedBooking: DetailedBooking;
  openEngagementAndSetID: (id: number) => void;
  numWorkHours: number;
}) {
  const colors: {
    color: string;
    text: string;
    icon: Icon;
    status: AgreementStatus;
  }[] = [
    {
      color: "green",
      text: "Avtale aktiv",
      icon: CheckCircle,
      status: AgreementStatus.Active,
    },
    {
      color: "red",
      text: "Ingen avtaler funnet",
      icon: AlertCircle,
      status: AgreementStatus.None,
    },
    {
      color: "orange",
      text: "Avtale utgått",
      icon: AlertCircle,
      status: AgreementStatus.Expired,
    },
  ];
  const { setConsultants } = useContext(FilteredContext);

  const { consultant, detailedBooking, openEngagementAndSetID, numWorkHours } =
    props;
  const [hourDragValue, setHourDragValue] = useState<number | undefined>(
    undefined,
  );
  const [startDragWeek, setStartDragWeek] = useState<number | undefined>(
    undefined,
  );
  const [currentDragWeek, setCurrentDragWeek] = useState<number | undefined>(
    undefined,
  );
  const [alert, setAlertColor] = useState<
    { color: string; text: string; icon: Icon } | undefined
  >(undefined);

  const [editOfferDropdownIsOpen, setEditOfferDropdownIsOpen] = useState(false);
  const menuRef = useRef(null);

  const organisationName = usePathname().split("/")[1];

  useOutsideClick(menuRef, () => {
    if (editOfferDropdownIsOpen) setEditOfferDropdownIsOpen(false);
  });

  function changeState(state: EngagementState) {
    updateProjectState(organisationName, detailedBooking, state).then((res) => {
      setConsultants((old) => [
        // Use spread to make a new list, forcing a re-render
        ...updateProjects(old, res),
      ]);
    });
  }

  useEffect(() => {
    getColorIcon();
  }, []);

  async function getColorIcon() {
    const status = detailedBooking.bookingDetails?.agreementStatus;
    if (status) {
      const color = colors.find((c) => AgreementStatus[c.status] === status);
      setAlertColor(color);
    }
  }

  return (
    <tr
      key={`${consultant.id}-details-${detailedBooking.bookingDetails.customerName}`}
      className="h-fit"
    >
      <td className=" border-l-secondary border-l-2 w-full">
        <div className="relative flex justify-center group items-center">
          {alert && <alert.icon color={alert.color} />}
          <div className="absolute left-full ml-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 w-max z-30">
            {alert?.text}
            <div className="absolute top-1/2 transform -translate-y-1/2 left-0 ml-[-8px] w-0 h-0 border-r-8 border-r-black border-y-8 border-y-transparent border-l-0"></div>
          </div>
        </div>
      </td>
      <td className="flex flex-row gap-2 justify-start relative" ref={menuRef}>
        <Link
          href={`prosjekt/${detailedBooking.bookingDetails.projectId}`}
          className={`flex items-center rounded`}
        >
          <div className="flex flex-row items-center gap-3 justify-end">
            <div
              className={`min-w-8 w-8 h-8 flex justify-center items-center rounded ${getColorByStaffingType(
                detailedBooking.bookingDetails.type,
              )}`}
            >
              {getIconByBookingType(detailedBooking.bookingDetails.type, 20)}
            </div>
            <div className="flex flex-col justify-center text-left hover:underline">
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
          </div>
        </Link>

        {/* For offer dropdown open*/}
        <div
          className={` z-50 bg-white flex flex-col p-1 absolute top-full mt-1 rounded-lg dropdown-shadow ${
            !editOfferDropdownIsOpen && "hidden"
          }`}
        >
          <p className="xsmall px-3 py-2 text-black">
            Hvordan endte dette tilbudet?
          </p>
          <button
            className="hover:bg-primary/10 px-3 py-2 rounded flex flex-row gap-3 items-center "
            onClick={() => changeState(EngagementState.Order)}
          >
            <ThumbsUp className="h-6 w-6 text-primary" />
            <p className="h-6 flex items-center normal-semibold text-primary">
              Vunnet
            </p>
          </button>
          <button
            className="hover:bg-primary/10 px-3 py-2 rounded flex flex-row gap-3 items-center"
            onClick={() => changeState(EngagementState.Lost)}
          >
            <ThumbsDown className="h-6 w-6 text-primary" />
            <p className="h-6 flex items-center normal-semibold text-primary">
              Tapt
            </p>
          </button>
          <div className="border-b border-primary/10 my-1" />
          <button
            className="hover:bg-primary/10 px-3 py-2 rounded flex flex-row gap-3 items-center"
            onClick={() =>
              openEngagementAndSetID(detailedBooking.bookingDetails.projectId)
            }
          >
            <Edit3 className="h-6 w-6 text-primary" />
            <p className="h-6 flex items-center normal-semibold text-primary whitespace-nowrap">
              Rediger engasjement
            </p>
          </button>
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
            hourDragValue={hourDragValue}
            setHourDragValue={setHourDragValue}
            currentDragWeek={currentDragWeek}
            startDragWeek={startDragWeek}
            setStartDragWeek={setStartDragWeek}
            setCurrentDragWeek={setCurrentDragWeek}
            numWorkHours={numWorkHours}
          />
        ))}
    </tr>
  );
}

interface updateBookingHoursProps {
  hours: number;
  bookingType: BookingType;
  organisationUrl: string;
  consultantId: number;
  bookingId: string;
  startWeek: number;
  endWeek?: number;
}

export async function setDetailedBookingHours(props: updateBookingHoursProps) {
  const url = `/${props.organisationUrl}/bemanning/api/updateHours`;
  const body: updateBookingHoursBody = {
    hours: props.hours,
    bookingType: props.bookingType,
    consultantId: `${props.consultantId}`,
    projectId: props.bookingId,
    startWeek: props.startWeek,
    endWeek: props.endWeek,
  };

  try {
    const data = await fetch(url, {
      method: "put",
      body: JSON.stringify(body),
    });
    return (await data.json()) as ConsultantReadModel;
  } catch (e) {
    console.error("Error updating staffing", e);
  }
}

function DetailedBookingCell({
  detailedBooking,
  detailedBookingHours,
  consultant,
  hourDragValue,
  setHourDragValue,
  currentDragWeek,
  startDragWeek,
  setStartDragWeek,
  setCurrentDragWeek,
  numWorkHours,
}: {
  detailedBooking: DetailedBooking;
  detailedBookingHours: WeeklyHours;
  consultant: ConsultantReadModel;
  hourDragValue: number | undefined;
  currentDragWeek: number | undefined;
  startDragWeek: number | undefined;
  setHourDragValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  setStartDragWeek: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentDragWeek: React.Dispatch<React.SetStateAction<number | undefined>>;
  numWorkHours: number;
}) {
  const { setConsultants } = useContext(FilteredContext);
  const [hours, setHours] = useState(detailedBookingHours.hours);
  const [isChangingHours, setIsChangingHours] = useState(false);
  const [oldHours, setOldHours] = useState(detailedBookingHours.hours);
  const { setIsDisabledHotkeys } = useContext(FilteredContext);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const organisationName = usePathname().split("/")[1];
  const numWeeks = detailedBooking.hours.length;

  const workHoursPerDay = numWorkHours / 5;

  function updateSingularHours() {
    setIsDisabledHotkeys(false);
    if (oldHours != hours && hourDragValue == undefined) {
      setDetailedBookingHours({
        hours: hours,
        bookingType: detailedBooking.bookingDetails.type,
        organisationUrl: organisationName,
        consultantId: consultant.id,
        bookingId: `${detailedBooking.bookingDetails.projectId}`,
        startWeek: detailedBookingHours.week,
      }).then((res) => {
        setConsultants((old) => [
          // Use spread to make a new list, forcing a re-render
          ...upsertConsultantBooking(old, res),
        ]);
      });
    }
  }

  useEffect(() => {
    setHours(detailedBookingHours.hours);
    setOldHours(detailedBookingHours.hours);
  }, [detailedBookingHours.hours]);

  function updateDragHours() {
    setIsDisabledHotkeys(false);
    if (
      hourDragValue == undefined ||
      startDragWeek == undefined ||
      currentDragWeek == undefined ||
      startDragWeek == currentDragWeek
    ) {
      return;
    }
    setDetailedBookingHours({
      hours: hourDragValue,
      bookingType: detailedBooking.bookingDetails.type,
      organisationUrl: organisationName,
      consultantId: consultant.id,
      bookingId: `${detailedBooking.bookingDetails.projectId}`,
      startWeek: startDragWeek,
      endWeek: currentDragWeek,
    }).then((res) => {
      setConsultants((old) => [
        // Use spread to make a new list, forcing a re-render
        ...upsertConsultantBooking(old, res),
      ]);
    });
  }

  function checkIfMarked() {
    if (startDragWeek == undefined || currentDragWeek == undefined)
      return false;
    if (startDragWeek > currentDragWeek) {
      return (
        detailedBookingHours.week >= currentDragWeek &&
        detailedBookingHours.week <= startDragWeek
      );
    }
    return (
      detailedBookingHours.week <= currentDragWeek &&
      detailedBookingHours.week >= startDragWeek
    );
  }

  return (
    <td className="h-8 p-0.5">
      <div
        className={`flex flex-row justify-center items-center rounded px-1 border  ${getColorByStaffingType(
          detailedBooking.bookingDetails.type ?? BookingType.Offer,
        )} ${hours == 0 && "bg-opacity-30"} ${
          isInputFocused || checkIfMarked()
            ? "border-primary"
            : "border-transparent hover:border-primary/30"
        }`}
        onMouseEnter={() => {
          setIsChangingHours(true);
        }}
        onMouseLeave={() => {
          setIsChangingHours(false);
          !isInputFocused && updateSingularHours();
        }}
      >
        {isChangingHours &&
          numWeeks <= 12 &&
          detailedBooking.bookingDetails.type != BookingType.Vacation &&
          detailedBooking.bookingDetails.type !=
            BookingType.NotStartedOrQuit && (
            <button
              tabIndex={-1}
              disabled={hours == 0}
              className={`my-1 p-1 rounded-full ${
                hours > 0 && "hover:bg-primary/10"
              }  hidden ${numWeeks <= 8 && "md:flex"} ${
                numWeeks <= 12 && "lg:flex"
              }  `}
              onClick={() => {
                setHours(Math.max(hours - workHoursPerDay, 0));
              }}
            >
              <Minus
                className={`w-4 h-4 text-primary ${
                  hours == 0 && "text-primary/50"
                }`}
              />
            </button>
          )}

        <input
          ref={inputRef}
          type="number"
          min="0"
          step={workHoursPerDay}
          value={hours}
          draggable={true}
          disabled={
            detailedBooking.bookingDetails.type == BookingType.Vacation ||
            detailedBooking.bookingDetails.type == BookingType.NotStartedOrQuit
          }
          onChange={(e) =>
            hourDragValue == undefined && setHours(Number(e.target.value))
          }
          onFocus={(e) => {
            e.target.select();
            setIsInputFocused(true);
            setIsDisabledHotkeys(true);
          }}
          onBlur={() => {
            updateSingularHours();
            setIsInputFocused(false);
            setIsDisabledHotkeys(false);
          }}
          onDragStart={() => {
            setHourDragValue(hours),
              setStartDragWeek(detailedBookingHours.week);
          }}
          onDragEnterCapture={() =>
            setCurrentDragWeek(detailedBookingHours.week)
          }
          onDragEnd={() => {
            updateDragHours();
            setHourDragValue(undefined);
            setCurrentDragWeek(undefined);
            setStartDragWeek(undefined);
          }}
          className={`small-medium rounded w-full py-2 bg-transparent focus:outline-none min-w-[24px] ${
            isChangingHours && numWeeks <= 12 ? "text-center" : "text-right"
          } ${hours == 0 && "text-black/75"} `}
        ></input>
        {isChangingHours &&
          numWeeks <= 12 &&
          detailedBooking.bookingDetails.type != BookingType.Vacation &&
          detailedBooking.bookingDetails.type !=
            BookingType.NotStartedOrQuit && (
            <button
              tabIndex={-1}
              className={`my-1 p-1 rounded-full hover:bg-primary/10 hidden ${
                numWeeks <= 8 && "md:flex"
              } ${numWeeks <= 12 && "lg:flex"} `}
              onClick={() => {
                setHours(hours + workHoursPerDay);
              }}
            >
              <Plus className="w-4 h-4 text-primary" />
            </button>
          )}
      </div>
    </td>
  );
}
