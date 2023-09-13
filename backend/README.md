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


# Database config 
For localhost, the connection-string is just set with and SQL identity based on your docker-compose file. 

In Azure, we use managed identity to configure database access. 

This is done by adding `Authentication="Active Directory Default";` to the connection-string. This instructs the backend to use 
Default Azure Credentials when authenticating, which in turn lets us directly assign access to an App Service without using 
keys or secrets.

Using managed identity/rbac keeps secrets out of connection-strings, which means that they are not secret. 

However, this makes access-control a more active task too. 

## Give database access to an appservice:
0. Be admin :)
1. Make sure the appservice has a System-assigned identity. 
   Do this in the Azure Portal. Select the app service, go to "Identity" in the sidebar and enable system-assigned identity
2. Go to Query Editor -> New Query and run the following: 
   ```SQL
   CREATE USER "<app-name>" FROM EXTERNAL PROVIDER;
   ALTER ROLE db_datareader ADD MEMBER "<app-name>";
   ALTER ROLE db_datawriter ADD MEMBER "<app-name>";
   ALTER ROLE db_ddladmin ADD MEMBER "<app-name>";
   GO
   ```

Source: [MS Docs](https://learn.microsoft.com/en-us/azure/app-service/tutorial-connect-msi-azure-database?tabs=sqldatabase,systemassigned,dotnet,windowsclient#2-configure-managed-identity-for-app)
