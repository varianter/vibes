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
	public static BookingDetails ForVacation()
	{
		// 0 as ProjectId as vacation is weird
		return new BookingDetails(
			"Ferie",
			BookingType.Vacation,
			"Ferie",
			ProjectId: 0);
	}

	public static BookingDetails ForNotStartedOrQuit()
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
