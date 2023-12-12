using Core.DomainModels;

namespace Api.VacationsController;

public static class ReadModelFactory
{
    public static VacationReadModel MapToReadModel(int consultantId, List<Vacation> vacations, VacationMetaData vacationMetaData)
    {
        return new VacationReadModel( consultantId, vacations.Select(v => v.Date).ToList(), vacationMetaData);
    }


    public static VacationMetaData GetVacationMetaData(Organization org, List<Vacation> vacations)
    {
        var today = DateOnly.FromDateTime(DateTime.Now);
        var total = org.NumberOfVacationDaysInYear;
        var used = vacations.Where(v => v.Date.Year.Equals(today.Year)).Count(v => v.Date < today);
        var planned = vacations.Where(v => v.Date.Year.Equals(today.Year)).Count(v => v.Date > today);
        var left = total - used - planned;
        var transferred = 0; //FIX!!!!
        return new VacationMetaData(total, transferred, planned, used, left);
    }
}