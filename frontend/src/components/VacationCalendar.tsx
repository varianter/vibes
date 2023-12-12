"use client";
import { ConsultantReadModel, VacationReadModel } from "@/api-types";
import React, { useState } from "react";
import type { Value } from "react-multi-date-picker";
import { Calendar, DateObject } from "react-multi-date-picker";

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
    vacationDays.vacationDays?.map((date) => new DateObject(date)) || [],
  );
  const [vacationInformation, setVacationInformation] = useState(vacationDays);

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
    if (dates.length > valueDates.length) {
      const newDates = dates.filter((item) => valueDates.indexOf(item) < 0);
      addVacationDay(newDates[0]).then((res) => {
        if (res) setVacationInformation({ ...res });
      });
    }
    if (dates.length < valueDates.length) {
      const removeDates = valueDates.filter((item) => dates.indexOf(item) < 0);
      removeVacationDay(removeDates[0]).then((res) => {
        if (res) setVacationInformation({ ...res });
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
    }
  }

  return (
    <>
      <ul>
        <li>
          Årlig antall feriedager:{" "}
          {vacationInformation?.vacationMetaData?.daysTotal}
        </li>
        <li>
          Antall overført fra i fjor:{" "}
          {vacationInformation?.vacationMetaData?.transferredDays}
        </li>
        <li>
          Planlagte feriedager: {vacationInformation?.vacationMetaData?.planned}
        </li>
        <li>
          Brukte feriedager: {vacationInformation?.vacationMetaData?.used}
        </li>
        <li>
          Gjenstående dager å planlegge:{" "}
          {vacationInformation?.vacationMetaData?.leftToPlan}
        </li>
      </ul>
      <Calendar
        multiple
        fullYear
        weekStartDayIndex={1}
        displayWeekNumbers
        value={value}
        onChange={handleChange}
        mapDays={({ date }) => {
          let isWeekend = [0, 6].includes(date.weekDay.index);

          if (
            vacationDays.vacationDays?.includes(
              `${date.year.toString()}-${
                date.month.number > 9
                  ? date.month.number.toString()
                  : "0" + date.month.number.toString()
              }-${
                date.day > 9 ? date.day.toString() : "0" + date.day.toString()
              }`,
            ) &&
            date.toDate() <= new Date()
          )
            return {
              disabled: true,
              style: { color: "#00445B" },
            };
          else if (
            publicHolidays.includes(
              `${date.year.toString()}-${
                date.month.number > 9
                  ? date.month.number.toString()
                  : "0" + date.month.number.toString()
              }-${
                date.day > 9 ? date.day.toString() : "0" + date.day.toString()
              }`,
            )
          )
            return {
              disabled: true,
              style: { color: "#FAD2E2" },
            };
          else if (isWeekend || date.toDate() <= new Date())
            return {
              disabled: true,
              style: { color: "#ccc" },
            };
        }}
      />
    </>
  );
}
