using Core.PlannedAbsences;
using Core.Staffings;

namespace Api.Common.Types;

public record BookingDetails(
	string ProjectName,
	BookingType Type,
	string CustomerName,
	int ProjectId,
	bool ExcludeFromBilling = false,
	bool IsBillable = false,
	DateTime? EndDateAgreement = null)
{
	public static BookingDetails Staffing(int projectId, Staffing staffing, BookingType bookingType)
	{
		return new BookingDetails(
			staffing.Engagement.Name,
			bookingType,
			staffing.Engagement.Customer.Name,
			projectId,
			ExcludeFromBilling: false,
			staffing.Engagement.IsBillable,
			staffing.Engagement.Agreements.Select(a => (DateTime?)a.EndDate).DefaultIfEmpty(null).Max());
	}

	public static BookingDetails PlannedAbsence(string name, PlannedAbsence plannedAbsence)
	{
		return new BookingDetails(
			name,
			BookingType.PlannedAbsence,
			name,
			plannedAbsence.Absence.Id,
			plannedAbsence.Absence.ExcludeFromBillRate);
	}

	public static BookingDetails Vacation()
	{
		// 0 as ProjectId as vacation is weird
		return new BookingDetails(
			"Ferie",
			BookingType.Vacation,
			"Ferie",
			ProjectId: 0);
	}

	public static BookingDetails NotStartedOrQuit()
	{
		// 0 as ProjectId since it's just used to mark not started or quit
		return new BookingDetails(
			"Ikke startet eller sluttet",
			BookingType.NotStartedOrQuit,
			"Ikke startet eller sluttet",
			ProjectId: 0,
			ExcludeFromBilling: true);
	}
}
