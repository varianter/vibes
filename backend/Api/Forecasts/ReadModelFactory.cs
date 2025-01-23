using Api.Common.Types;
using Api.Consultants;
using Core.Consultants;
using Core.Engagements;
using Core.Extensions;
using Core.Vacations;
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
		var months = fromMonth.GetMonthsUntil(firstExcludedMonth).ToList();

		var detailedBookings = GetDetailedBookings(consultant, months, fromMonth, firstExcludedMonth);

		var bookingSummary = months
			.Select(month => GetBookedHours(consultant, month, detailedBookings))
			.ToList();

		var forecasts = GetForecasts(consultant, months, bookingSummary).ToList();

		var isAvailable = bookingSummary.Any(bs => bs.BookingModel.TotalSellableTime.IsGreaterThan(0));

		return new ForecastReadModel(new SingleConsultantReadModel(consultant), bookingSummary, detailedBookings, forecasts, isAvailable);
	}

	// Using a similar pattern as in DetailedBookings() in StaffingController/ReadModelFactory
	private static List<DetailedBookingForMonth> GetDetailedBookings(Consultant consultant, List<DateOnly> months, DateOnly fromMonth, DateOnly firstExcludedMonth)
	{
		var weeks = months.First().GetWeeksThrough(months.Last()).ToList();
		weeks.Sort();

		var billableBookings = GetBookings(consultant, months, weeks, EngagementState.Order, BookingType.Booking);
		var offeredBookings = GetBookings(consultant, months, weeks, EngagementState.Offer, BookingType.Offer);

		var plannedAbsences = GetPlannedAbsences(consultant, months, weeks);

		var detailedBookings = billableBookings.Concat(offeredBookings).Concat(plannedAbsences);

		if (TryGetVacations(consultant, fromMonth, firstExcludedMonth, out var vacations))
		{
			var vacationHoursPerMonth = months
				.Select(month => new MonthlyHours(
					month,
					Hours: consultant.Department.Organization.HoursPerWorkday *
					       vacations.Count(v => v.Date.EqualsMonth(month))))
				.ToList();

			detailedBookings = detailedBookings.Append(new DetailedBookingForMonth(
				BookingDetails.ForVacation(),
				Hours: vacationHoursPerMonth));
		}

		var firstWorkDayInScope = fromMonth.FirstWeekdayInMonth();
		var firstWorkDayOutOfScope = firstExcludedMonth.FirstWeekdayInMonth();

		if (consultant.StartDate > firstWorkDayInScope)
		{
			// TODO Forecast
		}

		if (consultant.EndDate < firstWorkDayOutOfScope)
		{
			// TODO Forecast
		}

		return detailedBookings.ToList();
	}

	private static bool TryGetVacations(Consultant consultant, DateOnly fromMonth, DateOnly firstExcludedMonth, out List<Vacation> vacations)
	{
		vacations = consultant.Vacations
			.Where(v => v.Date >= fromMonth && v.Date < firstExcludedMonth)
			.ToList();

		return vacations.Count > 0;
	}

	private static IEnumerable<DetailedBookingForMonth> GetBookings(Consultant consultant, List<DateOnly> months, List<Week> weeks, EngagementState state, BookingType bookingType)
	{
		return consultant.Staffings
			.Where(staffing => staffing.Engagement.State == state)
			.Where(staffing => weeks.Contains(staffing.Week))
			.GroupBy(staffing => staffing.Engagement.Id)
			.Select(projectGroup => new DetailedBookingForMonth(
				BookingDetails: new BookingDetails(
					projectGroup.First().Engagement.Name,
					bookingType,
					projectGroup.First().Engagement.Customer.Name,
					projectGroup.Key,
					ExcludeFromBilling: false,
					projectGroup.First().Engagement.IsBillable,
					projectGroup.First().Engagement.Agreements.Select(a => (DateTime?)a.EndDate).DefaultIfEmpty(null).Max()),
				Hours: months.Select(month => MonthlyHours.For(month, projectGroup.ToList(), consultant.Department.Organization)).ToList()));
	}

	private static IEnumerable<DetailedBookingForMonth> GetPlannedAbsences(Consultant consultant, List<DateOnly> months, List<Week> weeks)
	{
		return consultant.PlannedAbsences
			.Where(absence => weeks.Contains(absence.Week))
			.GroupBy(absence => absence.Absence.Name)
			.Select(absenceGroup => new DetailedBookingForMonth(
				BookingDetails: new BookingDetails(
					absenceGroup.Key,
					BookingType.PlannedAbsence,
					absenceGroup.Key,
					absenceGroup.First().Absence.Id,
					absenceGroup.First().Absence.ExcludeFromBillRate),
				Hours: months.Select(month => MonthlyHours.For(month, absenceGroup.ToList(), consultant.Department.Organization)).ToList()));
	}

	// Using a similar pattern as in GetBookedHours() in StaffingController/ReadModelFactory
	private static BookedHoursInMonth GetBookedHours(Consultant consultant, DateOnly month, IEnumerable<DetailedBookingForMonth> detailedBookings)
	{
        var totalHolidayHours = consultant.Department.Organization.GetTotalHolidayHoursInMonth(month);

        var detailedBookingsArray = detailedBookings as DetailedBookingForMonth[] ?? detailedBookings.ToArray();

        var totalBillable = DetailedBookingForMonth
	        .GetTotalHoursForBookingTypeAndMonth(detailedBookingsArray, month, BookingType.Booking, evaluateBillable: true);

        var totalNonBillable = DetailedBookingForMonth
	        .GetTotalHoursForBookingTypeAndMonth(detailedBookingsArray, month, BookingType.Booking, evaluateBillable: true, isBillable: false);

        var totalOffered = DetailedBookingForMonth
	        .GetTotalHoursForBookingTypeAndMonth(detailedBookingsArray, month, BookingType.Offer);

        var totalAbsence = DetailedBookingForMonth
	        .GetTotalHoursForBookingTypeAndMonth(detailedBookingsArray, month, BookingType.PlannedAbsence);

        var totalNotStartedOrQuit = DetailedBookingForMonth
	        .GetTotalHoursForBookingTypeAndMonth(detailedBookingsArray, month, BookingType.NotStartedOrQuit);

        var totalExcludableAbsence = detailedBookingsArray
            .Where(s => s.BookingDetails is { Type: BookingType.PlannedAbsence, ExcludeFromBilling: true })
            .Select(wh => wh.TotalHoursForMonth(month))
            .Sum();

        var totalVacations = DetailedBookingForMonth
	        .GetTotalHoursForBookingTypeAndMonth(detailedBookingsArray, month, BookingType.Vacation);

        var bookedTime = totalBillable + totalAbsence + totalVacations + totalHolidayHours + totalNonBillable + totalNotStartedOrQuit;

        var workDaysInMonth = month.GetTotalWeekdaysInMonth();
        var hoursPerWorkDay = consultant.Department.Organization.HoursPerWorkday;

        var totalSellableTime = Math.Max(hoursPerWorkDay * workDaysInMonth - bookedTime, 0);
        var totalOverbooked = Math.Max(bookedTime - hoursPerWorkDay * workDaysInMonth, 0);

        return new BookedHoursInMonth(
            month,
            new BookingReadModel(
	            totalBillable,
	            totalOffered,
	            totalAbsence,
	            totalExcludableAbsence,
                totalSellableTime,
                totalHolidayHours,
	            totalVacations,
                totalOverbooked,
	            totalNotStartedOrQuit)
        );
	}

	private static IEnumerable<ForecastForMonth> GetForecasts(Consultant consultant, List<DateOnly> months, List<BookedHoursInMonth> bookingSummary)
	{
		foreach (var month in months)
		{
			var forecastPercentage = consultant.Forecasts
				.SingleOrDefault(f => f.Month.EqualsMonth(month))?
				.AdjustedValue ?? 0;

			var booking = bookingSummary.SingleOrDefault(bs => bs.Month.EqualsMonth(month))?.BookingModel;

			if (booking == null)
			{
				yield return new ForecastForMonth(month, 0, forecastPercentage);
				continue;
			}

			var calculatedPercentage = CalculatePercentage(month, consultant, booking);

			var displayedPercentage = Math.Max((int)calculatedPercentage, forecastPercentage);

			yield return new ForecastForMonth(month, calculatedPercentage, displayedPercentage);
		}
	}

	private static double CalculatePercentage(DateOnly month, Consultant consultant, BookingReadModel booking)
	{
		var organization = consultant.Department.Organization;

		var workdaysInMonth = month.GetTotalWeekdaysInMonth() - organization.GetTotalHolidaysInMonth(month);

		// TODO Forecast: Is this the correct calculation?
		var hoursInMonth = organization.HoursPerWorkday * workdaysInMonth;

		var billableAndOfferedHours = booking.TotalBillable + booking.TotalOffered;

		return billableAndOfferedHours / hoursInMonth;
	}
}
