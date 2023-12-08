using Api.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Api.AppExtensions;

public static class SwaggerExtensions
{
    public static void ConfigureSwaggerAuthentication(this SwaggerGenOptions c, AzureAdOptions adOptions)
    {
        var scopes = new Dictionary<string, string>
        {
            { $"{adOptions.ApiScope}", "Access API backend on user behalf" }
        };

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "oauth2" }
                },
                new[] { adOptions.ApiScope }
            }
        });

        c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.OAuth2,
                Flows = new OpenApiOAuthFlows
                {
                    Implicit = new OpenApiOAuthFlow
                    {
                        AuthorizationUrl = adOptions.AuthorizationUrl(),
                        TokenUrl = adOptions.TokenUrl(),
                        Scopes = scopes
                    }
                }
            }
        );
    }
}