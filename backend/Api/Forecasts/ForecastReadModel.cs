using Api.Common.Types;
using Api.Consultants;

namespace Api.Forecasts;

public record ForecastReadModel(
	SingleConsultantReadModel Consultant,
	List<BookedHoursInMonth> Bookings,
	List<DetailedBookingForMonth> DetailedBookings,
	List<ForecastForMonth> Forecasts,
	bool ConsultantIsOccupied);

public record BookedHoursInMonth(DateOnly Month, BookingReadModel BookingModel);

public record DetailedBookingForMonth(BookingDetails BookingDetails, List<MonthlyHours> Hours);

public record struct MonthlyHours(DateOnly Month, double Hours);

public record ForecastForMonth(DateOnly Month, double? CalculatedPercentage, int? DisplayedPercentage);
