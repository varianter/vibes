using Core.DomainModels;

namespace Api.VacationsController;

public static class ReadModelFactory
{
    public static VacationReadModel MapToReadModel(int consultantId, List<Vacation> vacations, VacationMetaData vacationMetaData)
    {
        return new VacationReadModel( consultantId, vacations.Select(v => v.Date).ToList(), vacationMetaData);
    }


    public static VacationMetaData GetVacationMetaData(Organization org, List<Vacation> vacations, Consultant consultant)
    {
        var today = DateOnly.FromDateTime(DateTime.Now);
        var total = org.NumberOfVacationDaysInYear;
        var used = consultant.GetUsedVacationDays(today);
        var planned = consultant.GetPlannedVacationDays(today);
        var transferred = consultant.GetTransferredVacationDays();
        var left = total + transferred - used - planned;
        
        return new VacationMetaData(total, transferred, planned, used, left);
    }
}