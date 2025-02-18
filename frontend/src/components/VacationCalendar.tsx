"use client";
import { ConsultantReadModel, VacationReadModel } from "@/api-types";
import React, { useState } from "react";
import type { Value } from "react-multi-date-picker";
import { Calendar, DateObject } from "react-multi-date-picker";
import InfoBox from "./InfoBox";
import { map } from "lodash";

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
  const [value, setValue] = useState<Value>(
    vacationDays.vacationDays?.map((date) => new DateObject(date)) ?? [],
  );
  const [vacationInformation, setVacationInformation] = useState(vacationDays);
  const [savedMessage, setSavedMessage] = useState("");

  const today = new DateObject();

  function handleChange(e: Value) {
    const searchRegExp = /\//g;
    const replaceWith = "-";
    const dates = e?.toString().replace(searchRegExp, replaceWith).split(",");
    const valueDates = value
      ?.toString()
      .replace(searchRegExp, replaceWith)
      .split(",");

    if (!dates || !valueDates) {
      return;
    }
    if (
      dates.length > valueDates.length ||
      (valueDates.length == 1 && valueDates[0] == "")
    ) {
      const newDates = dates.filter((item) => valueDates.indexOf(item) < 0);
      addVacationDay(newDates[0]).then((res) => {
        if (res) {
          setSavedMessage(`Ferie ${newDates[0]} ble lagret`);
          setVacationInformation({ ...res });
        }
      });
    }
    if (
      dates.length < valueDates.length ||
      (dates.length == 1 && dates[0] == "")
    ) {
      const removeDates = valueDates.filter((item) => dates.indexOf(item) < 0);
      removeVacationDay(removeDates[0]).then((res) => {
        if (res) {
          setSavedMessage(`Ferie ${removeDates[0]} ble fjernet`);
          setVacationInformation({ ...res });
        }
      });
    }
    setValue(e);
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

  function dateIsPublicHoliday(date: DateObject) {
    return publicHolidays.includes(
      `${date.year.toString()}-${
        date.month.number > 9
          ? date.month.number.toString()
          : "0" + date.month.number.toString()
      }-${date.day > 9 ? date.day.toString() : "0" + date.day.toString()}`,
    );
  }

  function dateIsVacationDayInThePast(date: DateObject, dateCopy: DateObject) {
    return (
      vacationDays.vacationDays?.includes(
        `${date.year.toString()}-${
          date.month.number > 9
            ? date.month.number.toString()
            : "0" + date.month.number.toString()
        }-${date.day > 9 ? date.day.toString() : "0" + date.day.toString()}`,
      ) && dateCopy.toDate() < new Date()
    );
  }

  function dateIsWeekend(date: DateObject) {
    return [0, 6].includes(date.weekDay.index);
  }

  function dateIsPast(date: DateObject) {
    return date.toDate() < new Date();
  }

  function mapDayToStyling(date: DateObject) {
    //Since the date object is created before the today object, an extra hour is added to a copied version of the date object to ensure that you can edit today
    const dateCopy = new DateObject(date);
    dateCopy.add(1, "h");

    /*
    if (dateIsVacationDayInThePast(date, dateCopy))
      return {
        disabled: true,
        style: {
          color: "#00445B",
          opacity: 0.5,
          backgroundColor: "#C8EEFB",
        },
      };
     */
    if (dateIsPublicHoliday(date))
      return {
        disabled: true,
        style: { color: "#B91456", opacity: 0.5 },
      };
    else if (dateIsWeekend(date) || dateIsPast(dateCopy))
      return {
        disabled: true,
        style: { color: "#00445B", opacity: 0.5 },
      };
  }

  return (
    <div className="flex flex-row">
      <div className="sidebar z-10">
        <div className="bg-primary/5 h-full flex flex-col gap-6 p-4 w-[300px]">
          <h1 className="">{new Date().getFullYear()}</h1>
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
          <Calendar
            multiple
            fullYear
            weekStartDayIndex={1}
            displayWeekNumbers
            currentDate={today}
            value={value}
            onChange={handleChange}
            className="custom-calendar"
            mapDays={({ date }) => mapDayToStyling(date)}
          />
        </div>
        <p className="absolute right-1 p-4 hidden lg:flex normal-semibold">
          {savedMessage}
        </p>
      </div>
    </div>
  );
}
