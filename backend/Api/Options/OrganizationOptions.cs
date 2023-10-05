namespace Api.Options;

public class OrganizationOptions
{
    private static OrganizationOptions _organizationOptions;

    public double HoursPerWorkday { get; }
    public bool HasVacationInChristmas { get; }
    public int NumberOfVacationDaysInYear { get; }
    public string Country { get; }

    public OrganizationOptions(IConfiguration config)
    {
        this.HoursPerWorkday = config.GetValue<double>("HoursPerWorkday");
        this.HasVacationInChristmas = config.GetValue<bool>("HasVacationInChristmas");
        this.NumberOfVacationDaysInYear = config.GetValue<int>("NumberOfVacationDaysInYear");
        this.Country = config.GetValue<string>("Country");

        // Now set Current
        _organizationOptions = this;
    }

    public static OrganizationOptions Current
    {
        get
        {
            if (_organizationOptions == null)
            {
                _organizationOptions = GetCurrentSettings();
            }

            return _organizationOptions;
        }
    }

    public static OrganizationOptions GetCurrentSettings()
    {
        var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile($"appsettings.{env}.json", optional: true, reloadOnChange: true)
            .AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables();

        var configuration = builder.Build();

        var settings = new OrganizationOptions(configuration.GetSection("OrganizationSettings"));

        return settings;
    }
}