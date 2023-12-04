using Api.Organisation;
using Api.Projects;
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

    public Consultant LoadConsultantForSingleWeek(int consultantId, Week week)
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

    public Consultant LoadConsultantForWeekSet(int consultantId, List<Week> weeks)
    {
        var consultant = _dbContext.Consultant
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Single(c => c.Id == consultantId);


        consultant.Staffings = _dbContext.Staffing.Where(staffing =>
                weeks.Contains(staffing.Week) && staffing.ConsultantId == consultantId).Include(s => s.Project)
            .ThenInclude(p => p.Customer).ToList();

        consultant.PlannedAbsences = _dbContext.PlannedAbsence
            .Where(absence => weeks.Contains(absence.Week) && absence.ConsultantId == consultantId).Include(a => a.Absence)
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
        _cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");

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

    public void UpdateOrCreateStaffings(int consultantId, int projectId, List<Week> weeks, double hours, string orgUrlKey)
    {
        var consultant = _dbContext.Consultant.Find(consultantId);
        var project = _dbContext.Project
            .Find(projectId);

        var org = _dbContext.Organization.FirstOrDefault(o => o.UrlKey == orgUrlKey);

        foreach (var week in weeks)
        {
            var newHours = hours;
            if (org != null)
            {
                var holidayHours = org.GetTotalHolidayHoursOfWeek(week);
                var vacations = _dbContext.Vacation.Where(v => v.ConsultantId.Equals(consultantId)).ToList();
                var vacationHours = vacations.Count(v => week.ContainsDate(v.Date)) * org.HoursPerWorkday;
                var plannedAbsenceHours = _dbContext.PlannedAbsence.Where(pa => pa.Week.Equals(week) && pa.ConsultantId.Equals(consultantId))
                .Select(pa => pa.Hours).Sum();

                var total = holidayHours + vacationHours + plannedAbsenceHours;

                newHours = (hours + total > org.HoursPerWorkday * 5)
                    ? Math.Max(org.HoursPerWorkday * 5 - total, 0)
                    : hours;
            }
            var staffing = _dbContext.Staffing
                .FirstOrDefault(s => s.ProjectId.Equals(projectId)
                                     && s.ConsultantId.Equals(consultantId)
                                     && s.Week.Equals(week));
            if (staffing is null)
            {
                _dbContext.Add(new Staffing
                {
                    ProjectId = projectId,
                    Project = project,
                    ConsultantId = consultantId,
                    Consultant = consultant,
                    Hours = newHours,
                    Week = week,
                });
            }
            else
                staffing.Hours = newHours;
        }
        _dbContext.SaveChanges();
        _cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");

    }


    public void UpdateOrCreatePlannedAbsences(int consultantId, int absenceId, List<Week> weeks, double hours, string orgUrlKey)
    {
        var consultant = _dbContext.Consultant.Find(consultantId);
        var absence = _dbContext.Absence
            .Find(absenceId);

        var org = _dbContext.Organization.FirstOrDefault(o => o.UrlKey == orgUrlKey);
        foreach (var week in weeks)
        {
            var newHours = hours;
            if (org != null)
            {
                var holidayHours = org.GetTotalHolidayHoursOfWeek(week);
                newHours = holidayHours + hours > org.HoursPerWorkday * 5
                    ? Math.Max(org.HoursPerWorkday * 5 - holidayHours, 0)
                    : hours;
            }

            var plannedAbsence = _dbContext.PlannedAbsence
                .FirstOrDefault(pa => pa.AbsenceId.Equals(absenceId)
                                      && pa.ConsultantId.Equals(consultantId)
                                      && pa.Week.Equals(week));

            if (plannedAbsence is null)
            {
                _dbContext.Add(new PlannedAbsence
                {
                    AbsenceId = absenceId,
                    Absence = absence,
                    ConsultantId = consultantId,
                    Consultant = consultant,
                    Hours = newHours,
                    Week = week
                });
            }
            else
                plannedAbsence.Hours = newHours;
        }

        _dbContext.SaveChanges();
        _cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");
    }


    public Customer UpdateOrCreateCustomer(Organization org, string customerName, string orgUrlKey)
    {
        var customer = _dbContext.Customer.SingleOrDefault(c => c.Id == body.CustomerId);

        if (customer is null)
        {
            customer = new Customer
            {
                Name = customerName,
                Organization = org,
                Projects = new List<Project>()
            };

            _dbContext.Customer.Add(customer);
        }
        _dbContext.SaveChanges();
        _cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");

        return customer;
    }

    public Project UpdateOrCreateProject(Customer customer, ProjectWriteModel payload, string orgUrlKey)
    {

        var project = _dbContext.Project.SingleOrDefault(p => p.Id == payload.EngagementId);

        if (project is null && payload.ProjectName is not null)
        {
            project = new Project
            {
                Customer = customer,
                State = payload.BookingType,
                Staffings = new List<Staffing>(),
                Consultants = new List<Consultant>(),
                Name = payload.ProjectName,
                IsBillable = payload.IsBillable
            };

            _dbContext.Project.Add(project);
        }
        else
        {
            project.State = payload.BookingType;
            project.IsBillable = payload.IsBillable;
        }

        _dbContext.SaveChanges();
        _cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");
        return project;
    }
}