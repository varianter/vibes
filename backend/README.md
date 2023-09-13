# Backend
## Prerequisites
 * .net 7
 * docker and docker compose 

## Config and run
* `cp appsettings.Local.json.template appsettings.Local.json`
* Add missing fields
* `cd .. && docker-compose up`
  * This adds a database container
* Run from your IDE, or `dotnet run`