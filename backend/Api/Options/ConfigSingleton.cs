namespace Api.Options;

public sealed class ConfigSingleton
{
    private ConfigSingleton()
    {
    }

    private static OrganizationOptions _config;
    private static ConfigSingleton _instance;

    public static OrganizationOptions Config()
    {
        return _config;
    }
    
    public static OrganizationOptions Config(IConfigurationSection config)
    {
        if (_instance == null)
        {
            _instance = new ConfigSingleton();
            
            _config = new OrganizationOptions
            {
                HoursPerWorkday = config.GetValue<double>("HoursPerWorkday"),
                HasVacationInChristmas = config.GetValue<bool>("HasVacationInChristmas"),
                NumberOfVacationDaysInYear = config.GetValue<int>("NumberOfVacationDaysInYear"),
                Country = config.GetValue<string>("Country")
            };
        }

        return _config;
    }
}