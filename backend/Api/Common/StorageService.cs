using Core.DomainModels;
using Database.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Common;

public class StorageService
{
    private readonly IMemoryCache _cache;
    private readonly ApplicationContext _dbContext;

    public StorageService(IMemoryCache cache, ApplicationContext context)
    {
        _cache = cache;
        _dbContext = context;
    }

    public List<Consultant> LoadConsultants(string orgUrlKey)
    {
        if (_cache.TryGetValue<List<Consultant>>("asdf", out var consultants))
            if (consultants != null)
                return consultants;

        var loadedConsultants = LoadConsultantsFromDb(orgUrlKey);
        _cache.Set("asdf", loadedConsultants);
        return loadedConsultants;
    }

    private List<Consultant> LoadConsultantsFromDb(string orgUrlKey)
    {
        var consultantList = _dbContext.Consultant
            .Include(consultant => consultant.Department)
            .ThenInclude(department => department.Organization)
            .Where(consultant => consultant.Department.Organization.UrlKey == orgUrlKey)
            .OrderBy(consultant => consultant.Name)
            .ToList();

        var staffingPrConsultant = _dbContext.Staffing
            .Include(s => s.Consultant)
            .Include(staffing => staffing.Project)
            .ThenInclude(project => project.Customer)
            .GroupBy(staffing => staffing.Consultant.Id)
            .ToDictionary(group => group.Key, grouping => grouping.ToList());

        var plannedAbsencePrConsultant = _dbContext.PlannedAbsence
            .Include(absence => absence.Absence)
            .Include(absence => absence.Consultant)
            .GroupBy(absence => absence.Consultant.Id)
            .ToDictionary(grouping => grouping.Key, grouping => grouping.ToList());

        var vacationsPrConsultant = _dbContext.Vacation
            .Include(vacation => vacation.Consultant)
            .GroupBy(vacation => vacation.Consultant.Id)
            .ToDictionary(grouping => grouping.Key, grouping => grouping.ToList());

        var hydratedConsultants = consultantList.Select(consultant =>
        {
            consultant.Staffings = staffingPrConsultant.TryGetValue(consultant.Id, out var staffing)
                ? staffing
                : new List<Core.DomainModels.Staffing>();

            consultant.PlannedAbsences = plannedAbsencePrConsultant.TryGetValue(consultant.Id, out var plannedAbsences)
                ? plannedAbsences
                : new List<PlannedAbsence>();

            consultant.Vacations = vacationsPrConsultant.TryGetValue(consultant.Id, out var vacations)
                ? vacations
                : new List<Vacation>();

            return consultant;
        }).ToList();

        return hydratedConsultants;
    }
}