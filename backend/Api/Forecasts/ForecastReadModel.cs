using Api.Common.Types;
using Core.Consultants;

namespace Api.Forecasts;

public record ForecastReadModel(
	int ConsultantId,
	string ConsultantName,
	List<CompetenceReadModel> Competences,
	UpdateDepartmentReadModel Department,
	int YearsOfExperience,
	Degree Degree,
	List<BookedHoursInMonth> Bookings,
	List<DetailedBookingForMonth> DetailedBookings,
	List<ForecastForMonth> Forecasts,
	bool IsOccupied)
{
	public ForecastReadModel(
		Consultant consultant,
		List<BookedHoursInMonth> bookings,
		List<DetailedBookingForMonth> detailedBookings,
		List<ForecastForMonth> forecasts,
		bool isOccupied)
		: this(
			consultant.Id,
			consultant.Name,
			consultant.CompetenceConsultant
				.Select(cc => new CompetenceReadModel(cc.Competence.Id, cc.Competence.Name))
				.ToList(),
			new UpdateDepartmentReadModel(consultant.Department.Id, consultant.Department.Name),
			consultant.YearsOfExperience,
			consultant.Degree ?? Degree.Master,
			bookings,
			detailedBookings,
			forecasts,
			isOccupied)
	{
	}
}

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

public record DetailedBookingForMonth(BookingDetails BookingDetails, List<MonthlyHours> Hours)
{
	public double TotalHoursForMonth(DateOnly month)
	{
		return Hours
			.Where(hoursForMonth => hoursForMonth.Month == month)
			.Sum(hoursForRequestedMonth => hoursForRequestedMonth.Hours);
	}

	internal static double GetTotalHoursPrBookingTypeAndMonth(
		IEnumerable<DetailedBookingForMonth> bookings,
		BookingType bookingType,
		DateOnly month,
		bool careAboutBillable = false, bool isBillable = true)
	{
		return bookings
			.Where(b => b.BookingDetails.Type == bookingType &&
			            (!careAboutBillable || b.BookingDetails.IsBillable == isBillable))
			.Select(b => b.TotalHoursForMonth(month))
			.Sum();
	}
}

public record struct MonthlyHours(DateOnly Month, double Hours);

public record ForecastForMonth(DateOnly Month, double? CalculatedPercentage, int? DisplayedPercentage);
