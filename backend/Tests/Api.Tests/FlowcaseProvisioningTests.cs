using System.Net;
using System.Text;
using System.Text.Json;
using Api.Onboardings;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace Tests.Api.Tests;

public class FlowcaseProvisioningTests
{
    private const string Countries = """
                                     [{"_id": "no-1", "code": "no", "offices": [
                                       {"_id": "off-oslo", "name": "Oslo", "country_id": "no-1"},
                                       {"_id": "off-trd", "name": "Trondheim", "country_id": "no-1"}
                                     ]}]
                                     """;

    private static readonly FlowcaseUserRequest Request = new("Kari Nordmann", "kari.nordmann@variant.no", "trondheim");

    private static (FlowcaseUserProvisioner Provisioner, FakeFlowcase Flowcase) Create(
        HttpStatusCode findStatus = HttpStatusCode.NotFound,
        HttpStatusCode createStatus = HttpStatusCode.OK,
        string countries = Countries)
    {
        var flowcase = new FakeFlowcase(findStatus, createStatus, countries);
        var http = new HttpClient(flowcase) { BaseAddress = new Uri("https://variant.flowcase.test/") };
        var options = Options.Create(new FlowcaseConfig { Role = "consultant", SendEmail = false });
        return (new FlowcaseUserProvisioner(http, options, NullLogger<FlowcaseUserProvisioner>.Instance), flowcase);
    }

    [Fact]
    public async Task CreatesUserInMatchingOffice()
    {
        var (provisioner, flowcase) = Create();

        var result = await provisioner.CreateUser(Request, CancellationToken.None);

        Assert.True(result.Succeeded);
        Assert.Equal("Opprettet CV-profil for kari.nordmann@variant.no", result.Message);
        Assert.Equal("api/v1/users/find?email=kari.nordmann%40variant.no", flowcase.Requests[0]);
        var user = JsonDocument.Parse(flowcase.CreatedBody!).RootElement.GetProperty("user");
        Assert.Equal("kari.nordmann@variant.no", user.GetProperty("email").GetString());
        Assert.Equal("kari.nordmann@variant.no", user.GetProperty("upn").GetString());
        Assert.Equal("Kari Nordmann", user.GetProperty("name").GetString());
        Assert.Equal("no-1", user.GetProperty("country_id").GetString());
        Assert.Equal("off-trd", user.GetProperty("office_id").GetString());
        Assert.Equal("consultant", user.GetProperty("role").GetString());
        Assert.False(user.GetProperty("send_email").GetBoolean());
    }

    [Fact]
    public async Task ReusesExistingUserWithSameEmail()
    {
        var (provisioner, flowcase) = Create(HttpStatusCode.OK);

        var result = await provisioner.CreateUser(Request, CancellationToken.None);

        Assert.True(result.Succeeded);
        Assert.Equal("Fant eksisterende CV-profil for kari.nordmann@variant.no", result.Message);
        Assert.Null(flowcase.CreatedBody);
    }

    [Fact]
    public async Task FailsWhenOfficeIsMissing()
    {
        var (provisioner, flowcase) = Create(countries: """[{"_id": "no-1", "offices": []}]""");

        var result = await provisioner.CreateUser(Request, CancellationToken.None);

        Assert.False(result.Succeeded);
        Assert.Equal("Fant ikke kontoret «trondheim» i Flowcase", result.Message);
        Assert.Null(flowcase.CreatedBody);
    }

    [Theory]
    [InlineData(HttpStatusCode.UnprocessableEntity,
        "Flowcase avviste brukeren, for eksempel fordi e-posten allerede er i bruk (422)")]
    [InlineData(HttpStatusCode.Forbidden, "Flowcase avviste API-nøkkelen (403)")]
    [InlineData(HttpStatusCode.InternalServerError, "Flowcase svarte med feil (500)")]
    public async Task FailsWithStatusCodeWhenCreateFails(HttpStatusCode status, string message)
    {
        var (provisioner, _) = Create(createStatus: status);

        var result = await provisioner.CreateUser(Request, CancellationToken.None);

        Assert.False(result.Succeeded);
        Assert.Equal(message, result.Message);
    }

    [Fact]
    public async Task FailsWhenApiKeyIsRejected()
    {
        var (provisioner, flowcase) = Create(HttpStatusCode.Unauthorized);

        var result = await provisioner.CreateUser(Request, CancellationToken.None);

        Assert.Equal("Flowcase avviste API-nøkkelen (401)", result.Message);
        Assert.Single(flowcase.Requests);
    }

    [Fact]
    public async Task MockSimulatesMissingOffice()
    {
        var result = await new MockFlowcaseUserProvisioner().CreateUser(
            new FlowcaseUserRequest("Flowcase Nordmann", "flowcase.nordmann@variant.no", "Oslo"),
            CancellationToken.None);

        Assert.False(result.Succeeded);
        Assert.Equal("Fant ikke kontoret «Oslo» i Flowcase", result.Message);
    }

    private class FakeFlowcase(HttpStatusCode findStatus, HttpStatusCode createStatus, string countries)
        : HttpMessageHandler
    {
        public List<string> Requests { get; } = [];
        public string? CreatedBody { get; private set; }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            var path = request.RequestUri!.PathAndQuery.TrimStart('/');
            Requests.Add(path);

            if (path.StartsWith("api/v1/users/find")) return Json(findStatus, "{}");
            if (path.StartsWith("api/v1/countries")) return Json(HttpStatusCode.OK, countries);
            if (path == "api/v1/users" && request.Method == HttpMethod.Post)
            {
                CreatedBody = await request.Content!.ReadAsStringAsync(cancellationToken);
                return Json(createStatus, """{"user_id": "u-1"}""");
            }

            return new HttpResponseMessage(HttpStatusCode.NotFound);
        }

        private static HttpResponseMessage Json(HttpStatusCode status, string body)
        {
            return new HttpResponseMessage(status)
                { Content = new StringContent(body, Encoding.UTF8, "application/json") };
        }
    }
}
