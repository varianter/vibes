using Api.Common.Types;
using Api.Consultants;
using Api.Helpers;
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

public record BookedHoursInMonth(DateOnly Month, int BillablePercentage, BookingReadModel BookingModel);

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
	public static MonthlyHours For(DateOnly month, List<Staffing> staffings, Organization organization)
	{
		var staffedHoursInMonth = month.GetWeeksInMonth()
			.Sum(week => MonthlyHoursHelper.GetStaffedHoursForMonthInWeek(month, week, staffings, organization));

		return new MonthlyHours(month, staffedHoursInMonth);
	}

	public static MonthlyHours For(DateOnly month, List<PlannedAbsence> plannedAbsences, Organization organization)
	{
		var absenceHoursInMonth = month.GetWeeksInMonth()
			.Sum(week => MonthlyHoursHelper.GetPlannedAbsenceHoursForMonthInWeek(month, week, plannedAbsences, organization));

		return new MonthlyHours(month, absenceHoursInMonth);
	}
}

public record ForecastForMonth(DateOnly Month, int BillablePercentage, int DisplayedPercentage);
