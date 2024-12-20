using Api.Consultants;
using Core.Consultants;
using Core.Customers;
using Core.DomainModels;
using Core.Engagements;
using Core.Organizations;
using Core.PlannedAbsences;
using Core.Staffings;
using Core.Vacations;
using Infrastructure.DatabaseContext;
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

    public void ClearConsultantCache(string orgUrlKey)
    {
        _cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");
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
                staffing.Week.Equals(week) && staffing.ConsultantId == consultantId)
                .Include(s => s.Engagement)
                .ThenInclude(p => p.Customer)
                .Include(s => s.Engagement)
                .ThenInclude(e => e.Agreements).ToList();

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
                weeks.Contains(staffing.Week) && staffing.ConsultantId == consultantId)
                .Include(s => s.Engagement)
                .ThenInclude(p => p.Customer)
                .Include(s => s.Engagement)
                .ThenInclude(e => e.Agreements)
                .ToList();

        consultant.PlannedAbsences = _dbContext.PlannedAbsence
            .Where(absence => weeks.Contains(absence.Week) && absence.ConsultantId == consultantId)
            .Include(a => a.Absence)
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
            .Include(c => c.CompetenceConsultant)
            .ThenInclude(cc => cc.Competence)
            .Where(consultant => consultant.Department.Organization.UrlKey == orgUrlKey)
            .OrderBy(consultant => consultant.Name)
            .ToList();

        var vacationsPrConsultant = _dbContext.Vacation
            .Include(vacation => vacation.Consultant)
            .GroupBy(vacation => vacation.Consultant.Id)
            .ToDictionary(grouping => grouping.Key, grouping => grouping.ToList());

        var hydratedConsultants = consultantList.Select(consultant =>
        {
            consultant.Vacations = vacationsPrConsultant.TryGetValue(consultant.Id, out var vacations)
                ? vacations
                : new List<Vacation>();

            return consultant;
        }).ToList();

        return hydratedConsultants;
    }



    public Consultant? CreateConsultant(Organization org, ConsultantWriteModel body)
    {
        var consultant = new Consultant
        {
            Name = body.Name,
            Email = body.Email,
            StartDate = body.StartDate.HasValue ? DateOnly.FromDateTime(body.StartDate.Value.Date) : null,
            EndDate = body.EndDate.HasValue ? DateOnly.FromDateTime(body.EndDate.Value.Date) : null,
            CompetenceConsultant = new List<CompetenceConsultant>(),
            Staffings = new List<Staffing>(),
            PlannedAbsences = new List<PlannedAbsence>(),
            Vacations = new List<Vacation>(),
            Department = _dbContext.Department.Single(d => d.Id == body.Department.Id),
            GraduationYear = body.GraduationYear,
            Degree = body.Degree
        };
        body?.Competences?.ForEach(c => consultant.CompetenceConsultant.Add(new CompetenceConsultant
        {
            Competence = _dbContext.Competence.Single(comp => comp.Id == c.Id),
            Consultant = consultant,
            CompetencesId = c.Id,
            ConsultantId = consultant.Id
        }));

        _dbContext.Consultant.Add(consultant);


        _dbContext.SaveChanges();
        ClearConsultantCache(org.UrlKey);

        return consultant;
    }

    public Consultant? UpdateConsultant(Organization org, ConsultantWriteModel body)
    {
        var consultant = _dbContext.Consultant
            .Include(c => c.CompetenceConsultant)
            .Single(c => c.Id == body.Id);

        if (consultant is not null)
        {
            consultant.Name = body.Name;
            consultant.Email = body.Email;
            consultant.StartDate = body.StartDate.HasValue ? DateOnly.FromDateTime(body.StartDate.Value.Date) : null;
            consultant.EndDate = body.EndDate.HasValue ? DateOnly.FromDateTime(body.EndDate.Value.Date) : null;
            consultant.Department = _dbContext.Department.Single(d => d.Id == body.Department.Id);
            consultant.GraduationYear = body.GraduationYear;
            consultant.Degree = body.Degree;

            // Clear the CompetenceConsultant collection
            consultant.CompetenceConsultant.Clear();

            // For each new competence, create a new CompetenceConsultant entity
            foreach (var competence in body?.Competences)
                consultant.CompetenceConsultant.Add(new CompetenceConsultant
                {
                    ConsultantId = consultant.Id,
                    CompetencesId = competence.Id,
                    Competence = _dbContext.Competence.Single(comp => comp.Id == competence.Id),
                    Consultant = consultant
                });
        }

        _dbContext.SaveChanges();
        ClearConsultantCache(org.UrlKey);

        return consultant;
    }

    public Customer UpdateOrCreateCustomer(Organization org, string customerName, string orgUrlKey)
    {
        var customer = _dbContext.Customer.Where(c => c.OrganizationId == org.Id)
            .SingleOrDefault(c => c.Name == customerName);

        if (customer is null)
        {
            customer = new Customer
            {
                Name = customerName,
                Organization = org,
                Projects = []
            };

            _dbContext.Customer.Add(customer);
        }

        _dbContext.SaveChanges();
        ClearConsultantCache(orgUrlKey);

        return customer;
    }

    public Engagement? GetProjectById(int id)
    {
        return _dbContext.Project.Find(id);
    }

    public Engagement GetProjectWithOrganisationById(int id)
    {
        return _dbContext.Project
            .Where(p => p.Id == id)
            .Include(p => p.Customer)
            .ThenInclude(c => c.Organization)
            .Single(p => p.Id == id);
    }

    public Customer? GetCustomerFromId(string orgUrlKey, int customerId)
    {
        return _dbContext.Customer
            .Include(c => c.Organization)
            .Include(c => c.Projects)
            .ThenInclude(p => p.Staffings)
            .SingleOrDefault(customer => customer.Organization.UrlKey == orgUrlKey && customer.Id.Equals(customerId));
    }

    public List<Vacation> LoadConsultantVacation(int consultantId)
    {
        return _dbContext.Vacation.Where(v => v.ConsultantId == consultantId).ToList();
    }

    public void RemoveVacationDay(int consultantId, DateOnly date, string orgUrlKey)
    {
        var vacation = _dbContext.Vacation.Single(v => v.ConsultantId == consultantId && v.Date.Equals(date));

        _dbContext.Vacation.Remove(vacation);
        _dbContext.SaveChanges();

        _cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");
    }

    public void AddVacationDay(int consultantId, DateOnly date, string orgUrlKey)
    {
        var consultant = _dbContext.Consultant.Single(c => c.Id == consultantId);
        if (_dbContext.Vacation.Any(v => v.ConsultantId == consultantId && v.Date.Equals(date))) return;
        var vacation = new Vacation
        {
            ConsultantId = consultantId,
            Consultant = consultant,
            Date = date
        };
        _dbContext.Add(vacation);
        _dbContext.SaveChanges();

        _cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");
    }
}