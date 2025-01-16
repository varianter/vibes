namespace Api.Common.Types;

public record BookingDetails(
	string ProjectName,
	BookingType Type,
	string CustomerName,
	int ProjectId,
	bool ExcludeFromBilling = false,
	bool IsBillable = false,
	DateTime? EndDateAgreement = null);
