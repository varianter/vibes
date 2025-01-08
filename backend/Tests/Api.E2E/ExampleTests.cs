using Bogus;
using Bogus.DataSets;
using Core.Customers;
using Core.Organizations;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Tests.Api.E2E.Shared;

namespace Tests.Api.E2E;

[Collection(ApiTestCollection.CollectionName)]
public class ExampleTests(ApiFactory apiFactory) : TestsBase(apiFactory)
{

    private static Faker<Organization> CompanyFaker = new();
    
    [Fact]
    public async Task Can_Make_Database_Calls()
    {
        var faker = new Faker();
        var orgName = faker.Company.CompanyName();

        var org = CompanyFaker.Generate();
        
        var organization = new Organization
        {
            Id = faker.Random.Guid().ToString(),
            Name = orgName,
            UrlKey = orgName.ToLower().Replace(" ", ""),
            Country = faker.Address.Country(),
            NumberOfVacationDaysInYear = faker.Random.Int(20, 30),
            HasVacationInChristmas = faker.Random.Bool(),
            HoursPerWorkday = faker.Random.Int(6,9),
            Departments = [],
            Customers = [],
            AbsenceTypes = []
        };

        DatabaseContext.Organization.Add(organization);
        await DatabaseContext.SaveChangesAsync();
        DatabaseContext.ChangeTracker.Clear();

        var fetchedOrganization = await DatabaseContext.Organization
            .Include(x => x.Departments)
            .Include(x => x.Customers)
            .Include(x => x.AbsenceTypes)
            .FirstOrDefaultAsync();
        
        fetchedOrganization.Should().BeEquivalentTo(organization);
    }
}