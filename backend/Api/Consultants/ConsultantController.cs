using Api.Common;
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
    IOrganisationRepository organisationRepository) : ControllerBase
{
    [HttpGet]
    [Route("{Email}")]
    public ActionResult<SingleConsultantReadModel> Get([FromRoute] string orgUrlKey,
        [FromRoute(Name = "Email")] string? email = "")
    {
        var service = new StorageService(cache, context);

        var consultant = service.GetConsultantByEmail(orgUrlKey, email ?? "");


        if (consultant is null) return NotFound();

        return Ok(new SingleConsultantReadModel(consultant));
    }

    [HttpGet]
    public ActionResult<List<SingleConsultantReadModel>> GetAll([FromRoute] string orgUrlKey)
    {
        var service = new StorageService(cache, context);

        var consultants = service.GetConsultants(orgUrlKey);

        var readModels = consultants
            .Select(c => new SingleConsultantReadModel(c))
            .ToList();

        return Ok(readModels);
    }

    [HttpGet]
    [Route("employment")]
    public ActionResult<List<ConsultantsEmploymentReadModel>> GetConsultantsEmployment([FromRoute] string orgUrlKey)
    {
        var service = new StorageService(cache, context);

        var consultants = service.GetConsultantsEmploymentVariant(orgUrlKey);

        var readModels = consultants
            .Select(c => new ConsultantsEmploymentReadModel(c))
            .ToList();


        return Ok(readModels);
    }

    [HttpPut]
    public async Task<ActionResult<SingleConsultantReadModel>> Put([FromRoute] string orgUrlKey,
        [FromBody] ConsultantWriteModel body,
        CancellationToken ct)
    {
        var service = new StorageService(cache, context);

        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var consultant = service.UpdateConsultant(selectedOrg, body);


        var responseModel =
            new SingleConsultantReadModel(consultant);

        return Ok(responseModel);
    }

    [HttpPost]
    public async Task<ActionResult<SingleConsultantReadModel>> Post([FromRoute] string orgUrlKey,
        [FromBody] ConsultantWriteModel body, CancellationToken ct)
    {
        var service = new StorageService(cache, context);

        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var consultant = service.CreateConsultant(selectedOrg, body);

        var responseModel =
            new SingleConsultantReadModel(consultant);

        return Ok(responseModel);
    }
}