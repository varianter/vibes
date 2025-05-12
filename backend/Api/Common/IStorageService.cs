using Api.Consultants;
using Core.Consultants;
using Core.Customers;
using Core.Engagements;
using Core.Organizations;
using Core.Vacations;
using Core.Weeks;

namespace Api.Common;

public interface IStorageService
{
    List<Consultant> LoadConsultants(string orgUrlKey);
    Consultant? LoadConsultantForSingleWeek(int consultantId, Week week);
    Consultant? LoadConsultantForWeekSet(int consultantId, List<Week> weeks);
    Consultant? GetBaseConsultantById(int id);

    Task<Consultant> CreateConsultant(Organization org, ConsultantWriteModel body,
        CancellationToken cancellationToken);

    Task<Consultant?> UpdateConsultant(Organization org, ConsultantWriteModel body,
        CancellationToken cancellationToken);

    Customer? DeactivateOrActivateCustomer(int customerId, Organization org, bool active, string orgUrlKey);

    Task<Customer> FindOrCreateCustomer(Organization org, string customerName, string orgUrlKey,
        CancellationToken cancellationToken);

    Engagement? GetProjectById(int id);
    Engagement? GetProjectWithOrganisationById(int id);
    Customer? GetCustomerFromId(string orgUrlKey, int customerId);
    List<Vacation> LoadConsultantVacation(int consultantId);
    void RemoveVacationDay(int consultantId, DateOnly date, string orgUrlKey);
    void AddVacationDay(int consultantId, DateOnly date, string orgUrlKey);
}
