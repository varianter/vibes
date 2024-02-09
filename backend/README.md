# Backend
## Prerequisites
 * .NET 7
 * docker and docker compose 

## Config and run
```shell
# Copy the template file and fill the missing fields:
cd Api/
cp appsettings.Local.json.template appsettings.Local.json


# Start Azure SQL Edge (MS SQL Server) inside a docker container, from project-root folder:
cd ../
docker compose up -d database

# Update Database to latest schema and create tables: 
cd backend/
dotnet tool install --global dotnet-ef # To install EF Core globally
dotnet ef database update --startup-project Api/ --project Database/

# Start the web-server by either using the IDE launcher (launchSettings.json): Api:http
# ...or manually by terminal 
cd Api
dotnet run
```


## Add / Remove Migrations
To create new migrations or revert the current:
```shell
# Create a new
dotnet ef migrations add WhatIHaveChangedToTheModelHere --startup-project Api/ --project Database/ 

# Remove the current
dotnet ef migrations remove --startup-project Api/ --project Database/ 

```

## Swagger API Auth
By default, the API endpoints requires authorization by a token acquired by the SSO Auth token from Azure AD.

## Database credentials
Look at `VibesDb` parameter `appsettings.Development.json` for connection details. Note that `encryption` is `disabled` in develoment-mode and need to be set in your DB-client tool.


## Seeding 
We have a seperate project with seed.sql data files, written i T-SQL (Microsofts SQL dialect). Ask developers for access to this. To execute these the VS-code extension `ms-mssql.mssql` can be used, or an other T-SQL compatible tool like Azure Data Studio.

## Database config 
For localhost, the connection-string is just set with and SQL identity based on your docker-compose file. 

In Azure, we use managed identity to configure database access. 

This is done by adding `Authentication="Active Directory Default";` to the connection-string. This instructs the backend to use 
Default Azure Credentials when authenticating, which in turn lets us directly assign access to an App Service without using 
keys or secrets.

Using managed identity/rbac keeps secrets out of connection-strings, which means that they are not secret. 

However, this makes access-control a more active task too. 

## Give database access to an App Service:
1. Be admin :)
2. Make sure the App Service has a System-assigned identity. 
   Do this in the Azure Portal. Select the app service, go to "Identity" in the sidebar and enable system-assigned identity
3. Go to Query Editor -> New Query and run the following: 
   ```tsql
   CREATE USER "<app-name>" FROM EXTERNAL PROVIDER;
   ALTER ROLE db_datareader ADD MEMBER "<app-name>";
   ALTER ROLE db_datawriter ADD MEMBER "<app-name>";
   ALTER ROLE db_ddladmin ADD MEMBER "<app-name>";
   GO
   ```

Source: [MS Docs](https://learn.microsoft.com/en-us/azure/app-service/tutorial-connect-msi-azure-database?tabs=sqldatabase,systemassigned,dotnet,windowsclient#2-configure-managed-identity-for-app)
