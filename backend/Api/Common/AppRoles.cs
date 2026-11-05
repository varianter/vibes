using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

namespace Api.Common;

/// <summary>
///     App roles defined on the app registration in Entra ID. Assigned roles arrive in the access token's "roles" claim.
/// </summary>
public static class AppRoles
{
    public const string Onboarding = "Vibes.Onboarding";
}

/// <summary>
///     Adds the roles in the "MockRoles" setting (comma separated) to every authenticated user.
///     Only registered in the Local and Development environments, for testing before roles are assigned in Entra ID.
/// </summary>
public class MockRolesClaimsTransformation(string mockRoles) : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity is not ClaimsIdentity { IsAuthenticated: true } identity)
            return Task.FromResult(principal);

        var roles = mockRoles.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        foreach (var role in roles.Where(role => !principal.IsInRole(role)))
            identity.AddClaim(new Claim(identity.RoleClaimType, role));

        return Task.FromResult(principal);
    }
}
