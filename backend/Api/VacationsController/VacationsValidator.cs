using Api.Common;

namespace Api.VacationsController;

public static class VacationsValidator
{
    public static bool ValidateVacation(int consultantId, StorageService storageService,
        string orgUrlKey)
    {
        return storageService.GetBaseConsultantById(consultantId)?.Department.Organization.UrlKey ==
               orgUrlKey;
    }
}