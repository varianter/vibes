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

    public static bool ValidateUpdateEngagementNameWriteModel(UpdateEngagementNameWriteModel updateEngagementNameWriteModel, StorageService storageService, string orgUrlKey)
    {
        return CheckIfEngagementExists(updateEngagementNameWriteModel.EngagementId, storageService) && 
        CheckIfEngagementIsInOrganisation(updateEngagementNameWriteModel.EngagementId, storageService, orgUrlKey) && !string.IsNullOrWhiteSpace(updateEngagementNameWriteModel.EngagementName);  
    }

    public static bool ValidateUpdateEngagementNameAlreadyExist(UpdateEngagementNameWriteModel updateEngagementNameWriteModel,
        StorageService storageService, string orgUrlKey)
    {
        var updatedEngagement = storageService.GetProjectById(updateEngagementNameWriteModel.EngagementId);
        if (updatedEngagement is not null)
        {
            var customer = storageService.GetCustomerFromId(orgUrlKey, updatedEngagement.CustomerId);
            if (customer is not null)
            {
                return customer.Projects.Any(engagement => string.Equals(engagement.Name,
                    updateEngagementNameWriteModel.EngagementName, StringComparison.OrdinalIgnoreCase));
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