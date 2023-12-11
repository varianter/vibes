import { EngagementState, BookingType, ConsultantReadModel } from "@/api-types";
import { ConsultantWithWeekHours } from "@/types";
import { DateTime } from "luxon";

export function dayToWeek(day: DateTime) {
  return day.year * 100 + day.weekNumber;
}

export function getBookingTypeFromProjectState(projectState?: EngagementState) {
  switch (projectState) {
    case EngagementState.Order:
      return BookingType.Booking;
    case EngagementState.Offer:
      return BookingType.Offer;
    default:
      return BookingType.Offer;
  }
}

export function generateConsultatsWithHours(
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

export function addNewConsultatWHours(
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
