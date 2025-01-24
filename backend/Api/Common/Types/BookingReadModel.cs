namespace Api.Common.Types;

public record BookingReadModel(
	double TotalBillable,
	double TotalOffered,
	double TotalPlannedAbsences,
	double TotalExcludableAbsence,
	double TotalSellableTime,
	double TotalHolidayHours,
	double TotalVacationHours,
	double TotalOverbooking,
	double TotalNotStartedOrQuit);
