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

    public Consultant LoadConsultantForSingleWeek(string orgUrlKey, int consultantId, Week week)
    {
        var consultant = _dbContext.Consultant
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Single(c => c.Id == consultantId);

        consultant.Staffings = _dbContext.Staffing.Where(staffing =>
                staffing.Week.Equals(week) && staffing.ConsultantId == consultantId).Include(s => s.Project)
            .ThenInclude(p => p.Customer).ToList();

        consultant.PlannedAbsences = _dbContext.PlannedAbsence
            .Where(absence => absence.Week.Equals(week) && absence.ConsultantId == consultantId).Include(a => a.Absence)
            .ToList();

        consultant.Vacations = _dbContext.Vacation.Where(vacation => vacation.ConsultantId == consultantId).ToList();

        return consultant;
    }

    public Consultant? GetBaseConsultantById(int id)
    {
        return _dbContext.Consultant.Include(c => c.Department).ThenInclude(d => d.Organization)
            .SingleOrDefault(c => c.Id == id);
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
                : new List<Staffing>();

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

    private async Task<List<Consultant>> LoadConsultantsFromDbAsync(string orgUrlKey)
    {
        return await Task.Run(() => LoadConsultantsFromDb(orgUrlKey));
    }

    private Staffing CreateStaffing(StaffingKey staffingKey, double hours)
    {
        var consultant = _dbContext.Consultant.Find(staffingKey.ConsultantId);
        var project = _dbContext.Project
            .Find(staffingKey.ProjectId);

        var staffing = new Staffing
        {
            ProjectId = staffingKey.ProjectId,
            Project = project,
            ConsultantId = staffingKey.ConsultantId,
            Consultant = consultant,
            Hours = hours,
            Week = staffingKey.Week
        };
        return staffing;
    }

    private PlannedAbsence CreateAbsence(PlannedAbsenceKey plannedAbsenceKey, double hours)
    {
        var consultant = _dbContext.Consultant.Find(plannedAbsenceKey.ConsultantId);
        var absence = _dbContext.Absence
            .Find(plannedAbsenceKey.AbsenceId);

        var plannedAbsence = new PlannedAbsence
        {
            AbsenceId = plannedAbsenceKey.AbsenceId,
            Absence = absence,
            ConsultantId = plannedAbsenceKey.ConsultantId,
            Consultant = consultant,
            Hours = hours,
            Week = plannedAbsenceKey.Week
        };
        return plannedAbsence;
    }

    public void UpdateOrCreateStaffing(StaffingKey staffingKey, double hours, string orgUrlKey)
    {
        var staffing = _dbContext.Staffing
            .FirstOrDefault(s => s.ProjectId.Equals(staffingKey.ProjectId)
                                 && s.ConsultantId.Equals(staffingKey.ConsultantId)
                                 && s.Week.Equals(staffingKey.Week));


        if (staffing is null)
            _dbContext.Add(CreateStaffing(staffingKey, hours));
        else
            staffing.Hours = hours;

        _dbContext.SaveChanges();
    }


    public void UpdateOrCreatePlannedAbsence(PlannedAbsenceKey plannedAbsenceKey, double hours, string orgUrlKey)
    {
        var plannedAbsence = _dbContext.PlannedAbsence
            .FirstOrDefault(pa => pa.AbsenceId.Equals(plannedAbsenceKey.AbsenceId)
                                  && pa.ConsultantId.Equals(plannedAbsenceKey.ConsultantId)
                                  && pa.Week.Equals(plannedAbsenceKey.Week));

        if (plannedAbsence is null)
            _dbContext.Add(CreateAbsence(plannedAbsenceKey, hours));
        else
            plannedAbsence.Hours = hours;

        _dbContext.SaveChanges();
        _cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");
    }
}