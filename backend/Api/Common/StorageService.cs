using Core.DomainModels;
using Database.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Common;

public class StorageService
{
    private const string ConsultantCacheKey = "consultantCacheKey";
    private readonly IMemoryCache _cache;
    private readonly ApplicationContext _dbContext;

    public StorageService(IMemoryCache cache, ApplicationContext context)
    {
        _cache = cache;
        _dbContext = context;
    }

    public List<Consultant> LoadConsultants(string orgUrlKey)
    {
        if (_cache.TryGetValue<List<Consultant>>($"{ConsultantCacheKey}/{orgUrlKey}", out var consultants))
            if (consultants != null)
                return consultants;

        var loadedConsultants = LoadConsultantsFromDb(orgUrlKey);
        _cache.Set($"{ConsultantCacheKey}/{orgUrlKey}", loadedConsultants);
        return loadedConsultants;
    }

    public async Task ReloadCache(string orgUrlKey)
    {
        _cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");
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

    public void UpdateStaffing(int id, double hours)
    {
        var staffing = _dbContext.Staffing.Include(s=>s.Project).ThenInclude(p=> p.Customer).ThenInclude(c=> c.Organization).Include(s=>s.Consultant).FirstOrDefault(staffing => staffing.Id == id);
        if (staffing is null) return;
        var orgUrlKey = staffing.Project.Customer.Organization.UrlKey;
        staffing.Hours = hours;
        _dbContext.SaveChanges();
        var consultantId = staffing.Consultant.Id;
        var consultants = LoadConsultants(orgUrlKey);
        consultants.Single(c => c.Id == consultantId).Staffings.Single(s => s.Id == id).Hours = hours;
        _cache.Set($"{ConsultantCacheKey}/{orgUrlKey}", consultants);
    }

    public void UpdateAbsence(int id, double hours)
    {
        var absence = _dbContext.PlannedAbsence.Include(pa => pa.Absence).ThenInclude(a => a.Organization).Include(pa => pa.Consultant).FirstOrDefault(absence => absence.Id == id);
        if (absence is null) return;
        var orgUrlKey = absence.Absence.Organization.UrlKey;
        absence.Hours = hours;
        _dbContext.SaveChanges();
        var consultantId = absence.Consultant.Id;
        var consultants = LoadConsultants(orgUrlKey);
        consultants.Single(c => c.Id == consultantId).PlannedAbsences.Single(pa => pa.Id == id).Hours = hours;
        _cache.Set($"{ConsultantCacheKey}/{orgUrlKey}", consultants);
    }
}