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

    public static bool ValidateUpdateProjectNameWriteModel(UpdateProjectNameWriteModel updateProjectNameWriteModel, StorageService storageService, string orgUrlKey)
    {
        return CheckIfEngagementExists(updateProjectNameWriteModel.EngagementId, storageService) && 
        CheckIfEngagementIsInOrganisation(updateProjectNameWriteModel.EngagementId, storageService, orgUrlKey) && !string.IsNullOrWhiteSpace(updateProjectNameWriteModel.EngagementName);  
    }

    public static bool ValidateUpdateProjectNameAlreadyExist(UpdateProjectNameWriteModel updateProjectNameWriteModel,
        StorageService storageService, string orgUrlKey)
    {
        var updatedEngagement = storageService.GetProjectById(updateProjectNameWriteModel.EngagementId);
        if (updatedEngagement is not null)
        {
            var customer = storageService.GetCustomerFromId(orgUrlKey, updatedEngagement.CustomerId);
            if (customer is not null)
            {
                return customer.Projects.Any(engagement => string.Equals(engagement.Name,
                    updateProjectNameWriteModel.EngagementName, StringComparison.OrdinalIgnoreCase));
            }
        }
        return false;
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