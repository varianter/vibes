# .NET Core backend

## Kommandoer

For å kjøre opp dev miljø:

- Kopier `appsettings.Development.json` til `appsettings.Local.json` og fyll ut alle `AppSettings` felt.
- Som standard kan du kjøre opp en utviklings-azure-edge-SQL database ved hjelp av docker: `docker compose up azure-edge`

For å kjøre opp backend webserver:
```
cd api/
dotnet run --project ./RestApi
```


For å kjøre migrering til `VibesDb`:

```bash
# For å kjøre ny migrasjon
dotnet ef migrations add <navn på migrasjon> --project ./ApplicationCore --startup-project ./RestApi

# Revertere siste migrasjon
dotnet ef migrations remove --project ./ApplicationCore --startup-project ./RestApi
```

## Struktur

Les mer om Clean Architecture
her: https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures#clean-architecture
