import {
  BookingType,
  ProjectState,
} from "@/api-types";
import React, { ReactElement } from "react";
import { Briefcase, Coffee, FileText, Moon, Sun } from "react-feather";
import { InfoPillVariant } from "@/components/Staffing/InfoPill";
import { ConsultantReadModel, DetailedBooking } from "@/api-types";

export function getColorByStaffingType(type: BookingType): string {
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

export function getIconByProjectState(
  size: number,
  state?: ProjectState,
): ReactElement {
  switch (state) {
    case ProjectState.Offer:
      return <FileText size={size} className="text-primary_darker" />;
    case ProjectState.Order:
      return <Briefcase size={size} className="text-black" />;
    default:
      return <></>;
  }
}

export function getColorByProjectState(type?: ProjectState): string {
  switch (type) {
    case ProjectState.Offer:
      return "bg-offer";
    case ProjectState.Order:
      return "bg-primary/[3%]";
    default:
      return "";
  }
}

export function getIconByBookingType(
  type: BookingType,
  size: number,
): ReactElement {
  switch (type) {
    case BookingType.Offer:
      return <FileText size={size} className="text-primary_darker" />;
    case BookingType.Booking:
      return <Briefcase size={size} className="text-black" />;
    case BookingType.Vacation:
      return <Sun size={size} className="text-vacation_darker" />;
    case BookingType.PlannedAbsence:
      return <Moon size={size} className="text-absence_darker" />;
    case BookingType.Available:
      return <Coffee size={size} className="text-available_darker" />;
    default:
      return <></>;
  }
}

export function isWeekBookingZeroHours(
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

export function getInfopillVariantByColumnCount(
  count: number,
): InfoPillVariant {
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

export function upsertConsultantBooking(
  old: ConsultantReadModel[],
  res?: ConsultantReadModel,
) {
  if (!res) return old;

  const consultantToUpdate = old.find((c) => c.id === res.id);
  if (!consultantToUpdate || !res) return old;

  consultantToUpdate.bookings = consultantToUpdate.bookings ?? [];
  res.bookings?.map((booking) => {
    const bookingIndex = consultantToUpdate.bookings.findIndex(
      (b) => b.year == booking.year && b.weekNumber == booking.weekNumber,
    );
    if (bookingIndex !== -1 && res.bookings) {
      consultantToUpdate.bookings[bookingIndex] = booking;
    }

    consultantToUpdate.detailedBooking =
      consultantToUpdate.detailedBooking ?? [];
  });
  if (res.detailedBooking) {
    res.detailedBooking.map((detailedBooking) => {
      const detailedBookingIndex = consultantToUpdate.detailedBooking.findIndex(
        (db) =>
          db.bookingDetails.projectId ==
          detailedBooking.bookingDetails.projectId,
      );
      detailedBooking.hours.map((hour) => {
        const hoursIndex = consultantToUpdate.detailedBooking[
          detailedBookingIndex
        ].hours.findIndex((h) => h.week == hour.week);
        consultantToUpdate.detailedBooking[detailedBookingIndex].hours[
          hoursIndex
        ] = hour;
      });
    });
  }

  const consultantIndex = old.findIndex((c) => c.id === res.id);
  old[consultantIndex] = consultantToUpdate;

  return [...old];
}

export function updateProjects(old: ConsultantReadModel[], res?: ConsultantReadModel[]) {
  if (!res) return old;

  res.map((consultant) => {
    const consultantIndex = old.findIndex((c) => c.id === consultant.id);
    old[consultantIndex] = consultant;
  });

  return [...old];
}
