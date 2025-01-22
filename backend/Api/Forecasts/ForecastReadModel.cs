using Api.Common.Types;
using Api.Consultants;

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
		// TODO Forecast
		throw new NotImplementedException();
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

public record struct MonthlyHours(DateOnly Month, double Hours);

public record ForecastForMonth(DateOnly Month, double CalculatedPercentage, int DisplayedPercentage);
