using Api.Common.Types;
using Api.Consultants;
using Core.Extensions;
using Core.PlannedAbsences;
using Core.Staffings;

namespace Api.Forecasts;

public record ForecastReadModel(
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
}

public record struct MonthlyHours(DateOnly Month, double Hours)
{
	public static MonthlyHours For(DateOnly month, IGrouping<int, Staffing> staffingGroup)
	{
		// TODO Forecast
		throw new NotImplementedException();
	}

	public static MonthlyHours For(DateOnly month, IGrouping<string, PlannedAbsence> plannedAbsenceGroup)
	{
		// TODO Forecast
		throw new NotImplementedException();
	}
}

public record ForecastForMonth(DateOnly Month, double CalculatedPercentage, int DisplayedPercentage);
