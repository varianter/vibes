# Backend
## Prerequisites
 * .NET 7
 * docker and docker compose 

## Config and run
```shell
# Copy the template file and fill the missing fields:
cd backend/
cp appsettings.Local.json.template appsettings.Local.json


# Start Azure SQL Edge (MS SQL Server) inside a docker container:
cd backend/ 
docker compose up -d database

# Update Database to latest schema and create tables: 
cd backend/
dotnet ef database update --startup-project Api/ --project Database/

# Start the web-server by either using the IDE launcher (launchSettings.json): Api:http
# ...or manually by terminal 
cd backend/Api
dotnet run
```


## Swagger API Auth
By default, the API endpoints requires authorization by a token acquired by the SSO Auth token from Azure AD.

To override and disable this in development mode, set `"DisableAuthAd": true` in `appsettings.local.json`.

# Database config 
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
