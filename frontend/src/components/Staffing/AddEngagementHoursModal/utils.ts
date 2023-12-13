import { BookingType, ConsultantReadModel, EngagementState } from "@/api-types";
import { ConsultantWithWeekHours, WeekWithHours } from "@/types";
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
    case EngagementState.Absence:
      return BookingType.PlannedAbsence;
    default:
      return BookingType.Offer;
  }
}

export function generateConsultatsWithHours(
  weekList: DateTime[],
  chosenConsultants: ConsultantReadModel[],
  projectId: number,
  engagementState: EngagementState,
) {
  const consultantsWHours: ConsultantWithWeekHours[] = [];
  chosenConsultants.map((c) => {
    const consultant: ConsultantWithWeekHours = {
      consultant: c,
      weekWithHours: [],
    };
    weekList.map((d) => {
      const initHours =
        engagementState == EngagementState.Absence
          ? findAbsenceInitHours(c, projectId, dayToWeek(d))
          : findEngagementInitHours(c, projectId, dayToWeek(d));

      c.detailedBooking
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
  engagementState: EngagementState,
) {
  const newConsultantConsultantWithWeekHours: ConsultantWithWeekHours = {
    consultant: consultant,
    weekWithHours: [],
  };
  old[0].weekWithHours.map((d) => {
    const initHours =
      engagementState == EngagementState.Absence
        ? findAbsenceInitHours(consultant, projectId, d.week)
        : findEngagementInitHours(consultant, projectId, d.week);
    newConsultantConsultantWithWeekHours.weekWithHours.push({
      week: d.week,
      hours: initHours || 0,
    });
  });
  old.push(newConsultantConsultantWithWeekHours);
  return old;
}

function findEngagementInitHours(
  consultant: ConsultantReadModel,
  projectId: number,
  week: number,
) {
  return consultant.detailedBooking
    .find(
      (db) =>
        db.bookingDetails.projectId == projectId &&
        (db.bookingDetails.type == BookingType.Offer ||
          db.bookingDetails.type == BookingType.Booking),
    )
    ?.hours.find((h) => h.week == week)?.hours;
}

function findAbsenceInitHours(
  consultant: ConsultantReadModel,
  absenceId: number,
  week: number,
) {
  return consultant.detailedBooking
    .find(
      (db) =>
        db.bookingDetails.projectId == absenceId &&
        db.bookingDetails.type == BookingType.PlannedAbsence,
    )
    ?.hours.find((h) => h.week == week)?.hours;
}
