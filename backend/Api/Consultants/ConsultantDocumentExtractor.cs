using System.Text.Json;
using System.Text.Json.Serialization;
using Anthropic;
using Anthropic.Models.Beta.Messages;
using Core.Consultants;

namespace Api.Consultants;

/// <summary>
///     Extracts the values needed to register a new consultant from an offer letter (PDF).
///     The result is only a draft: it is shown to the user for review and never saved directly.
/// </summary>
public interface IConsultantDocumentExtractor
{
    Task<ExtractedConsultantReadModel?> Extract(byte[] pdf, IReadOnlyList<string> departmentIds,
        CancellationToken cancellationToken);
}

/// <summary>
///     Returns a fixed draft without reading the document. Used locally when "MockDocumentExtraction" is true,
///     so the flow can be tested without an Anthropic API key.
/// </summary>
public class MockConsultantDocumentExtractor : IConsultantDocumentExtractor
{
    public Task<ExtractedConsultantReadModel?> Extract(byte[] pdf, IReadOnlyList<string> departmentIds,
        CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var firstOfNextMonth = new DateOnly(today.Year, today.Month, 1).AddMonths(1);

        return Task.FromResult<ExtractedConsultantReadModel?>(new ExtractedConsultantReadModel(
            "Test Testesen (mock)",
            departmentIds.FirstOrDefault(),
            Degree.Master,
            2014,
            firstOfNextMonth));
    }
}

/// <summary>
///     Extracts the draft from the document using Claude.
/// </summary>
public class ConsultantDocumentExtractor(AnthropicClient client, ILogger<ConsultantDocumentExtractor> logger)
    : IConsultantDocumentExtractor
{
    private const string Model = "claude-opus-5-5";

    private const string Instructions =
        "This is a job offer letter from Variant. Extract only the fields in the schema. " +
        "'Variantnivå: <Degree> <Year>' gives degree and graduation year. " +
        "Map the company or office (for example 'Variant Oslo AS') to one of the allowed department IDs. " +
        "Use null when a value is not stated in the document. Do not include salary or other information.";

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() }
    };

    public async Task<ExtractedConsultantReadModel?> Extract(byte[] pdf, IReadOnlyList<string> departmentIds,
        CancellationToken cancellationToken)
    {
        var parameters = new MessageCreateParams
        {
            Model = Model,
            MaxTokens = 4096,
            // Retries on another model if the request is declined for policy reasons
            Betas = ["server-side-fallback-2026-07-01"],
            Fallbacks = new Default(),
            OutputConfig = new BetaOutputConfig
            {
                Effort = Effort.Low,
                Format = new BetaJsonOutputFormat { Schema = CreateSchema(departmentIds) }
            },
            Messages =
            [
                new BetaUserMessageParam
                {
                    Content = new List<BetaContentBlockParam>
                    {
                        new BetaRequestDocumentBlock
                            { Source = new BetaBase64PdfSource { Data = Convert.ToBase64String(pdf) } },
                        new BetaTextBlockParam { Text = Instructions }
                    }
                }
            ]
        };

        var response = await client.Beta.Messages.Create(parameters, cancellationToken);

        // Log only metadata - the document and the response contain personal data
        if (response.StopReason != BetaStopReason.EndTurn)
        {
            logger.LogWarning("Document extraction stopped with reason {StopReason}", response.StopReason);
            return null;
        }

        var json = response.Content.Select(block => block.Value).OfType<BetaTextBlock>().FirstOrDefault()?.Text;
        return json is null ? null : ParseResponse(json, departmentIds);
    }

    public static ExtractedConsultantReadModel? ParseResponse(string json, IReadOnlyList<string> departmentIds)
    {
        ExtractedConsultantReadModel? result;
        try
        {
            result = JsonSerializer.Deserialize<ExtractedConsultantReadModel>(json, JsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }

        if (result is null || string.IsNullOrWhiteSpace(result.Name)) return null;

        // Never pass on a department that does not exist in the organisation
        return result.DepartmentId is not null && !departmentIds.Contains(result.DepartmentId)
            ? result with { DepartmentId = null }
            : result;
    }

    private static Dictionary<string, JsonElement> CreateSchema(IReadOnlyList<string> departmentIds)
    {
        return new Dictionary<string, JsonElement>
        {
            ["type"] = JsonSerializer.SerializeToElement("object"),
            ["additionalProperties"] = JsonSerializer.SerializeToElement(false),
            ["required"] = JsonSerializer.SerializeToElement(
                new[] { "name", "departmentId", "degree", "graduationYear", "startDate" }),
            ["properties"] = JsonSerializer.SerializeToElement(new Dictionary<string, object>
            {
                ["name"] = new { type = "string" },
                ["departmentId"] = new
                {
                    type = new[] { "string", "null" },
                    @enum = departmentIds.Cast<string?>().Append(null)
                },
                ["degree"] = new { type = "string", @enum = Enum.GetNames<Degree>() },
                ["graduationYear"] = new { type = new[] { "integer", "null" } },
                ["startDate"] = new
                {
                    type = new[] { "string", "null" },
                    description = "First working day, formatted YYYY-MM-DD"
                }
            })
        };
    }
}
