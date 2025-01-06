using Api.Consultants;
using Core.Consultants;
using Core.Customers;
using Core.Engagements;
using Core.Organizations;
using Core.Vacations;
using Core.Weeks;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using NuGet.Packaging;

namespace Api.Common;

public class StorageService(IMemoryCache cache, ApplicationContext context)
{
    private const string ConsultantCacheKey = "consultantCacheKey";

    public void ClearConsultantCache(string orgUrlKey)
    {
        cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");
    }

    public List<Consultant> LoadConsultants(string orgUrlKey)
    {
        if (cache.TryGetValue<List<Consultant>>($"{ConsultantCacheKey}/{orgUrlKey}", out var consultants) &&
            consultants != null) return consultants;

        var loadedConsultants = LoadConsultantsFromDb(orgUrlKey);
        cache.Set($"{ConsultantCacheKey}/{orgUrlKey}", loadedConsultants);
        return loadedConsultants;
    }

    public Consultant LoadConsultantForSingleWeek(int consultantId, Week week)
    {
        var consultant = context.Consultant
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Single(c => c.Id == consultantId);

        consultant.Staffings = context.Staffing.Where(staffing =>
                staffing.Week.Equals(week) && staffing.ConsultantId == consultantId)
            .Include(s => s.Engagement)
            .ThenInclude(p => p.Customer)
            .Include(s => s.Engagement)
            .ThenInclude(e => e.Agreements).ToList();

        consultant.PlannedAbsences = context.PlannedAbsence
            .Where(absence => absence.Week.Equals(week) && absence.ConsultantId == consultantId).Include(a => a.Absence)
            .ToList();

        consultant.Vacations = context.Vacation.Where(vacation => vacation.ConsultantId == consultantId).ToList();

        return consultant;
    }

    public Consultant LoadConsultantForWeekSet(int consultantId, List<Week> weeks)
    {
        var consultant = context.Consultant
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Single(c => c.Id == consultantId);


        consultant.Staffings = context.Staffing.Where(staffing =>
                weeks.Contains(staffing.Week) && staffing.ConsultantId == consultantId)
            .Include(s => s.Engagement)
            .ThenInclude(p => p.Customer)
            .Include(s => s.Engagement)
            .ThenInclude(e => e.Agreements)
            .ToList();

        consultant.PlannedAbsences = context.PlannedAbsence
            .Where(absence => weeks.Contains(absence.Week) && absence.ConsultantId == consultantId)
            .Include(a => a.Absence)
            .ToList();

        consultant.Vacations = context.Vacation.Where(vacation => vacation.ConsultantId == consultantId).ToList();

        return consultant;
    }

    public Consultant? GetBaseConsultantById(int id)
    {
        return context.Consultant.Include(c => c.Department).ThenInclude(d => d.Organization)
            .SingleOrDefault(c => c.Id == id);
    }

    private List<Consultant> LoadConsultantsFromDb(string orgUrlKey)
    {
        var consultantList = context.Consultant
            .Include(consultant => consultant.Department)
            .ThenInclude(department => department.Organization)
            .Include(c => c.CompetenceConsultant)
            .ThenInclude(cc => cc.Competence)
            .Where(consultant => consultant.Department.Organization.UrlKey == orgUrlKey)
            .OrderBy(consultant => consultant.Name)
            .ToList();

        var vacationsPrConsultant = context.Vacation
            .Include(vacation => vacation.Consultant)
            .Where(vacation => vacation.Consultant != null)
            .GroupBy(vacation => vacation.Consultant!.Id)
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


    public async Task<Consultant> CreateConsultant(Organization org, ConsultantWriteModel body,
        CancellationToken cancellationToken)
    {
        var consultant = new Consultant
        {
            Name = body.Name,
            Email = body.Email,
            StartDate = body.StartDate.HasValue ? DateOnly.FromDateTime(body.StartDate.Value.Date) : null,
            EndDate = body.EndDate.HasValue ? DateOnly.FromDateTime(body.EndDate.Value.Date) : null,
            CompetenceConsultant = new List<CompetenceConsultant>(),
            Staffings = [],
            PlannedAbsences = [],
            Vacations = [],
            Department = await context.Department.SingleAsync(d => d.Id == body.Department.Id, cancellationToken),
            GraduationYear = body.GraduationYear,
            Degree = body.Degree
        };

        var competenceIds = body.Competences?.Select(c => c.Id).ToArray() ?? [];
        var competences = await context.Competence
            .Where(c => competenceIds.Contains(c.Id))
            .ToArrayAsync(cancellationToken);

        consultant.CompetenceConsultant.AddRange(competences.Select(c => new CompetenceConsultant
        {
            Competence = c,
            Consultant = consultant,
            CompetencesId = c.Id,
            ConsultantId = consultant.Id
        }));

        context.Consultant.Add(consultant);


        await context.SaveChangesAsync(cancellationToken);
        ClearConsultantCache(org.UrlKey);

        return consultant;
    }

    public async Task<Consultant?> UpdateConsultant(Organization org, ConsultantWriteModel body,
        CancellationToken cancellationToken)
    {
        var consultant = await context.Consultant
            .Include(c => c.CompetenceConsultant)
            .FirstOrDefaultAsync(c => c.Id == body.Id, cancellationToken);

        if (consultant is null) return null;

        var department =
            await context.Department.FirstOrDefaultAsync(d => d.Id == body.Department.Id, cancellationToken);

        consultant.Name = body.Name;
        consultant.Email = body.Email;
        consultant.StartDate = body.StartDate.HasValue ? DateOnly.FromDateTime(body.StartDate.Value.Date) : null;
        consultant.EndDate = body.EndDate.HasValue ? DateOnly.FromDateTime(body.EndDate.Value.Date) : null;
        if (department is not null) consultant.Department = department;
        consultant.GraduationYear = body.GraduationYear;
        consultant.Degree = body.Degree;

        // Clear the CompetenceConsultant collection
        consultant.CompetenceConsultant.Clear();

        // For each new competence, create a new CompetenceConsultant entity
        var competenceIds = body.Competences?.Select(c => c.Id).ToArray() ?? [];
        var competences = await context.Competence.Where(c => competenceIds.Contains(c.Id))
            .ToArrayAsync(cancellationToken);
        foreach (var competence in competences)
            consultant.CompetenceConsultant.Add(new CompetenceConsultant
            {
                ConsultantId = consultant.Id,
                CompetencesId = competence.Id,
                Competence = competence,
                Consultant = consultant
            });

        await context.SaveChangesAsync(cancellationToken);
        ClearConsultantCache(org.UrlKey);


        return consultant;
    }

    public Customer DeactivateOrActivateCustomer(int customerId, Organization org, bool active, string orgUrlKey)
    {
        var customer = GetCustomerFromId(orgUrlKey, customerId);
        if (customer is null) return null;

        customer.IsActive = active;
        _dbContext.Customer.Update(customer);
        _dbContext.SaveChanges();
        ClearConsultantCache(orgUrlKey);

        return customer;
    }

    public Customer FindOrCreateCustomer(Organization org, string customerName, string orgUrlKey)
    {
        var customer = context.Customer.Where(c => c.OrganizationId == org.Id)
            .SingleOrDefault(c => c.Name == customerName);

        if (customer is null)
        {
            customer = new Customer
            {
                Name = customerName,
                Organization = org,
                OrganizationId = org.Id,
                Projects = [],
                IsActive = true
            };

            _dbContext.Customer.Add(customer);
            _dbContext.SaveChanges();
            ClearConsultantCache(orgUrlKey);
        }


        return customer;
    }

    public Engagement? GetProjectById(int id)
    {
        return context.Project.Find(id);
    }

    public Engagement GetProjectWithOrganisationById(int id)
    {
        return context.Project
            .Where(p => p.Id == id)
            .Include(p => p.Customer)
            .ThenInclude(c => c.Organization)
            .Single(p => p.Id == id);
    }

    public Customer? GetCustomerFromId(string orgUrlKey, int customerId)
    {
        return context.Customer
            .Include(c => c.Organization)
            .Include(c => c.Projects)
            .ThenInclude(p => p.Staffings)
            .SingleOrDefault(customer => customer.Organization.UrlKey == orgUrlKey && customer.Id.Equals(customerId));
    }

    public List<Vacation> LoadConsultantVacation(int consultantId)
    {
        return context.Vacation.Where(v => v.ConsultantId == consultantId).ToList();
    }

    public void RemoveVacationDay(int consultantId, DateOnly date, string orgUrlKey)
    {
        var vacation = context.Vacation.Single(v => v.ConsultantId == consultantId && v.Date.Equals(date));

        context.Vacation.Remove(vacation);
        context.SaveChanges();

        cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");
    }

    public void AddVacationDay(int consultantId, DateOnly date, string orgUrlKey)
    {
        var consultant = context.Consultant.Single(c => c.Id == consultantId);
        if (context.Vacation.Any(v => v.ConsultantId == consultantId && v.Date.Equals(date))) return;
        var vacation = new Vacation
        {
            ConsultantId = consultantId,
            Consultant = consultant,
            Date = date
        };
        context.Add(vacation);
        context.SaveChanges();

        cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");
    }
}