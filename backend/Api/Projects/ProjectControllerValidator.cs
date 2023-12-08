using Api.Common;

namespace Api.Projects;

public static class ProjectControllerValidator
{
    public static bool ValidateUpdateProjectWriteModel(UpdateProjectWriteModel updateProjectWriteModel,
        StorageService storageService,
        string orgUrlKey)
    {
        return CheckIfEngagementExists(updateProjectWriteModel.EngagementId, storageService) &&
               CheckIfEngagementIsInOrganisation(updateProjectWriteModel.EngagementId, storageService, orgUrlKey);
    }

    private static bool CheckIfEngagementExists(int engagementId, StorageService storageService)
    {
        return storageService.GetProjectById(engagementId) is not null;
    }

    private static bool CheckIfEngagementIsInOrganisation(int engagementId, StorageService storageService,
        string orgUrlKey)
    {
        return storageService.GetProjectWithOrganisationById(engagementId).Customer.Organization.UrlKey == orgUrlKey;
    }
}