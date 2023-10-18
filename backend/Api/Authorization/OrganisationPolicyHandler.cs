using Microsoft.AspNetCore.Authorization;

namespace Api.Authorization;

public class OrganisationPolicyHandler : AuthorizationHandler<OrganisationRequirement>
{
    private  AuthorizationService _authorizationService;

    public OrganisationPolicyHandler(AuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OrganisationRequirement requirement)
    {
        string userEmail = context.User.Claims.Single(c => c.Type == "preferred_username").Value;
        
        ((DefaultHttpContext) context.Resource).Request.RouteValues.TryGetValue("orgId", out var orgId);
        if(orgId is null) {
            context.Fail();
            return Task.CompletedTask;
        }
        if(_authorizationService.IsInOrganisation(userEmail, orgId.ToString())){
            context.Succeed(requirement);
        }
        
        return Task.CompletedTask;
    }
}