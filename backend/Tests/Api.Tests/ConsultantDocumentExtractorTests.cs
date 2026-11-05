using Api.Consultants;
using Core.Consultants;

namespace Tests.Api.Tests;

public class ConsultantDocumentExtractorTests
{
    private static readonly string[] DepartmentIds = ["oslo", "trondheim"];

    [Fact]
    public void ParseResponse_MapsAllFields()
    {
        const string json =
            """{"name":"Kari Nordmann","departmentId":"oslo","degree":"Master","graduationYear":2014,"startDate":"2026-08-01"}""";

        var result = ConsultantDocumentExtractor.ParseResponse(json, DepartmentIds);

        Assert.Equal(
            new ExtractedConsultantReadModel("Kari Nordmann", "oslo", Degree.Master, 2014, new DateOnly(2026, 8, 1)),
            result);
    }

    [Fact]
    public void ParseResponse_AcceptsMissingValues()
    {
        const string json =
            """{"name":"Kari Nordmann","departmentId":null,"degree":"None","graduationYear":null,"startDate":null}""";

        var result = ConsultantDocumentExtractor.ParseResponse(json, DepartmentIds);

        Assert.Equal(new ExtractedConsultantReadModel("Kari Nordmann", null, Degree.None, null, null), result);
    }

    [Fact]
    public void ParseResponse_RemovesUnknownDepartment()
    {
        const string json =
            """{"name":"Kari Nordmann","departmentId":"bergen","degree":"Bachelor","graduationYear":2020,"startDate":null}""";

        var result = ConsultantDocumentExtractor.ParseResponse(json, DepartmentIds);

        Assert.NotNull(result);
        Assert.Null(result.DepartmentId);
        Assert.Equal(Degree.Bachelor, result.Degree);
    }

    [Fact]
    public async Task MockExtractor_ReturnsDraftInFirstDepartment()
    {
        var result = await new MockConsultantDocumentExtractor().Extract([], DepartmentIds, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("oslo", result.DepartmentId);
        Assert.Equal(Degree.Master, result.Degree);
        Assert.Equal(1, result.StartDate?.Day);
        Assert.True(result.StartDate > DateOnly.FromDateTime(DateTime.Today));
    }

    [Theory]
    [InlineData("not json")]
    [InlineData("""{"name":"","departmentId":null,"degree":"None","graduationYear":null,"startDate":null}""")]
    [InlineData("""{"name":"Kari Nordmann","departmentId":null,"degree":"PhD","graduationYear":null,"startDate":null}""")]
    public void ParseResponse_ReturnsNullForInvalidResponse(string json)
    {
        Assert.Null(ConsultantDocumentExtractor.ParseResponse(json, DepartmentIds));
    }
}
