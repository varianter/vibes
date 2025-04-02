"use client";

import { ConsultantReadModel, VacationReadModel } from "@/api-types";
import React, { HTMLAttributes, useState } from "react";
import { MantineProvider } from "@mantine/core";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import InfoBox from "./InfoBox";
import dayjs from 'dayjs';

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

  const publicHolidayDates = publicHolidays?.map((holiday) => new Date(holiday)) ?? [];

  const today = new Date();
  const thisYear = today.getFullYear();
  const thisYearJanuary = new Date(thisYear, 0, 1);

  function updateVacationDates(selection: Date[]) {
    if (!selection || !vacationDates) {
      return;
    }
    if (selection.length == vacationDates.length) {
      return;
    }

    if (selection.length > vacationDates.length) {
      // a selected date is always appended to the selection array
      const selectedDate = selection.slice(-1)[0];
      const selectedDay = getDayString(selectedDate);

      addVacationDay(selectedDay).then((res) => {
        if (res) {
          setSavedMessage(`Ferie ${selectedDay} ble lagret`);
          setVacationInformation({ ...res });
        }
      });
    }
    else {
      const deselectedDate = vacationDates.find((date) => !isInCollection(selection, date))!;
      const deselectedDay = getDayString(deselectedDate);

      removeVacationDay(deselectedDay).then((res) => {
        if (res) {
          setSavedMessage(`Ferie ${deselectedDay} ble fjernet`);
          setVacationInformation({ ...res });
        }
      });
    }

    setVacationDates(selection);
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

  function getDayString(date: Date) {
    return `${dayjs(date).format('YYYY-MM-DD')}`;
  }

  const dayRenderer: DatePickerProps['renderDay'] = (date: Date) => {
    const day = date.getDate();
    const attributes = getHtmlAttributes(date);

    return (<div {...attributes}>{day}</div>);
  };

  function getHtmlAttributes(date: Date): HTMLAttributes<HTMLDivElement> | undefined {
    if (isPastVacation(date)) {
      return {
        style: {
          color: "#FFF",
          backgroundColor: "var(--mantine-color-dimmed)",
          borderRadius: "inherit",
          width: "100%",
          height: "100%",
          textAlign: "center",
          alignContent: "center"
        },
        title: "Planlagte feriedager tilbake i tid kan ikke endres"
      };
    }
    if (isPublicHoliday(date)) {
      return { style: { color: "#B91456" } };
    }
    if (isWeekend(date)) {
      return { style: { color: "#00445B" } };
    }
  }

  function isUnselectable(date: Date) {
    return isBeforeToday(date) || isWeekend(date) || isPublicHoliday(date);
  }

  function isBeforeToday(date: Date) {
    return dayjs().isAfter(date, 'date');
  }

  function isWeekend(date: Date) {
    return [0, 6].includes(date.getDay());
  }

  function isPublicHoliday(date: Date) {
    return isInCollection(publicHolidayDates, date);
  }

  function isPastVacation(date: Date) {
    return isBeforeToday(date) && isInCollection(vacationDates, date);
  }

  function isInCollection(dates: Date[], targetDate: Date) {
    return dates.some((date) =>
      date.getFullYear() === targetDate.getFullYear() &&
      date.getMonth() === targetDate.getMonth() &&
      date.getDate() === targetDate.getDate());
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
            <span title="Antall feriedager du har planlagt å ta fra og med idag.">
              <InfoBox
                infoName="Kommende feriedager"
                infoValue={vacationInformation?.vacationMetaData?.planned?.toString()}
              />
            </span>
            <span title="Antall feriedager du har planlagt tilbake i tid.">
              <InfoBox
                infoName="Tidligere feriedager"
                infoValue={vacationInformation?.vacationMetaData?.used?.toString()}
              />
            </span>
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
