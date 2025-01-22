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
		return new BookingDetails("Ferie", BookingType.Vacation, "Ferie", ProjectId: 0);
	}
}
