"use client";
import { ConsultantReadModel, VacationReadModel } from "@/api-types";
import React, { useState } from "react";
import type { Value } from "react-multi-date-picker";
import { Calendar, DateObject } from "react-multi-date-picker";
import InfoBox from "./InfoBox";

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
        if (res) setVacationInformation({ ...res });
      });
    }
    if (
      dates.length < valueDates.length ||
      (dates.length == 1 && dates[0] == "")
    ) {
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

      <div className="flex flex-col justify-center m-4">
        <h1 className="text-black">{consultant.name}</h1>
        <p className="normal text-black">{consultant.department.name}</p>
        <p></p>
        <Calendar
          multiple
          fullYear
          weekStartDayIndex={1}
          displayWeekNumbers
          currentDate={today}
          value={value}
          onChange={handleChange}
          className="custom-calendar"
          mapDays={({ date }) => {
            const dateCopy = new DateObject(date);
            dateCopy.add(1, "h");

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
              dateCopy.toDate() < new Date()
            )
              return {
                disabled: true,
                style: {
                  color: "#00445B",
                  opacity: 0.5,
                  backgroundColor: "#C8EEFB",
                },
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
                style: { color: "#B91456", opacity: 0.5 },
              };
            else if (isWeekend || dateCopy.toDate() < new Date())
              return {
                disabled: true,
                style: { color: "#00445B", opacity: 0.5 },
              };
          }}
        />
      </div>
    </div>
  );
}
