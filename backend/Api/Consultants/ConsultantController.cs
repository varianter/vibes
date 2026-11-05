using Api.Common;
using Core.Consultants;
using Core.Organizations;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Consultants;

[Authorize]
[Route("/v0/{orgUrlKey}/consultants")]
[ApiController]
public class ConsultantController(
    ApplicationContext context,
    IMemoryCache cache,
    ILogger<StorageService> logger,
    IOrganisationRepository organisationRepository,
    IConsultantRepository consultantRepository,
    IDepartmentRepository departmentRepository,
    IConsultantDocumentExtractor documentExtractor) : ControllerBase
{
    private const long MaxDocumentSizeInBytes = 10 * 1024 * 1024;

    private readonly StorageService _storageService = new(cache, logger, context);

    /// <summary>
    ///     Extracts a draft for a new consultant from an offer letter (PDF). Nothing is saved.
    /// </summary>
    [HttpPost]
    [Route("extract")]
    [Authorize(Roles = AppRoles.Onboarding)]
    [RequestSizeLimit(MaxDocumentSizeInBytes + 1024 * 1024)]
    public async Task<ActionResult<ExtractedConsultantReadModel>> ExtractFromDocument([FromRoute] string orgUrlKey,
        IFormFile file, CancellationToken cancellationToken)
    {
        if (file.ContentType != "application/pdf") return BadRequest("File must be a PDF");
        if (file.Length > MaxDocumentSizeInBytes) return BadRequest("File is larger than 10 MB");

        var departments =
            await departmentRepository.GetDepartmentsInOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (departments.Count == 0) return BadRequest("Selected org not found");

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream, cancellationToken);

        var draft = await documentExtractor.Extract(stream.ToArray(), departments.Select(d => d.Id).ToList(),
            cancellationToken);

        if (draft is null) return UnprocessableEntity("Could not extract values from the document");

        return Ok(draft);
    }

    [HttpGet]
    [Route("{Email}")]
    public async Task<ActionResult<SingleConsultantReadModel>> Get([FromRoute] string orgUrlKey, CancellationToken cancellationToken,
        [FromRoute(Name = "Email")] string? email = "")
    {
        var consultant = await consultantRepository.GetConsultantByEmail(orgUrlKey, email ?? "", cancellationToken);

        if (consultant is null) return NotFound();

        return Ok(new SingleConsultantReadModel(consultant));
    }

    [HttpGet]
    public async Task<OkObjectResult> GetAll([FromRoute] string orgUrlKey, CancellationToken cancellationToken)
    {
        var consultants = await consultantRepository.GetConsultantsInOrganizationByUrlKey(orgUrlKey, cancellationToken);

        var readModels = consultants
            .Select(c => new SingleConsultantReadModel(c))
            .ToList();

        return Ok(readModels);
    }

    [HttpGet]
    [Route("employment")]
    public async Task<OkObjectResult> GetConsultantsEmployment([FromRoute] string orgUrlKey, CancellationToken cancellationToken)
    {
        var consultants = await consultantRepository.GetConsultantsInOrganizationByUrlKey(orgUrlKey, cancellationToken);

        var readModels = consultants
            .Select(c => new ConsultantsEmploymentReadModel(c))
            .ToList();


        return Ok(readModels);
    }

    [HttpPut]
    public async Task<ActionResult<SingleConsultantReadModel>> Put([FromRoute] string orgUrlKey,
        [FromBody] ConsultantWriteModel body,
        CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var consultant = await _storageService.UpdateConsultant(selectedOrg, body, cancellationToken);

        if (consultant is null)
        {
            return NotFound($"Could not find consultant with id {body.Id}");
        }

        var responseModel =
            new SingleConsultantReadModel(consultant);

        return Ok(responseModel);
    }

    [HttpPost]
    public async Task<ActionResult<SingleConsultantReadModel>> Post([FromRoute] string orgUrlKey,
        [FromBody] ConsultantWriteModel body, CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var consultant = await _storageService.CreateConsultant(selectedOrg, body, cancellationToken);

        var responseModel =
            new SingleConsultantReadModel(consultant);

        return Ok(responseModel);
    }

    [HttpPut]
    [Route("{consultantId:int}/discipline")]
    public async Task<Results<NotFound<string>, Ok<SingleConsultantReadModel>>> UpdateDiscipline(
        [FromRoute] string orgUrlKey, [FromRoute] int consultantId, [FromQuery] string? disciplineId,
        CancellationToken cancellationToken)
    {
        var consultant = await consultantRepository.UpdateDiscipline(consultantId, disciplineId, cancellationToken);

        if (consultant is null)
            return TypedResults.NotFound($"Could not find consultant with id {consultantId}");

        return TypedResults.Ok(new SingleConsultantReadModel(consultant));
    }
}