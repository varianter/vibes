"use client";
import {
  BookedHoursPerWeek,
  BookingType,
  Consultant,
  DetailedBooking,
  EngagementBackendBody,
  ProjectState,
  ProjectWithConsultantsReadModel,
  WeeklyHours,
  updateBookingHoursBody,
} from "@/types";
import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useContext,
  useState,
  useEffect,
  useRef,
  RefObject,
} from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  ChevronDown,
  Coffee,
  FileText,
  Minus,
  Moon,
  Plus,
  Sun,
} from "react-feather";
import InfoPill, { InfoPillVariant } from "./InfoPill";
import { usePathname } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import EasyModal from "./Modals/EasyModal";
import ReactSelect, { SelectOption } from "./ReactSelect";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { MultiValue } from "react-select";
import ActionButton from "./Buttons/ActionButton";
import { LargeModal } from "./Modals/LargeModal";
import { isCurrentWeek } from "@/hooks/staffing/dateTools";
import DropDown from "./DropDown";
import IconActionButton from "./Buttons/IconActionButton";
import { WeekCell } from "./WeekCell";
import {
  getColorByStaffingType,
  getIconByBookingType,
  setDetailedBookingHours,
  upsertConsultantBooking,
} from "./consultantTools";

export default function ConsultantRows({
  consultant,
}: {
  consultant: Consultant;
}) {
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [hoveredRowWeek, setHoveredRowWeek] = useState(-1);

  const columnCount = consultant.bookings.length ?? 0;

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
          <AddStaffingCell consultant={consultant} />
        </tr>
      )}
    </>
  );
}

interface AddStaffingCellProps {
  consultant: Consultant;
}

function AddStaffingCell(props: AddStaffingCellProps): ReactElement {
  const { closeModal, openModal, modalRef } = useModal({
    closeOnBackdropClick: true,
  });
  const [isAddStaffingHovered, setIsAddStaffingHovered] = useState(false);

  return (
    <>
      <td className={`${"border-l-secondary border-l-2"}`}></td>
      <td>
        <EasyModal
          modalRef={modalRef}
          title={"Legg til engasjement"}
          showCloseButton={true}
          onSave={() => console.log("save")}
        >
          <div className="min-h-[300px]">
            <AddEngagementForm
              consultantId={props.consultant.id}
              closeEngagementModal={closeModal}
            />
          </div>
        </EasyModal>
        <button
          onClick={openModal}
          className="flex flex-row items-center gap-2"
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
      </td>
    </>
  );
}

function AddEngagementForm(props: {
  consultantId?: string;
  closeEngagementModal: () => void;
}): ReactElement {
  const { closeEngagementModal } = props;
  const { openModal, modalRef } = useModal({
    closeOnBackdropClick: true,
  });
  const { customers, consultants } = useContext(FilteredContext);

  // State for select components
  const [selectedCustomer, setSelectedCustomer] = useState<SelectOption | null>(
    null,
  );
  const [selectedEngagement, setSelectedEngagement] =
    useState<SelectOption | null>(null);

  const organisationName = usePathname().split("/")[1];

  const customerOptions = customers.map(
    (c) =>
      ({
        value: `${c.customerId}`,
        label: `${c.customerName}`,
      }) as SelectOption,
  );

  const projectOptions =
    customers
      .find((c) => c.customerId == selectedCustomer?.value)
      ?.engagements?.map(
        (e) =>
          ({
            value: `${e.engagementId}`,
            label: `${e.engagementName}`,
          }) as SelectOption,
      ) ?? [];

  const consultantOptions =
    consultants.map(
      (c) =>
        ({
          value: `${c.id}`,
          label: `${c.name}`,
        }) as SelectOption,
    ) ?? [];

  const preSelectedConsultant =
    consultantOptions.find((c) => c.value == props.consultantId) ?? null;

  const [selectedConsultants, setSelectedConsultants] =
    useState<MultiValue<SelectOption> | null>(
      preSelectedConsultant ? [preSelectedConsultant] : null,
    );

  // State for radio button group
  const [radioValue, setRadioValue] = useState<ProjectState>(
    ProjectState.Offer,
  );

  // State for toggle
  const [isFakturerbar, setIsFakturerbar] = useState(false);

  // Handler for select components
  function handleSelectedCustomerChange(newCustomer: SelectOption) {
    setSelectedCustomer(newCustomer);
    setSelectedEngagement(null);
  }

  function handleSelectedEngagementChange(newValue: SelectOption) {
    setSelectedEngagement(newValue);
  }

  // Handler for radio button group
  function handleRadioChange(event: ChangeEvent<HTMLInputElement>) {
    setRadioValue(event.target.value as ProjectState);
  }

  // Handler for toggle
  function handleToggleChange() {
    setIsFakturerbar(!isFakturerbar);
  }

  async function submitAddEngagementForm(body: EngagementBackendBody) {
    const url = `/${organisationName}/bemanning/api/engagements`;

    try {
      const data = await fetch(url, {
        method: "put",
        body: JSON.stringify({
          ...body,
        }),
      });
      return (await data.json()) as ProjectWithConsultantsReadModel;
    } catch (e) {
      console.error("Error updating staffing", e);
    }
  }

  // Handler for form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // event.preventDefault();
    // event.stopPropagation();
    // Add your submission logic here
    console.log(event);

    const body: EngagementBackendBody = {
      consultantIds: selectedConsultants?.map((c) => Number(c.value)), // Solid existing
      customerId: Number(selectedCustomer?.value),
      customerName: selectedCustomer?.label,
      engagementId: Number(selectedEngagement?.value),
      projectName: selectedEngagement?.label,
      bookingType: radioValue,
      isBillable: isFakturerbar,
    };

    console.log(body);

    console.log("Form submitted!");

    const result = await submitAddEngagementForm(body);

    console.log(result);
    //TODO: Need to close the add engagement modal before opening the large modal
    event.preventDefault();
    closeEngagementModal();
    openModal();
    // TODO: Legg på noe post-greier her

    if (result) console.log("need to open large modal here and use result");
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 pt-6 h-96">
          {/* Selected Customer */}
          <div className="flex flex-col gap-2">
            <p className="small text-black">Konsulenter</p>
            <ReactSelect
              options={consultantOptions}
              selectedMultipleOptionsValue={selectedConsultants}
              onMultipleOptionsChange={setSelectedConsultants}
              isMultipleOptions={true}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="small text-black">Kunde</p>
            <ReactSelect
              options={customerOptions}
              selectedSingleOptionValue={selectedCustomer}
              onSingleOptionChange={handleSelectedCustomerChange}
              isMultipleOptions={false}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="small text-black">Engasjement</p>
            <ReactSelect
              options={projectOptions}
              onSingleOptionChange={handleSelectedEngagementChange}
              selectedSingleOptionValue={selectedEngagement}
              isMultipleOptions={false}
            />
          </div>
          {/* Radio Button Group */}
          <div className="flex flex-row gap-4">
            <label className="flex gap-2 normal items-center">
              <input
                type="radio"
                value={ProjectState.Offer}
                checked={radioValue === ProjectState.Offer}
                onChange={handleRadioChange}
              />
              Tilbud
            </label>
            <label className="flex gap-2 normal items-center">
              <input
                type="radio"
                value={ProjectState.Order}
                checked={radioValue === ProjectState.Order}
                onChange={handleRadioChange}
              />
              Ordre
            </label>
          </div>
          {/* Toggle (Checkbox) */}
          <label className="flex flex-row justify-between items-center">
            Fakturerbart
            <div
              className={`rounded-full w-[52px] h-7 flex items-center  ${
                isFakturerbar ? "bg-primary" : "bg-black/20"
              }`}
              onClick={handleToggleChange}
            >
              <div
                className={`m-[2px] bg-white rounded-full w-6 h-6 ${
                  isFakturerbar && " translate-x-6"
                }`}
              ></div>
            </div>
          </label>
        </div>

        <div className="space-y-2 space-x-2">
          <ActionButton variant="primary" type="submit" fullWidth>
            Legg til engasjement
          </ActionButton>
        </div>
      </form>

      <AddEngagementHoursModal
        modalRef={modalRef}
        weekSpan={8}
        chosenConsultants={consultants.slice(0, 3)}
      />
    </>
  );
}

function AddEngagementHoursModal({
  modalRef,
  chosenConsultants,
}: {
  modalRef: RefObject<HTMLDialogElement>;
  weekSpan: number;
  chosenConsultants: Consultant[];
}) {
  const weekSpanOptions = ["8 uker", "12 uker", "26 uker"];
  const [selectedWeekSpan, setSelectedWeekSpan] = useState<number>(8);
  return (
    <LargeModal
      modalRef={modalRef}
      engagementName="Designbistand"
      customerName="Akva Group"
      type={BookingType.Offer}
      showCloseButton={true}
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
              dropDownFunction={setSelectedWeekSpan}
            />
            <ActionButton
              variant="secondary"
              onClick={() => setSelectedWeekSpan(46)}
            >
              Nåværende uke
            </ActionButton>
            <IconActionButton
              variant={"secondary"}
              icon={<ArrowLeft />}
              onClick={() => setSelectedWeekSpan(selectedWeekSpan - 1)}
            />
            <IconActionButton
              variant={"secondary"}
              icon={<ArrowRight />}
              onClick={() => setSelectedWeekSpan(selectedWeekSpan + 1)}
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
            {chosenConsultants
              .at(0)
              ?.bookings?.map((booking, index) => <col key={index} span={1} />)}
          </colgroup>
          <thead>
            <tr className="sticky -top-6 bg-white z-10">
              <th colSpan={2} className="pt-3 pl-2 -left-2 relative bg-white">
                <div className="flex flex-row gap-3 pb-4 items-center">
                  <p className="normal-medium ">Konsulenter</p>
                  <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                    {chosenConsultants?.length}
                  </p>
                </div>
              </th>
              {chosenConsultants.at(0)?.bookings?.map((booking) => (
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
            {chosenConsultants?.map((consultant) => (
              <AddEngagementHoursRow
                key={consultant.id}
                consultant={consultant}
                weekSpan={selectedWeekSpan}
              />
            ))}
          </tbody>
        </table>
      </div>
    </LargeModal>
  );
}

function AddEngagementHoursRow({
  consultant,
  weekSpan,
}: {
  consultant: Consultant;
  weekSpan: number;
}) {
  return (
    <tr>
      <td>
        <div className="flex justify-center items-center w-8 h-8 bg-offer rounded-lg">
          <Briefcase className="text-black w-4 h-4" />
        </div>
      </td>
      <td>
        <p className="text-black text-start small pl-2">{consultant.name}</p>
      </td>
      {Array.from({ length: weekSpan }, (_, index) => (
        <td key={index} className=" p-0.5">
          <div className="flex justify-end items-center bg-offer/30  rounded-lg h-full">
            <p className="small-medium text-black/75 p-2">0</p>
          </div>
        </td>
      ))}
    </tr>
  );
}

function DetailedBookingRows(props: {
  consultant: Consultant;
  detailedBooking: DetailedBooking;
}) {
  const { consultant, detailedBooking } = props;
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

  return (
    <tr
      key={`${consultant.id}-details-${detailedBooking.bookingDetails.customerName}`}
      className="h-fit"
    >
      <td className="border-l-secondary border-l-2"></td>
      <td className="flex flex-row gap-2 justify-start">
        <div
          className={`h-8 w-8 flex justify-center items-center rounded ${getColorByStaffingType(
            detailedBooking.bookingDetails.type,
          )}`}
        >
          {getIconByBookingType(detailedBooking.bookingDetails.type, 16)}
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
            hourDragValue={hourDragValue}
            setHourDragValue={setHourDragValue}
            currentDragWeek={currentDragWeek}
            startDragWeek={startDragWeek}
            setStartDragWeek={setStartDragWeek}
            setCurrentDragWeek={setCurrentDragWeek}
            isRowHovered={isRowHovered}
            setIsRowHovered={setIsRowHovered}
          />
        ))}
    </tr>
  );
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
  isRowHovered,
  setIsRowHovered,
}: {
  detailedBooking: DetailedBooking;
  detailedBookingHours: WeeklyHours;
  consultant: Consultant;
  hourDragValue: number | undefined;
  currentDragWeek: number | undefined;
  startDragWeek: number | undefined;
  setHourDragValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  setStartDragWeek: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentDragWeek: React.Dispatch<React.SetStateAction<number | undefined>>;
  isRowHovered: boolean;
  setIsRowHovered: React.Dispatch<React.SetStateAction<boolean>>;
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

  function updateSingularHours() {
    setIsDisabledHotkeys(false);
    if (oldHours != hours && hourDragValue == undefined) {
      setDetailedBookingHours({
        hours: hours,
        bookingType: detailedBooking.bookingDetails.type,
        organisationUrl: organisationName,
        consultantId: consultant.id,
        bookingId: detailedBooking.bookingDetails.projectId,
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
    if (!isRowHovered && inputRef.current) {
      inputRef.current.blur();
    }
  }, [isRowHovered]);

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
      bookingId: detailedBooking.bookingDetails.projectId,
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
          setIsRowHovered(true);
        }}
        onMouseLeave={() => {
          setIsRowHovered(false);
          setIsChangingHours(false);
          !isInputFocused && updateSingularHours();
        }}
      >
        {isChangingHours &&
          numWeeks <= 12 &&
          detailedBooking.bookingDetails.type != BookingType.Vacation && (
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
          disabled={detailedBooking.bookingDetails.type == BookingType.Vacation}
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
          detailedBooking.bookingDetails.type != BookingType.Vacation && (
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
