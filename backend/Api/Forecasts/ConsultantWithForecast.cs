using Api.Common.Types;
using Api.Consultants;
using Api.Helpers;
using Core.Consultants;
using Core.Extensions;
using Core.Months;
using Core.PlannedAbsences;
using Core.Staffings;

namespace Api.Forecasts;

public record ConsultantWithForecast(
	SingleConsultantReadModel Consultant,
	List<BookedHoursInMonth> Bookings,
	List<DetailedBookingForMonth> DetailedBookings,
	List<ForecastForMonth> Forecasts,
	bool ConsultantIsAvailable);

public record BookedHoursInMonth(Month Month, BookingReadModel BookingModel);

public record DetailedBookingForMonth(BookingDetails BookingDetails, List<MonthlyHours> Hours)
{
	public double TotalHoursForMonth(Month month)
	{
		return Hours
			.Where(hoursPerMonth => hoursPerMonth.Month.Equals(month))
			.Sum(hoursInMonth => hoursInMonth.Hours);
	}

	public static double GetTotalHoursForBookingTypeAndMonth(
		IEnumerable<DetailedBookingForMonth> bookings,
		Month month,
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

public record struct MonthlyHours(Month Month, double Hours)
{
	public static MonthlyHours For(Month month, List<Staffing> staffings, Consultant consultant)
	{
		var staffedHoursInMonth = month.GetWeeksInMonth()
			.Sum(week => MonthlyHoursHelper.GetStaffedHoursForMonthInWeek(month, week, staffings, consultant));

		return new MonthlyHours(month, staffedHoursInMonth);
	}

	public static MonthlyHours For(Month month, List<PlannedAbsence> plannedAbsences, Consultant consultant)
	{
		var absenceHoursInMonth = month.GetWeeksInMonth()
			.Sum(week => MonthlyHoursHelper.GetPlannedAbsenceHoursForMonthInWeek(month, week, plannedAbsences, consultant));

		return new MonthlyHours(month, absenceHoursInMonth);
	}
}

public record ForecastForMonth(
	Month Month,
	double BillableHours,
	double SalariedHours,
	int BillablePercentage,
	int DisplayedPercentage)
{
	public static ForecastForMonth GetFor(Consultant consultant, Month month, IEnumerable<BookedHoursInMonth> bookingSummary)
	{
		var manuallySetPercentage = consultant.Forecasts
			.SingleOrDefault(f => f.Month.EqualsMonth(month))?
			.AdjustedValue ?? 0;

		var booking = bookingSummary.SingleOrDefault(bs => bs.Month.Equals(month))?.BookingModel;

		if (booking == null)
		{
			return WithoutBookingInfo(month, manuallySetPercentage);
		}

		var billableHours = GetBillableHours(booking);
		var salariedHours = GetSalariedHoursForMonth(month, consultant, booking);

		var billablePercentage = GetBillablePercentage(billableHours, salariedHours);
		var displayedPercentage = Math.Max(billablePercentage, manuallySetPercentage);

		return new ForecastForMonth(month, billableHours, salariedHours, billablePercentage, displayedPercentage);
	}

	private static ForecastForMonth WithoutBookingInfo(Month month, int displayedPercentage)
	{
		return new ForecastForMonth(month, 0, 0, 0, displayedPercentage);
	}

	private static double GetBillableHours(BookingReadModel booking)
	{
		return booking.TotalBillable;
	}

	private static double GetSalariedHoursForMonth(Month month, Consultant consultant, BookingReadModel booking)
	{
		var hoursInMonth = consultant.Department.Organization.GetTotalWeekdayHoursInMonth(month);

		return hoursInMonth
		       - booking.TotalHolidayHours
		       - booking.TotalVacationHours
		       - booking.TotalExcludableAbsence
		       - booking.TotalNotStartedOrQuit;
	}

	private static int GetBillablePercentage(double billableHours, double salariedHours)
	{
		if (billableHours.IsEqualTo(0))
		{
			return 0;
		}

		if (billableHours.IsGreaterThanOrEqualTo(salariedHours))
		{
			return 100;
		}

		return (int)(100 * (billableHours / salariedHours));
	}
}
