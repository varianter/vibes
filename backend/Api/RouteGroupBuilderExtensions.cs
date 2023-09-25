using System.Diagnostics.CodeAnalysis;

namespace backend.Api;

public static class RouteGroupBuilderExtensions
{
    public static RouteGroupBuilder MapApiGroup(this IEndpointRouteBuilder endpoints,
        [StringSyntax("Route")] string routePrefix, string? groupTag = null)
    {
        var group = endpoints
            .MapGroup(routePrefix)
            .WithOpenApi();

        if (groupTag is not null)
            group.WithTags(groupTag);

        return group;
    }
}