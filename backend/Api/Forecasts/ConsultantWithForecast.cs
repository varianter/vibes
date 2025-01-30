using Api.Common.Types;
using Api.Consultants;
using Api.Helpers;
using Core.Consultants;
using Core.Extensions;
using Core.Organizations;
using Core.PlannedAbsences;
using Core.Staffings;

namespace Api.Forecasts;

public record ConsultantWithForecast(
	SingleConsultantReadModel Consultant,
	List<BookedHoursInMonth> Bookings,
	List<DetailedBookingForMonth> DetailedBookings,
	List<ForecastForMonth> Forecasts,
	bool ConsultantIsAvailable);

public record BookedHoursInMonth(DateOnly Month, BookingReadModel BookingModel);

public record DetailedBookingForMonth(BookingDetails BookingDetails, List<MonthlyHours> Hours)
{
	public double TotalHoursForMonth(DateOnly month)
	{
		return Hours
			.Where(hoursPerMonth => hoursPerMonth.Month.EqualsMonth(month))
			.Sum(hoursInMonth => hoursInMonth.Hours);
	}

	public static double GetTotalHoursForBookingTypeAndMonth(
		IEnumerable<DetailedBookingForMonth> bookings,
		DateOnly month,
		BookingType bookingType,
		bool evaluateBillable = false,
		bool isBillable = true)
	{
		return bookings
			.Where(b => b.BookingDetails.Type == bookingType)
			.Where(b => !evaluateBillable || b.BookingDetails.IsBillable == isBillable)
			.Sum(b => b.TotalHoursForMonth(month));
	}

	public static DetailedBookingForMonth NotStartedOrQuit(List<MonthlyHours> hoursPerMonth)
	{
		return new DetailedBookingForMonth(BookingDetails.NotStartedOrQuit(), hoursPerMonth);
	}
}

public record struct MonthlyHours(DateOnly Month, double Hours)
{
	public static MonthlyHours For(DateOnly month, List<Staffing> staffings, Consultant consultant)
	{
		var staffedHoursInMonth = month.GetWeeksInMonth()
			.Sum(week => MonthlyHoursHelper.GetStaffedHoursForMonthInWeek(month, week, staffings, consultant));

		return new MonthlyHours(month, staffedHoursInMonth);
	}

	public static MonthlyHours For(DateOnly month, List<PlannedAbsence> plannedAbsences, Consultant consultant)
	{
		var absenceHoursInMonth = month.GetWeeksInMonth()
			.Sum(week => MonthlyHoursHelper.GetPlannedAbsenceHoursForMonthInWeek(month, week, plannedAbsences, consultant));

		return new MonthlyHours(month, absenceHoursInMonth);
	}
}

public record ForecastForMonth(DateOnly Month, double CalculatedPercentage, int DisplayedPercentage);
