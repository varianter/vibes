# Vibes

Variants interne bemanningssystem. Frontend i Next.js 13 (app router, React 18, Tailwind) i `frontend/`, backend i .NET 8 Web API med EF Core 7 og SQL Server i `backend/`. Innlogging via Azure AD/Entra ID (NextAuth i frontend, Microsoft.Identity.Web i backend).

## Kjøre lokalt

README-ene er delvis utdatert. Dette er riktig per oktober 2026:

- **Verktøy:** .NET 8 SDK (ikke 7, se `backend/global.json`), Node + Yarn 1, Docker. `dotnet-ef` trengs bare for å lage nye migreringer.
- **Database:** startes automatisk av backend via TestContainers når `TestContainersConfig.Enabled` og `RunMigrations` er `true` i `backend/Api/appsettings.Local.json`. Containeren heter `testcontainers-api-db` og kjører på `localhost,14333` (bruker `sa`, passord `test123!`, database `master`). Ikke kjør `docker compose up database` eller `dotnet ef database update` i tillegg – de treffer en annen database (port 1433).
- **Backend:** `cd backend/Api && dotnet run` (profil `http`, miljø `Local`, port 7172, Swagger på `/swagger`). TestContainers krever miljøet `Local` eller `Development`.
- **Frontend:** `cd frontend && yarn install && yarn dev` (port 3000). Next.js leser `.env` bare ved oppstart – start på nytt etter endringer.
- **Uten innlogging og backend:** `yarn start-test` setter `NEXT_PUBLIC_NO_AUTH` og bruker mockdata fra `frontend/mockdata/mockData.ts` (organisasjon `my-org`).

### Konfigurasjon

- `backend/Api/appsettings.Local.json` kopieres fra `appsettings.Local.json.template`. Malen mangler et komma etter `ConnectionString` og er ugyldig JSON som den er. `AzureAd.DisableAuthAd` brukes ikke av koden.
- `frontend/.env` kopieres fra `.env.template`. `AZURE_AD_CLIENT_ID`, `AZURE_AD_TENANT_ID` og `AZURE_AD_APP_SCOPE` er de samme verdiene som `ClientId`, `TenantId` og `ApiScope` i backend. Hemmeligheter hentes fra App Service `vibes-frontend-dev` i Azure.
- Begge filene er gitignored. Ikke skriv ut eller commit verdiene.
- Etter migreringene finnes organisasjonen `variant-as`, avdelingen `trondheim` og én konsulent. For å få tilgang til ferie-fanen må det finnes en rad i `Consultant` med din Variant-e-post.

## Kode

- **API-kall fra frontend** går via server-side hjelpere i `frontend/src/data/apiCallsWithToken.ts`, som legger på brukerens token. Klientkomponenter kaller route handlers under `src/app/[organisation]/.../api/`, som videresender til backend.
- **Typer for backend-modeller** genereres med `yarn generate-types` (krever kjørende backend) til `src/api-types.ts`. Ikke rediger den filen for hånd. Egne frontend-typer ligger i `src/types.ts`.
- **Persondata** (navn, e-post, ansettelsesdokumenter) skal ikke logges. Ved feil, logg statuskode og sti, ikke response body.
- **Nye migreringer:** `dotnet ef migrations add <Navn> -s Api -p Infrastructure` fra `backend/`.

## Verifisering før commit

Frontend (fra `frontend/`):

```bash
npx tsc --noEmit -p .
yarn next lint
yarn prettier:ci
yarn playwright test
```

`npx tsc` gir én kjent feil fra genererte filer under `build/types/` (fra `[...nextauth]/route.ts`). Den kan ignoreres, men nye feil i `src/` kan ikke.

Playwright starter `yarn start-test` selv, men gjenbruker en server som allerede kjører på port 3000. Stopp en vanlig `yarn dev` (med innlogging) før testene kjøres, ellers havner testene på innloggingssiden.

Backend (fra `backend/`): `dotnet test`. E2E-testene starter sin egen SQL Server-container og krever at Docker kjører.
