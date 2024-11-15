using Core.Agreements;
using Core.Organizations;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Projects;

[Authorize]
[Route("/v0/{orgUrlKey}/agreements")]
[ApiController]
public class AgreementController(
    ApplicationContext context,
    IMemoryCache cache,
    IOrganisationRepository organisationRepository,
    IAgreementsRepository agreementsRepository) : ControllerBase
{

    [HttpGet]
    [Route("get/{agreementId}")]
    public async Task<ActionResult<AgreementReadModel>> GetAgreement([FromRoute] string orgUrlKey,
        [FromRoute] int agreementId, CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var agreement = await agreementsRepository.GetAgreementById(agreementId, ct);

        if (agreement is null) return NotFound();

        var responseModel = new AgreementReadModel(
            AgreementId: agreement.Id,
            EngagementId: agreement.EngagementId,
            StartDate: agreement.StartDate,
            EndDate: agreement.EndDate,
            NextPriceAdjustmentDate: agreement.NextPriceAdjustmentDate,
            PriceAdjustmentIndex: agreement.PriceAdjustmentIndex,
            Notes: agreement.Notes,
            Options: agreement.Options,
            PriceAdjustmentProcess: agreement.PriceAdjustmentProcess,
            Files: agreement.Files.Select(f => new FileReferenceReadModel(
                FileName: f.FileName,
                BlobName: f.BlobName,
                UploadedOn: f.UploadedOn
            )).ToList()
        );
        return Ok(responseModel);
    }

    [HttpGet]
    [Route("get/engagement/{engagementId}")]
    public async Task<ActionResult<AgreementReadModel>> GetAgreementByEngagement([FromRoute] string orgUrlKey,
        [FromRoute] int engagementId, CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var agreement = await agreementsRepository.GetAgreementByEngagementId(engagementId, ct);

        if (agreement is null) return NotFound();

        var responseModel = new AgreementReadModel(
            AgreementId: agreement.Id,
            EngagementId: agreement.EngagementId,
            StartDate: agreement.StartDate,
            EndDate: agreement.EndDate,
            NextPriceAdjustmentDate: agreement.NextPriceAdjustmentDate,
            PriceAdjustmentIndex: agreement.PriceAdjustmentIndex,
            Notes: agreement.Notes,
            Options: agreement.Options,
            PriceAdjustmentProcess: agreement.PriceAdjustmentProcess,
            Files: agreement.Files.Select(f => new FileReferenceReadModel(
                FileName: f.FileName,
                BlobName: f.BlobName,
                UploadedOn: f.UploadedOn
            )).ToList()
        );
        return Ok(responseModel);
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult<AgreementWriteModel>> Post([FromRoute] string orgUrlKey,
        [FromBody] AgreementWriteModel body, CancellationToken ct)
    {

        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var engagement = await context.Project.FindAsync(body.EngagementId);
        if (engagement is null) return BadRequest("Engagement not found");

        var agreement = new Agreement
        {
            EngagementId = body.EngagementId,
            Engagement = engagement,
            StartDate = body.StartDate,
            EndDate = body.EndDate,
            NextPriceAdjustmentDate = body.NextPriceAdjustmentDate,
            PriceAdjustmentIndex = body.PriceAdjustmentIndex,
            Notes = body.Notes,
            Options = body.Options,
            PriceAdjustmentProcess = body.PriceAdjustmentProcess,
            Files = body.Files.Select(f => new FileReference
            {
                FileName = f.FileName,
                BlobName = f.BlobName,
                UploadedOn = f.UploadedOn
            }).ToList()
        };

        await agreementsRepository.AddAgreementAsync(agreement, ct);

        var responseModel = new AgreementReadModel(
            AgreementId: agreement.Id,
            EngagementId: agreement.EngagementId,
            StartDate: agreement.StartDate,
            EndDate: agreement.EndDate,
            NextPriceAdjustmentDate: agreement.NextPriceAdjustmentDate,
            PriceAdjustmentIndex: agreement.PriceAdjustmentIndex,
            Notes: agreement.Notes,
            Options: agreement.Options,
            PriceAdjustmentProcess: agreement.PriceAdjustmentProcess,
            Files: agreement.Files.Select(f => new FileReferenceReadModel(
                FileName: f.FileName,
                BlobName: f.BlobName,
                UploadedOn: f.UploadedOn
            )).ToList()
        );

        return Ok(responseModel);
    }

    [HttpPut]
    [Route("update/{agreementId}")]
    public async Task<ActionResult<AgreementReadModel>> Put([FromRoute] string orgUrlKey,
        [FromRoute] int agreementId, [FromBody] AgreementWriteModel body, CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var agreement = await agreementsRepository.GetAgreementById(agreementId, ct);
        if (agreement is null) return NotFound();

        agreement.EngagementId = body.EngagementId;
        agreement.StartDate = body.StartDate;
        agreement.EndDate = body.EndDate;
        agreement.NextPriceAdjustmentDate = body.NextPriceAdjustmentDate;
        agreement.PriceAdjustmentIndex = body.PriceAdjustmentIndex;
        agreement.Notes = body.Notes;
        agreement.Options = body.Options;
        agreement.PriceAdjustmentProcess = body.PriceAdjustmentProcess;
        agreement.Files = body.Files.Select(f => new FileReference
        {
            FileName = f.FileName,
            BlobName = f.BlobName,
            UploadedOn = f.UploadedOn
        }).ToList();

        await agreementsRepository.UpdateAgreementAsync(agreement, ct);

        var responseModel = new AgreementReadModel(
            AgreementId: agreement.Id,
            EngagementId: agreement.EngagementId,
            StartDate: agreement.StartDate,
            EndDate: agreement.EndDate,
            NextPriceAdjustmentDate: agreement.NextPriceAdjustmentDate,
            PriceAdjustmentIndex: agreement.PriceAdjustmentIndex,
            Notes: agreement.Notes,
            Options: agreement.Options,
            PriceAdjustmentProcess: agreement.PriceAdjustmentProcess,
            Files: agreement.Files.Select(f => new FileReferenceReadModel(
                FileName: f.FileName,
                BlobName: f.BlobName,
                UploadedOn: f.UploadedOn
            )).ToList()
        );

        return Ok(responseModel);
    }

    [HttpDelete]
    [Route("delete/{agreementId}")]
    public async Task<ActionResult> Delete([FromRoute] string orgUrlKey, [FromRoute] int agreementId, CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var agreement = await agreementsRepository.GetAgreementById(agreementId, ct);
        if (agreement is null) return NotFound();

        await agreementsRepository.DeleteAgreementAsync(agreementId, ct);

        return Ok();
    }

    [HttpGet]
    [Route("priceAdjustmentIndexes")]
    public async Task<ActionResult<List<string>>> GetPriceAdjustmentIndexes([FromRoute] string orgUrlKey, CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var priceAdjustmentIndexes = await agreementsRepository.GetPriceAdjustmentIndexesAsync(ct);

        return Ok(priceAdjustmentIndexes);
    }
}