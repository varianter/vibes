import { BookingType, Consultant, updateBookingHoursBody } from "@/types";
import { ReactElement } from "react";
import { FileText, Briefcase, Sun, Moon, Coffee } from "react-feather";

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

export async function setDetailedBookingHours(props: updateBookingHoursProps) {
  const url = `/${props.organisationUrl}/bemanning/api/updateHours`;
  const body: updateBookingHoursBody = {
    hours: props.hours,
    bookingType: props.bookingType,
    consultantId: props.consultantId,
    bookingId: props.bookingId,
    startWeek: props.startWeek,
    endWeek: props.endWeek,
  };

  try {
    const data = await fetch(url, {
      method: "put",
      body: JSON.stringify(body),
    });
    return (await data.json()) as Consultant;
  } catch (e) {
    console.error("Error updating staffing", e);
  }
}

export interface updateBookingHoursProps {
  hours: number;
  bookingType: BookingType;
  organisationUrl: string;
  consultantId: string;
  bookingId: string;
  startWeek: number;
  endWeek?: number;
}

export function upsertConsultantBooking(old: Consultant[], res?: Consultant) {
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

  const consultantIndex = old.findIndex((c) => c.id === `${res.id}`);
  old[consultantIndex] = consultantToUpdate;

  return [...old];
}
