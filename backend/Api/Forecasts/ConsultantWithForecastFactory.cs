using Api.Common.Types;
using Api.Consultants;
using Api.Helpers;
using Core.Consultants;
using Core.Engagements;
using Core.Extensions;
using Core.Vacations;
using Core.Weeks;

namespace Api.Forecasts;

public static class ConsultantWithForecastFactory
{
	public static List<ConsultantWithForecast> CreateMultiple(List<Consultant> consultants, DateOnly fromMonth, int monthCount)
	{
		var toMonthExclusive = fromMonth.AddMonths(monthCount);

		return consultants
			.Where(c => c.EndDate == null || c.EndDate > fromMonth)
			.Where(c => c.StartDate == null || c.StartDate < toMonthExclusive)
			.Select(consultant => CreateSingle(consultant, fromMonth, toMonthExclusive))
			.ToList();
	}

	public static ConsultantWithForecast CreateSingle(Consultant consultant, DateOnly fromMonth, DateOnly firstExcludedMonth)
	{
		var months = fromMonth.GetMonthsUntil(firstExcludedMonth).ToList();

		var detailedBookings = GetDetailedBookings(consultant, months, fromMonth, firstExcludedMonth);

		var bookingSummary = months
			.Select(month => GetBookedHours(consultant, month, detailedBookings))
			.ToList();

		var forecasts = months
			.Select(month => ForecastForMonth.GetFor(consultant, month, bookingSummary))
			.ToList();

		var isAvailable = bookingSummary.Any(bs => bs.BookingModel.TotalSellableTime.IsGreaterThan(0));

		return new ConsultantWithForecast(new SingleConsultantReadModel(consultant), bookingSummary, detailedBookings, forecasts, isAvailable);
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

		var organization = consultant.Department.Organization;

		if (TryGetVacations(consultant, fromMonth, firstExcludedMonth, out var vacations))
		{
			var vacationHoursPerMonth = months
				.Select(month => new MonthlyHours(
					month,
					Hours: organization.HoursPerWorkday *
						   vacations.Count(v => v.Date.EqualsMonth(month))))
				.ToList();

			detailedBookings = detailedBookings.Append(new DetailedBookingForMonth(
				BookingDetails.Vacation(),
				Hours: vacationHoursPerMonth));
		}

		var firstWorkDayInScope = fromMonth.FirstWeekdayInMonth();
		var firstWorkDayOutOfScope = firstExcludedMonth.FirstWeekdayInMonth();

		if (consultant.StartDate > firstWorkDayInScope)
		{
			var monthlyWorkHoursBeforeStartDate =
				WorkloadHelper.CalculateMonthlyWorkHoursBefore(consultant.StartDate.Value, months, organization);

			detailedBookings = detailedBookings.Append(DetailedBookingForMonth.NotStartedOrQuit(monthlyWorkHoursBeforeStartDate));
		}

		if (consultant.EndDate < firstWorkDayOutOfScope)
		{
			var monthlyWorkHoursAfterEndDate =
				WorkloadHelper.CalculateMonthlyWorkHoursAfter(consultant.EndDate.Value, months, organization);

			detailedBookings = detailedBookings.Append(DetailedBookingForMonth.NotStartedOrQuit(monthlyWorkHoursAfterEndDate));
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
				BookingDetails.Staffing(projectGroup.Key, projectGroup.First(), bookingType),
				Hours: months.Select(month => MonthlyHours.For(month, projectGroup.ToList(), consultant)).ToList()));
	}

	private static IEnumerable<DetailedBookingForMonth> GetPlannedAbsences(Consultant consultant, List<DateOnly> months, List<Week> weeks)
	{
		return consultant.PlannedAbsences
			.Where(absence => weeks.Contains(absence.Week))
			.GroupBy(absence => absence.Absence.Name)
			.Select(absenceGroup => new DetailedBookingForMonth(
				BookingDetails.PlannedAbsence(absenceGroup.Key, absenceGroup.First()),
				Hours: months.Select(month => MonthlyHours.For(month, absenceGroup.ToList(), consultant)).ToList()));
	}

	// Using a similar pattern as in GetBookedHours() in StaffingController/ReadModelFactory
	private static BookedHoursInMonth GetBookedHours(Consultant consultant, DateOnly month, IEnumerable<DetailedBookingForMonth> detailedBookings)
	{
		var organization = consultant.Department.Organization;

		var totalHolidayHours = organization.GetTotalHolidayHoursInMonth(month);

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

		var bookedHours = totalBillable + totalAbsence + totalVacations + totalHolidayHours + totalNonBillable + totalNotStartedOrQuit;

		var hoursInMonth = organization.GetTotalWeekdayHoursInMonth(month);

		var sellableHours = Math.Max(hoursInMonth - bookedHours, 0);
		var overbookedHours = Math.Max(bookedHours - hoursInMonth, 0);

		return new BookedHoursInMonth(
			month,
			new BookingReadModel(
				totalBillable,
				totalOffered,
				totalAbsence,
				totalExcludableAbsence,
				sellableHours,
				totalHolidayHours,
				totalVacations,
				overbookedHours,
				totalNotStartedOrQuit)
		);
	}
}
