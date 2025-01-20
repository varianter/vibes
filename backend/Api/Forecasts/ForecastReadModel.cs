using Api.Common.Types;
using Core.Consultants;

namespace Api.Forecasts;

public record ForecastReadModel(
	int Id,
	string Name,
	DateOnly? StartDate,
	DateOnly? EndDate,
	List<CompetenceReadModel> Competences,
	UpdateDepartmentReadModel Department,
	int YearsOfExperience,
	int GraduationYear,
	Degree Degree,
	List<BookedHoursInMonth> Bookings,
	List<DetailedBookingForMonth> DetailedBookings,
	List<ForecastForMonth> Forecasts,
	bool IsOccupied);

public record BookedHoursInMonth(DateOnly Month, MonthlyBookingReadModel BookingModel);

public record MonthlyBookingReadModel(
	double TotalBillable,
	double TotalOffered,
	double TotalPlannedAbsences,
	double TotalExcludableAbsence,
	double TotalSellableTime,
	double TotalHolidayHours,
	double TotalVacationHours,
	double TotalOverbooking,
	double TotalNotStartedOrQuit);

public record DetailedBookingForMonth(BookingDetails BookingDetails, List<MonthlyHours> Hours);

public record struct MonthlyHours(DateOnly Month, double Hours);

public record ForecastForMonth(DateOnly Month, double? CalculatedPercentage, int? DisplayedPercentage);
