using Api.Helpers;
using Core.Consultants;
using Core.Weeks;

namespace Api.Forecasts;

public static class ReadModelFactory
{
	public static List<ForecastReadModel> GetForecastReadModels(List<Consultant> consultants, DateOnly fromMonth, int monthCount)
	{
		var toMonthExclusive = fromMonth.AddMonths(monthCount);

		return consultants
			.Where(c => c.EndDate == null || c.EndDate > fromMonth)
			.Where(c => c.StartDate == null || c.StartDate < toMonthExclusive)
			.Select(consultant => CreateModel(consultant, fromMonth, toMonthExclusive))
			.ToList();
	}

	private static ForecastReadModel CreateModel(Consultant consultant, DateOnly fromMonth, DateOnly firstExcludedMonth)
	{
		var weeks = fromMonth.GetWeeksThrough(firstExcludedMonth.AddDays(-1)).ToList();

		var detailedBookings = GetDetailedBookings(consultant, weeks);
		var bookingSummary = GetBookedHours(consultant, weeks, detailedBookings);

		var months = fromMonth.GetMonthsUntil(firstExcludedMonth).ToList();

		var forecasts = GetForecasts(consultant, months, bookingSummary).ToList();

		// The consultant is occupied if there are 0 available/sellable hours during the whole time span
		var isOccupied = bookingSummary.All(bs => NumericsHelper.DoubleEquals(bs.BookingModel.TotalSellableTime, 0));

		return new ForecastReadModel(consultant, bookingSummary, detailedBookings, forecasts, isOccupied);
	}

	private static List<DetailedBookingForMonth> GetDetailedBookings(Consultant consultant, List<Week> weeks)
	{
		throw new NotImplementedException();
	}

	private static List<BookedHoursInMonth> GetBookedHours(Consultant consultant, List<Week> weeks, List<DetailedBookingForMonth> detailedBookings)
	{
		throw new NotImplementedException();
	}

	private static IEnumerable<ForecastForMonth> GetForecasts(Consultant consultant, List<DateOnly> months, List<BookedHoursInMonth> bookingSummary)
	{
		foreach (var month in months)
		{
			var forecastPercentage = consultant.Forecasts
				.SingleOrDefault(f => f.Month.EqualsMonth(month))?
				.AdjustedValue;

			var booking = bookingSummary.SingleOrDefault(bs => bs.Month.EqualsMonth(month))?.BookingModel;

			if (booking == null)
			{
				yield return new ForecastForMonth(month, null, forecastPercentage);
				continue;
			}

			var calculatedPercentage = CalculatePercentage(month, consultant, booking);

			yield return new ForecastForMonth(month, calculatedPercentage, forecastPercentage);
		}
	}

	private static double CalculatePercentage(DateOnly month, Consultant consultant, MonthlyBookingReadModel booking)
	{
		var organization = consultant.Department.Organization;

		var workdaysInMonth = month.GetTotalWeekdaysInMonth() - organization.GetTotalHolidaysOfMonth(month);

		// TODO Is this the correct calculation?
		var hoursInMonth = organization.HoursPerWorkday * workdaysInMonth;

		var billableAndOfferedHours = booking.TotalBillable + booking.TotalOffered;

		return billableAndOfferedHours / hoursInMonth;
	}
}
