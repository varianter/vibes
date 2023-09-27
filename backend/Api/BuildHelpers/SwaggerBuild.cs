using Api.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Api.BuildHelpers;

public abstract class SwaggerBuild
{
    public static void AddSwaggerOAuthSetupAction(AzureAdOptions? settings, SwaggerGenOptions c)
    {
        var scopes = new Dictionary<string, string>
        {
            { $"{settings.ApiScope}", "Access API backend on user behalf" }
        };

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "oauth2" }
                },
                new[] { settings.ApiScope }
            }
        });

        c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.OAuth2,
                Flows = new OpenApiOAuthFlows
                {
                    Implicit = new OpenApiOAuthFlow
                    {
                        AuthorizationUrl = settings.AuthorizationUrl(),
                        TokenUrl = settings.TokenUrl(),
                        Scopes = scopes
                    }
                }
            }
        );
    }
}