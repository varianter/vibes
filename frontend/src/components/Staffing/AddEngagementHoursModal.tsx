import React, {
  RefObject,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import {
  BookingType,
  ConsultantReadModel,
  EngagementState,
  ProjectWithCustomerModel,
} from "@/api-types";
import { DateTime } from "luxon";
import { generateWeekList } from "@/components/Staffing/helpers/GenerateWeekList";
import { LargeModal } from "@/components/Modals/LargeModal";
import DropDown from "@/components/DropDown";
import ActionButton from "@/components/Buttons/ActionButton";
import IconActionButton from "@/components/Buttons/IconActionButton";
import { ArrowLeft, ArrowRight, Minus, Plus } from "react-feather";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { setDetailedBookingHours } from "./DetailedBookingRows";
import { usePathname, useRouter } from "next/navigation";
import { AddConsultantCell } from "./AddConsultantCell";

import { getColorByStaffingType, getIconByBookingType } from "./helpers/utils";

interface WeekWithHours {
  week: number;
  hours: number;
}

interface ConsultantWithWeekHours {
  consultant: ConsultantReadModel;
  weekWithHours: WeekWithHours[];
}
import { SelectOption } from "../ComboBox";

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

  const [consultantsWHours, setConsultantsWHours] = useState<
    ConsultantWithWeekHours[]
  >([]);

  const [consultantsWHoursCreated, setConsultantsWHoursCreated] =
    useState(false);

  useEffect(() => {
    setWeekList(generateWeekList(firstVisibleDay, selectedWeekSpan));
  }, [firstVisibleDay, selectedWeekSpan]);

  const remainingConsultants = consultants.filter(
    (c) => !consultantsWHours.find((c2) => c2.consultant.id == c.id),
  );

  function handleAddConsultant(option: SelectOption) {
    const consultant = remainingConsultants.find((c) => c.id == option.value);
    if (consultant) {
      setConsultantsWHours([
        ...addNewConsultatWHours(
          consultantsWHours,
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
    if (project != undefined && consultantsWHoursCreated == false) {
      setConsultantsWHours(
        generateConsultatsWithHours(
          weekList,
          chosenConsultants,
          project?.projectId || 0,
        ),
      );
      setConsultantsWHoursCreated(true);
    }
  }, [chosenConsultants, consultantsWHoursCreated, project, weekList]);

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
                    {consultantsWHours?.length}
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
            {consultantsWHours?.map((consultant) => (
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

function AddEngagementHoursRow({
  consultant,
  weekList,
  project,
  consultantWWeekHours,
}: {
  consultant: ConsultantReadModel;
  weekList: DateTime[];
  project?: ProjectWithCustomerModel;
  consultantWWeekHours?: ConsultantWithWeekHours;
}) {
  const [hourDragValue, setHourDragValue] = useState<number | undefined>(
    undefined,
  );
  const [startDragWeek, setStartDragWeek] = useState<number | undefined>(
    undefined,
  );
  const [currentDragWeek, setCurrentDragWeek] = useState<number | undefined>(
    undefined,
  );
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [consultantWHours, setConsultantsWHours] = useState<
    ConsultantWithWeekHours | undefined
  >(consultantWWeekHours);

  function updateHours(res?: ConsultantReadModel) {
    if (!res) {
      return;
    }
    const consultant: ConsultantWithWeekHours = consultantWHours || {
      consultant: res,
      weekWithHours: [],
    };
    weekList.map((d) => {
      const resHours = findProjectHours(res, d);

      const hoursForWeek = consultant.weekWithHours.find(
        (w) => w.week == dayToWeek(d),
      );

      if (hoursForWeek) {
        hoursForWeek.hours = resHours || hoursForWeek.hours || 0;
      } else {
        consultant.weekWithHours.push({
          week: dayToWeek(d),
          hours: resHours || 0,
        });
      }
    });
    setConsultantsWHours({ ...consultant });
  }

  function findProjectHours(consultant: ConsultantReadModel, day: DateTime) {
    return consultant?.detailedBooking
      .find((db) => db.bookingDetails.projectId == project?.projectId)
      ?.hours.find((h) => h.week == dayToWeek(day))?.hours;
  }

  return (
    <tr>
      <td
        className={`flex justify-center items-center w-8 h-8 ${getColorByStaffingType(
          getBookingTypeFromProjectState(project?.bookingType),
        )} rounded-lg`}
      >
        {getIconByBookingType(
          getBookingTypeFromProjectState(project?.bookingType),
          16,
        )}
      </td>
      <td>
        <p className="text-black text-start small pl-2">{consultant.name}</p>
      </td>
      {weekList.map((day) => (
        <DetailedBookingCell
          key={dayToWeek(day)}
          project={project}
          consultant={consultant}
          hourDragValue={hourDragValue}
          currentDragWeek={currentDragWeek}
          startDragWeek={startDragWeek}
          setHourDragValue={setHourDragValue}
          setStartDragWeek={setStartDragWeek}
          setCurrentDragWeek={setCurrentDragWeek}
          isRowHovered={isRowHovered}
          setIsRowHovered={setIsRowHovered}
          numWeeks={weekList.length}
          firstDayInWeek={day}
          initHours={
            consultantWHours?.weekWithHours.find(
              (w) => w.week == dayToWeek(day),
            )?.hours || 0
          }
          updateHours={updateHours}
        />
      ))}
    </tr>
  );
}

function DetailedBookingCell({
  project,
  consultant,
  hourDragValue,
  setHourDragValue,
  currentDragWeek,
  startDragWeek,
  setStartDragWeek,
  setCurrentDragWeek,
  isRowHovered,
  setIsRowHovered,
  numWeeks,
  firstDayInWeek,
  initHours,
  updateHours,
}: {
  project?: ProjectWithCustomerModel;
  consultant: ConsultantReadModel;
  hourDragValue: number | undefined;
  currentDragWeek: number | undefined;
  startDragWeek: number | undefined;
  setHourDragValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  setStartDragWeek: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentDragWeek: React.Dispatch<React.SetStateAction<number | undefined>>;
  isRowHovered: boolean;
  setIsRowHovered: React.Dispatch<React.SetStateAction<boolean>>;
  numWeeks: number;
  firstDayInWeek: DateTime;
  initHours: number;
  updateHours: (res: ConsultantReadModel | undefined) => void;
}) {
  const [hours, setHours] = useState(initHours);
  const [isChangingHours, setIsChangingHours] = useState(false);
  const [oldHours, setOldHours] = useState(0);
  const { setIsDisabledHotkeys } = useContext(FilteredContext);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const organisationName = usePathname().split("/")[1];

  function updateSingularHours() {
    setIsDisabledHotkeys(false);
    if (oldHours != hours && hourDragValue == undefined) {
      setOldHours(hours);
      setDetailedBookingHours({
        hours: hours,
        bookingType: getBookingTypeFromProjectState(project?.bookingType),
        organisationUrl: organisationName,
        consultantId: consultant.id,
        bookingId: `${project?.projectId}`,
        startWeek: dayToWeek(firstDayInWeek),
      }).then((res) => {
        updateHours(res);
      });
    }
  }

  useEffect(() => {
    if (!isRowHovered && inputRef.current) {
      inputRef.current.blur();
    }
  }, [isRowHovered]);

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
    setOldHours(hours);
    setDetailedBookingHours({
      hours: hourDragValue,
      bookingType: getBookingTypeFromProjectState(project?.bookingType),
      organisationUrl: organisationName,
      consultantId: consultant.id,
      bookingId: `${project?.projectId}`,
      startWeek: startDragWeek,
      endWeek: currentDragWeek,
    }).then((res) => {
      updateHours(res);
    });
  }

  useEffect(() => {
    setHours(initHours);
    setOldHours(initHours);
  }, [initHours]);

  function checkIfMarked() {
    if (startDragWeek == undefined || currentDragWeek == undefined)
      return false;
    if (startDragWeek > currentDragWeek) {
      return (
        dayToWeek(firstDayInWeek) >= currentDragWeek &&
        dayToWeek(firstDayInWeek) <= startDragWeek
      );
    }
    return (
      dayToWeek(firstDayInWeek) <= currentDragWeek &&
      dayToWeek(firstDayInWeek) >= startDragWeek
    );
  }

  return (
    <td className="h-8 p-0.5">
      <div
        className={`flex justify-end items-center bg-offer/30 border rounded-lg h-full ${
          hours == 0 && "bg-opacity-30"
        } ${getColorByStaffingType(
          getBookingTypeFromProjectState(project?.bookingType) ??
            BookingType.Offer,
        )} ${
          isInputFocused || checkIfMarked()
            ? "border-primary"
            : "border-transparent hover:border-primary/30"
        }`}
        onMouseEnter={() => {
          setIsChangingHours(true);
          setIsRowHovered(true);
        }}
        onMouseLeave={() => {
          setIsRowHovered(false);
          setIsChangingHours(false);
          !isInputFocused && updateSingularHours();
        }}
      >
        {isChangingHours && numWeeks <= 12 && (
          <button
            tabIndex={-1}
            disabled={hours == 0}
            className={`my-1 p-1 rounded-full ${
              hours > 0 && "hover:bg-primary/10"
            }  hidden ${numWeeks <= 8 && "md:flex"} ${
              numWeeks <= 12 && "lg:flex"
            }  `}
            onClick={() => {
              setHours(Math.max(hours - 7.5, 0));
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
          step="7.5"
          value={hours}
          draggable={true}
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
              setStartDragWeek(dayToWeek(firstDayInWeek));
          }}
          onDragEnterCapture={() => {
            setCurrentDragWeek(dayToWeek(firstDayInWeek));
          }}
          onDragEnd={() => {
            updateDragHours();
            setHourDragValue(undefined);
            setCurrentDragWeek(undefined);
            setStartDragWeek(undefined);
          }}
          className={`small-medium rounded w-full p-2 bg-transparent focus:outline-none min-w-[24px] ${
            isChangingHours && numWeeks <= 12 ? "text-center" : "text-right"
          } ${hours == 0 && "text-black/75"} `}
        ></input>
        {isChangingHours && numWeeks <= 12 && (
          <button
            tabIndex={-1}
            className={`my-1 p-1 rounded-full hover:bg-primary/10 hidden ${
              numWeeks <= 8 && "md:flex"
            } ${numWeeks <= 12 && "lg:flex"} `}
            onClick={() => {
              setHours(hours + 7.5);
            }}
          >
            <Plus className="w-4 h-4 text-primary" />
          </button>
        )}
      </div>
    </td>
  );
}

function dayToWeek(day: DateTime) {
  return day.year * 100 + day.weekNumber;
}

function getBookingTypeFromProjectState(projectState?: EngagementState) {
  switch (projectState) {
    case EngagementState.Order:
      return BookingType.Booking;
    case EngagementState.Offer:
      return BookingType.Offer;
    default:
      return BookingType.Offer;
  }
}

function generateConsultatsWithHours(
  weekList: DateTime[],
  chosenConsultants: ConsultantReadModel[],
  projectId: number,
) {
  const consultantsWHours: ConsultantWithWeekHours[] = [];
  chosenConsultants.map((c) => {
    const consultant: ConsultantWithWeekHours = {
      consultant: c,
      weekWithHours: [],
    };
    weekList.map((d) => {
      const initHours = c.detailedBooking
        .find((db) => db.bookingDetails.projectId == projectId)
        ?.hours.find((h) => h.week == dayToWeek(d))?.hours;
      consultant.weekWithHours.push({
        week: dayToWeek(d),
        hours: initHours || 0,
      });
    });
    consultantsWHours.push(consultant);
  });
  return consultantsWHours;
}

function addNewConsultatWHours(
  old: ConsultantWithWeekHours[],
  consultant: ConsultantReadModel,
  projectId: number,
) {
  const newConsultantConsultantWithWeekHours: ConsultantWithWeekHours = {
    consultant: consultant,
    weekWithHours: [],
  };
  old[0].weekWithHours.map((d) => {
    const initHours = consultant.detailedBooking
      .find((db) => db.bookingDetails.projectId == projectId)
      ?.hours.find((h) => h.week == d.week)?.hours;
    newConsultantConsultantWithWeekHours.weekWithHours.push({
      week: d.week,
      hours: initHours || 0,
    });
  });
  old.push(newConsultantConsultantWithWeekHours);
  return old;
}
