"use client";

import { ConsultantReadModel, VacationReadModel } from "@/api-types";
import React, { useState } from "react";
import { MantineProvider } from "@mantine/core";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import InfoBox from "./InfoBox";
import { isPast, isToday } from "date-fns";

// TODO Work with Date objects all the way; use getDateString() only for displaying info to the user
// TODO Find non-hardcoded solution for styling 'custom-calendar'

export default function VacationCalendar({
  consultant,
  vacationDays,
  publicHolidays,
  organisationUrl,
}: {
  consultant: ConsultantReadModel;
  vacationDays: VacationReadModel;
  publicHolidays: string[];
  organisationUrl: string;
}) {
  const [vacationDates, setVacationDates] = useState<Date[]>(
    vacationDays.vacationDays?.map((day) => new Date(day)) ?? [],
  );
  const [vacationInformation, setVacationInformation] = useState(vacationDays);
  const [savedMessage, setSavedMessage] = useState("");

  const today = new Date();
  const thisYear = today.getFullYear();
  const thisYearJanuary = new Date(thisYear, 0, 1);

  const dayRenderer: DatePickerProps['renderDay'] = (date: Date) => {
    const day = date.getDate(); // TODO 'One hour extra' trick?
    const style = getStyle(date);

    return style
      ? (<div style={style}>{day}</div>)
      : (<div>{day}</div>);
  };

  function getStyle(date: Date): React.CSSProperties | null {
    if (isPastVacation(date)) {
      return {
        color: "#FFF",
        backgroundColor: "var(--mantine-color-dimmed)",
        borderRadius: "inherit",
        width: "100%",
        height: "100%",
        textAlign: "center",
        alignContent: "center"
      };
    }
    if (isPublicHoliday(date)) {
      return { color: "#B91456" };
    }
    if (isWeekend(date)) {
      return { color: "#00445B" };
    }

    return null;
  }

  function updateVacationDates(selection: Date[]) {
    if (!selection || !vacationDates) {
      return;
    }

    const updatedSelection = selection.map(getDateString);
    const previousSelection = vacationDates.map(getDateString);

    if (
      updatedSelection.length > previousSelection.length ||
      (previousSelection.length == 1 && previousSelection[0] == "")
    ) {
      const addedDate = updatedSelection.find((date) => previousSelection.indexOf(date) < 0)!;
      addVacationDay(addedDate).then((res) => {
        if (res) {
          setSavedMessage(`Ferie ${addedDate} ble lagret`);
          setVacationInformation({ ...res });
        }
      });
    }
    if (
      updatedSelection.length < previousSelection.length ||
      (updatedSelection.length == 1 && updatedSelection[0] == "")
    ) {
      const removedDate = previousSelection.find((date) => updatedSelection.indexOf(date) < 0)!;
      removeVacationDay(removedDate).then((res) => {
        if (res) {
          setSavedMessage(`Ferie ${removedDate} ble fjernet`);
          setVacationInformation({ ...res });
        }
      });
    }
    setVacationDates(selection);
  }

  function getDateString(date: Date) {
    const year = date.getFullYear();
    const month = getTwoDigits(1 + date.getMonth()); // +1 to counteract the 0-indexing of 'month'
    const day = getTwoDigits(date.getDate());

    return `${year}-${month}-${day}`;
  }

  function getTwoDigits(number: Number): string {
    return number.toString().padStart(2, '0');
  }

  async function addVacationDay(vacationDay: string) {
    const url = `/${organisationUrl}/ferie/api`;
    const body: { vacationDay: string; consultantId: number } = {
      vacationDay: vacationDay,
      consultantId: consultant.id,
    };

    try {
      const data = await fetch(url, {
        method: "put",
        body: JSON.stringify(body),
      });
      return (await data.json()) as VacationReadModel;
    } catch (e) {
      console.error("Error updating staffing", e);
      setSavedMessage(`Noe gikk galt og ferien ${vacationDay} ble ikke lagret`);
    }
  }

  async function removeVacationDay(vacationDay: string) {
    const url = `/${organisationUrl}/ferie/api`;
    const body: { vacationDay: string; consultantId: number } = {
      consultantId: consultant.id,
      vacationDay: vacationDay,
    };

    try {
      const data = await fetch(url, {
        method: "delete",
        body: JSON.stringify(body),
      });
      return (await data.json()) as VacationReadModel;
    } catch (e) {
      console.error("Error updating staffing", e);
      setSavedMessage(
        `Noe gikk galt og fjerningen av ${vacationDay} ble ikke lagret`,
      );
    }
  }

  function isPastVacation(date: Date) {
    const isVacation = vacationDates.find((vacationDay) => getDateString(vacationDay) == getDateString(date));

    return isVacation && isBeforeToday(date);
  }

  function isUnselectable(date: Date) {
    return isBeforeToday(date) || isWeekend(date) || isPublicHoliday(date);
  }

  function isBeforeToday(date: Date) {
    return isPast(date) && !isToday(date);
  }

  function isPublicHoliday(date: Date) {
    return publicHolidays.includes(getDateString(date));
  }

  function isWeekend(date: Date) {
    return [0, 6].includes(date.getDay());
  }

  return (
    <div className="flex flex-row">
      <div className="sidebar z-10">
        <div className="bg-primary/5 h-full flex flex-col gap-6 p-4 w-[300px]">
          <h1 className="">{thisYear}</h1>
          <div className="flex flex-col gap-2">
            <p className="small text-black">Ferieoversikt</p>
            <InfoBox
              infoName="Årlig antall feriedager"
              infoValue={vacationInformation?.vacationMetaData?.daysTotal?.toString()}
            />
            <InfoBox
              infoName="Antall overført fra i fjor"
              infoValue={vacationInformation?.vacationMetaData?.transferredDays?.toString()}
            />
            <InfoBox
              infoName="Planlagte feriedager"
              infoValue={vacationInformation?.vacationMetaData?.planned?.toString()}
            />
            <InfoBox
              infoName="Brukte feriedager"
              infoValue={vacationInformation?.vacationMetaData?.used?.toString()}
            />
            <InfoBox
              infoName="Gjenstående dager å planlegge"
              infoValue={vacationInformation?.vacationMetaData?.leftToPlan?.toString()}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-3 w-full">
        <div className="flex flex-col justify-center m-4">
          <h1 className="text-black">{consultant.name}</h1>
          <p className="normal text-black">{consultant.department.name}</p>
          <MantineProvider>
            <DatePicker
              class-name="custom-calendar"
              type="multiple"
              numberOfColumns={12}
              maxLevel="month"
              withWeekNumbers
              weekdayFormat="ddd"
              defaultDate={thisYearJanuary}
              highlightToday={true}
              value={vacationDates}
              onChange={updateVacationDates}
              renderDay={dayRenderer}
              excludeDate={isUnselectable}
            />
          </MantineProvider>
        </div>
        <p className="absolute right-1 p-4 hidden lg:flex normal-semibold">
          {savedMessage}
        </p>
      </div>
    </div>
  );
}
