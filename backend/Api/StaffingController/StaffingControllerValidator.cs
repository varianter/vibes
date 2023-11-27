using Api.Common;

namespace Api.StaffingController;

public static class StaffingControllerValidator
{
    public static bool ValidateStaffingWriteModel(StaffingWriteModel staffingWriteModel, StorageService storageService,
        string orgUrlKey)
    {
        return storageService.GetBaseConsultantById(staffingWriteModel.ConsultantId)?.Department.Organization.UrlKey ==
               orgUrlKey;
    }

    public static bool ValidateStaffingWriteModel(SeveralStaffingWriteModel staffingWriteModel, StorageService storageService,
        string orgUrlKey)
    {
        return storageService.GetBaseConsultantById(staffingWriteModel.ConsultantId)?.Department.Organization.UrlKey ==
               orgUrlKey;
    }

}