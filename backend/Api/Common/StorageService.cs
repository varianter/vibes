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

    public List<Project> LoadProjects(string orgUrlKey)
    {
        return _dbContext.Project
            .Include(p => p.Customer)
            .ThenInclude(c => c.Organization)
            .Where(project => project.Customer.Organization.UrlKey == orgUrlKey)
            .ToList();
    }
    
    public List<Absence> LoadAbsences(string orgUrlKey)
    {
        return _dbContext.Absence
            .Include(a => a.Organization)
            .Where(absence => absence.Organization.UrlKey == orgUrlKey)
            .ToList();
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

    private Core.DomainModels.Staffing CreateStaffing(StaffingKey staffingKey, double hours )
    {
        var consultant = _dbContext.Consultant.First(c => c.Id == staffingKey.ConsultantId);
        var project = _dbContext.Project
            .First(project => project.Id == staffingKey.ProjectId);
        
        var staffing = new Core.DomainModels.Staffing
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
        var consultant = _dbContext.Consultant.First(c => c.Id == plannedAbsenceKey.ConsultantId);
        var absence = _dbContext.Absence
            .First(absence => absence.Id == plannedAbsenceKey.AbsenceId);
        
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
        var consultants = LoadConsultants(orgUrlKey);
        var staffing = _dbContext.Staffing
            .FirstOrDefault(s => s.ProjectId.Equals(staffingKey.ProjectId)
                                 && s.ConsultantId.Equals(staffingKey.ConsultantId) 
                                 && s.Week.Equals(staffingKey.Week));

        if (staffing is null)
        {
            var newStaffing = CreateStaffing(staffingKey, hours);
            consultants.Single(c => c.Id == staffingKey.ConsultantId).Staffings.Add(newStaffing);
        }
        else
        {
            staffing.Hours = hours;
            consultants
                .Single(c => c.Id == staffingKey.ConsultantId).Staffings
                .Single(s => s.ProjectId.Equals(staffingKey.ProjectId) 
                             && s.ConsultantId.Equals(staffingKey.ConsultantId) 
                             && s.Week.Equals(staffingKey.Week))
                .Hours = hours;
        }
        
        _dbContext.SaveChanges();
        _cache.Set($"{ConsultantCacheKey}/{orgUrlKey}", consultants);
    }
    
    
    public void UpdateOrCreatePlannedAbsence(PlannedAbsenceKey plannedAbsenceKey, double hours, string orgUrlKey)
    {
        var consultants = LoadConsultants(orgUrlKey);
        var plannedAbsence = _dbContext.PlannedAbsence
            .FirstOrDefault(pa => pa.AbsenceId.Equals(plannedAbsenceKey.AbsenceId) 
                                  && pa.ConsultantId.Equals(plannedAbsenceKey.ConsultantId) 
                                  && pa.Week.Equals(plannedAbsenceKey.Week));

        if (plannedAbsence is null)
        {
            var newPlannedAbsence = CreateAbsence(plannedAbsenceKey, hours);
            consultants.Single(c => c.Id == plannedAbsenceKey.ConsultantId).PlannedAbsences.Add(newPlannedAbsence);
        }
        else
        {
            plannedAbsence.Hours = hours;
            consultants
                .Single(c => c.Id == plannedAbsenceKey.ConsultantId).PlannedAbsences
                .Single(pa => pa.AbsenceId.Equals(plannedAbsenceKey.AbsenceId) 
                && pa.ConsultantId.Equals(plannedAbsenceKey.ConsultantId) 
                && pa.Week.Equals(plannedAbsenceKey.Week)).Hours = hours;
        }
        
        _dbContext.SaveChanges();
        _cache.Set($"{ConsultantCacheKey}/{orgUrlKey}", consultants);
    }
}