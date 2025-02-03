using Api.Common;
using Core.Consultants;
using Core.Organizations;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
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
    IConsultantRepository consultantRepository) : ControllerBase
{
    private readonly StorageService _storageService = new(cache, logger, context);
    
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
}