using System.Diagnostics.CodeAnalysis;

namespace Api.Routes;

public static class RouteGroupBuilderExtensions
{
    private static RouteGroupBuilder MapApiGroup(this IEndpointRouteBuilder endpoints,
        [StringSyntax("Route")] string routePrefix, string? groupTag = null)
    {
        var group = endpoints
            .MapGroup(routePrefix)
            .WithOpenApi();

        if (groupTag is not null)
            group.WithTags(groupTag);

        return group;
    }

    public static RouteGroupBuilder ApiGroupVersionOne(this RouteGroupBuilder group)
    {
        group.MapApiGroup("variants", "Varianter").MapConsultantApi();
        return group;
    }
}