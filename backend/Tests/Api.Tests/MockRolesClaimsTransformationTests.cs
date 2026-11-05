using System.Security.Claims;
using Api.Common;

namespace Tests.Api.Tests;

public class MockRolesClaimsTransformationTests
{
    [Fact]
    public async Task AddsMockRolesToAuthenticatedUser()
    {
        var principal = new ClaimsPrincipal(new ClaimsIdentity([new Claim("name", "Kari")], "Bearer", "name", "roles"));

        var result = await new MockRolesClaimsTransformation(" Vibes.Onboarding , Vibes.Use,").TransformAsync(principal);

        Assert.True(result.IsInRole(AppRoles.Onboarding));
        Assert.True(result.IsInRole("Vibes.Use"));
    }

    [Fact]
    public async Task DoesNotDuplicateExistingRoles()
    {
        var principal = new ClaimsPrincipal(new ClaimsIdentity([new Claim("roles", AppRoles.Onboarding)], "Bearer",
            "name", "roles"));

        var result = await new MockRolesClaimsTransformation(AppRoles.Onboarding).TransformAsync(principal);

        Assert.Single(result.FindAll("roles"));
    }

    [Fact]
    public async Task IgnoresAnonymousUser()
    {
        var principal = new ClaimsPrincipal(new ClaimsIdentity());

        var result = await new MockRolesClaimsTransformation(AppRoles.Onboarding).TransformAsync(principal);

        Assert.False(result.IsInRole(AppRoles.Onboarding));
    }
}
