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

- `backend/Api/appsettings.Local.json` kopieres fra `appsettings.Local.json.template`. `AzureAd.DisableAuthAd` brukes ikke av koden.
- **Anthropic API-nøkkel:** «Legg til konsulent (automatisert/beta)» kaller Claude fra backend (`ConsultantDocumentExtractor`). Nøkkelen leses fra miljøvariabelen `ANTHROPIC_API_KEY` når backend starter, for eksempel `ANTHROPIC_API_KEY=... dotnet run`. Den skal aldri i `appsettings`-filer eller i git. Uten nøkkel: sett `"MockDocumentExtraction": true` i `appsettings.Local.json` (bare `Local`/`Development`), så returneres et fast utkast uten at dokumentet leses eller sendes noe sted.
- `frontend/.env` kopieres fra `.env.template`. `AZURE_AD_CLIENT_ID`, `AZURE_AD_TENANT_ID` og `AZURE_AD_APP_SCOPE` er de samme verdiene som `ClientId`, `TenantId` og `ApiScope` i backend. Hemmeligheter hentes fra App Service `vibes-frontend-dev` i Azure.
- Begge filene er gitignored. Ikke skriv ut eller commit verdiene.
- **App-roller** fra Entra ID (app-registreringen `vibes-dev`) kommer som `roles` i ID-tokenet og ligger i `session.roles`. Rollen `Vibes.Onboarding` styrer «Legg til konsulent (automatisert/beta)». Rollene må tildeles av en admin i Entra; inntil da kan de mockes lokalt med `MOCK_ROLES=Vibes.Onboarding` i `frontend/.env` (ignoreres i produksjon) og `"MockRoles": "Vibes.Onboarding"` i `backend/Api/appsettings.Local.json` (bare i miljøene `Local` og `Development`). Backend sjekker rollen med `[Authorize(Roles = AppRoles.Onboarding)]`. Nye roller i tokenet krever ny innlogging, men `MOCK_ROLES` virker etter omstart av `yarn dev`.
- Etter migreringene finnes organisasjonen `variant-as`, avdelingen `trondheim` og én konsulent. For å få tilgang til ferie-fanen må det finnes en rad i `Consultant` med din Variant-e-post.

## Kode

- **API-kall fra frontend** går via server-side hjelpere i `frontend/src/data/apiCallsWithToken.ts`, som legger på brukerens token. Klientkomponenter kaller route handlers under `src/app/[organisation]/.../api/`, som videresender til backend.
- **Typer for backend-modeller** genereres med `yarn generate-types` (krever kjørende backend) til `src/api-types.ts`. Ikke rediger den filen for hånd. Egne frontend-typer ligger i `src/types.ts`.
- **Automatisert onboarding (beta):** skjemaet fra PDF-flyten poster til `POST /v0/{org}/onboardings`, som oppretter konsulenten og en rad i `Onboardings` med ett steg per system i `OnboardingSteps` (Bemanning, Entra ID, Flowcase, Slack, Donut). Bemanning settes til `Done` med en gang; de andre er `NotStarted` til integrasjonene finnes. Statussiden ligger på `/{org}/konsulenter/onboarding/{id}`. Alt krever rollen `Vibes.Onboarding`.
- **Avhengigheter mellom steg:** `OnboardingStepDependencies` i `Core/Onboardings/Onboarding.cs` sier hvilke steg som må være `Done` før et steg kan starte (Entra etter Bemanning, Flowcase og Slack etter Entra, Donut etter Slack). Bakgrunnsjobbene (`OnboardingStepProcessor`) plukker bare opp steg der avhengighetene er ferdige, og API-et sender dem med som `dependsOn`. Statussiden viser «Venter» med «Starter når … er fullført» for steg som venter, og «Blokkert» når et steg før har feilet (også videre nedover, f.eks. Donut når Entra feilet). Et steg kan bare avhenge av steg som kommer før det (sjekkes av en test).
- **Bruker i Entra ID / O365:** steget «Bruker og lisens» kjøres av en bakgrunnsjobb (`EntraOnboardingStepProcessor`, startet via `AddOnboardingStepProcessor`) som oppretter brukeren med Microsoft Graph, tildeler lisens og legger brukeren i grupper. Brukernavnet lages av fornavn og etternavn: `fornavn.etternavn@variant.no` (første og siste ord i navnet, æ→ae, ø→o, å→a, aksenter fjernes), med tall bak hvis det er tatt (`kari.nordmann2`). Brukernavnet er også e-postadressen i O365 (`mail`) og lagres i `Consultant.WorkEmail` når steget lykkes. `Consultant.Email` beholder e-posten fra skjemaet, som er kandidatens egen adresse og ikke sendes til Entra. Styres av seksjonen `EntraProvisioning` og er av som standard (`Enabled: false`). Lokalt brukes `"Mock": true` (malen gjør dette), som aldri kaller Graph; fornavn «Finnes» simulerer et tatt brukernavn og «Feil» en feil fra Entra. Ekte Graph nekter å starte i `Local`/`Development`, siden utviklerens egen Azure-innlogging ellers kunne opprettet ekte brukere. I Azure brukes App Servicens managed identity, som trenger Graph-tillatelsene `User.ReadWrite.All` (opprette brukere og tildele lisens), `LicenseAssignment.Read.All` (sjekke ledige lisenser før brukeren opprettes) og `GroupMember.ReadWrite.All` (bare hvis `GroupIds` er satt), med admin consent.
- **CV-profil i Flowcase:** steget «CV-profil» kjøres av `FlowcaseOnboardingStepProcessor` når Entra-steget er `Done` (se avhengigheter over), siden profilen bruker `Consultant.WorkEmail`. Den bruker Flowcase sitt REST-API (https://docs.flowcase.com/users): finnes en bruker med samme e-post, brukes den; ellers opprettes brukeren i kontoret som har samme navn som avdelingen i Vibes (uten å skille store og små bokstaver). Kontoret må finnes i Flowcase fra før. Styres av seksjonen `Flowcase` og er av som standard. Lokalt brukes `"Mock": true` (malen gjør dette); fornavn «Flowcase» simulerer et kontor som mangler. I Azure trengs `Flowcase:BaseUrl` og API-nøkkelen i miljøvariabelen `Flowcase__ApiKey` (aldri i `appsettings`-filer). Nøkkelen må ha tilgangsnivå Country manager eller Administrator. `SendEmail` styrer om Flowcase sender sin egen velkomst-e-post. Standard HTTP-logging er slått av for klienten, siden URL-ene inneholder e-posten. Ekte Flowcase nekter å starte i `Local`/`Development`.
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

Backend (fra `backend/`): `dotnet test`. E2E-testene starter sin egen SQL Server-container og krever at Docker kjører. To eldre tester feiler per november 2026 (`AbsenceTests` for julefri med delvis flagg), og testene i `ForecastRepositoryTests` feiler av og til (avdelings-ID-en `"Trondheim"` kolliderer med seedet `trondheim`, siden SQL Server sammenligner nøkler uten å skille store og små bokstaver). De kjørte aldri før testadapteren `xunit.runner.visualstudio` ble lagt til, så feilene er ikke nye. Bruk unike ID-er i nye E2E-tester.
