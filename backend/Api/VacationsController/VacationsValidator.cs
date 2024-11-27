using Core.Consultants;

namespace Api.VacationsController;

public static class VacationsValidator
{
    public static bool ValidateVacation(Consultant consultant,
        string orgUrlKey)
    {
        return consultant.Department.Organization.UrlKey == orgUrlKey;
    }
}