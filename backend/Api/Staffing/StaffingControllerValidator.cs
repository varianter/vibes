using Api.Common;
using Core.DomainModels;

namespace Api.Staffing;

public static class StaffingControllerValidator
{

    public static bool OrganisationContainsProject(Organization? organization, Project? project)
    {
        if (organization is null || project is null) return false;
        return project.Customer.Organization.Id.Equals(organization.Id);
    }

    public static bool OrganisationContainsPlannedAbsence(Organization? organization, PlannedAbsence? plannedAbsence)
    {
        if (organization is null || plannedAbsence is null) return false;
        return plannedAbsence.Absence.Organization.Id.Equals(organization.Id);
    }

    public static bool ValidateStaffingWriteModel(StaffingWriteModel staffingWriteModel, StorageService storageService,
        string orgUrlKey)
    {
        return storageService.LoadConsultants(orgUrlKey).Any(c => c.Id == staffingWriteModel.ConsultantId);
    }

}