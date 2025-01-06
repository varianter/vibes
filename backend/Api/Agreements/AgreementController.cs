using Core.Agreements;
using Core.Customers;
using Core.Engagements;
using Core.Organizations;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Agreements;

[Authorize]
[Route("/v0/{orgUrlKey}/agreements")]
[ApiController]
public class AgreementController(
    ApplicationContext context,
    IMemoryCache cache,
    IOrganisationRepository organisationRepository,
    IAgreementsRepository agreementsRepository) : ControllerBase
{
    private const string SelectedOrganizationNotFound = "Selected organization not found";
    

    [HttpGet]
    [Route("{agreementId:int}")]
    public async Task<ActionResult<AgreementReadModel>> GetAgreement([FromRoute] string orgUrlKey,
        [FromRoute] int agreementId, CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return NotFound(SelectedOrganizationNotFound);

        var agreement = await agreementsRepository.GetAgreementById(agreementId, cancellationToken);

        if (agreement is null) return NotFound();

        var responseModel = new AgreementReadModel(
            Name: agreement.Name,
            AgreementId: agreement.Id,
            EngagementId: agreement.EngagementId,
            CustomerId: agreement.CustomerId,
            StartDate: agreement.StartDate,
            EndDate: agreement.EndDate,
            NextPriceAdjustmentDate: agreement.NextPriceAdjustmentDate,
            PriceAdjustmentIndex: agreement.PriceAdjustmentIndex,
            Notes: agreement.Notes,
            Options: agreement.Options,
            PriceAdjustmentProcess: agreement.PriceAdjustmentProcess,
            Files: agreement.Files.Select(f => new FileReferenceReadModel(f)).ToList()
        );
        return Ok(responseModel);
    }

    [HttpGet]
    [Route("engagement/{engagementId:int}")]
    public async Task<ActionResult<List<AgreementReadModel>>> GetAgreementsByEngagement([FromRoute] string orgUrlKey,
        [FromRoute] int engagementId, CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return NotFound(SelectedOrganizationNotFound);

        var agreements = await agreementsRepository.GetAgreementsByEngagementId(engagementId, cancellationToken);

        var responseModels = agreements.Select(agreement => new AgreementReadModel(
            AgreementId: agreement.Id,
            Name: agreement.Name,
            EngagementId: agreement.EngagementId,
            CustomerId: agreement.CustomerId,
            StartDate: agreement.StartDate,
            EndDate: agreement.EndDate,
            NextPriceAdjustmentDate: agreement.NextPriceAdjustmentDate,
            PriceAdjustmentIndex: agreement.PriceAdjustmentIndex,
            Notes: agreement.Notes,
            Options: agreement.Options,
            PriceAdjustmentProcess: agreement.PriceAdjustmentProcess,
            Files: agreement.Files.Select(f => new FileReferenceReadModel(f)).ToList()
        )).ToList();

        return Ok(responseModels);
    }

    [HttpGet]
    [Route("customer/{customerId:int}")]
    public async Task<ActionResult<List<AgreementReadModel>>> GetAgreementsByCustomer([FromRoute] string orgUrlKey,
        [FromRoute] int customerId, CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return NotFound(SelectedOrganizationNotFound);

        var agreements = await agreementsRepository.GetAgreementsByCustomerId(customerId, cancellationToken);

        var responseModels = agreements.Select(agreement => new AgreementReadModel(
            AgreementId: agreement.Id,
            Name: agreement.Name,
            EngagementId: agreement.EngagementId,
            CustomerId: agreement.CustomerId,
            StartDate: agreement.StartDate,
            EndDate: agreement.EndDate,
            NextPriceAdjustmentDate: agreement.NextPriceAdjustmentDate,
            PriceAdjustmentIndex: agreement.PriceAdjustmentIndex,
            Notes: agreement.Notes,
            Options: agreement.Options,
            PriceAdjustmentProcess: agreement.PriceAdjustmentProcess,
            Files: agreement.Files.Select(f => new FileReferenceReadModel(f)).ToList()
        )).ToList();

        return Ok(responseModels);
    }

    [HttpPost]
    public async Task<ActionResult<AgreementReadModel>> Post([FromRoute] string orgUrlKey,
        [FromBody] AgreementWriteModel body, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (body.CustomerId is null && body.EngagementId is null)
        {
            ModelState.AddModelError("", "At least one of CustomerId or EngagementId must be provided.");
            return BadRequest(ModelState);
        }

        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null)
            return NotFound(SelectedOrganizationNotFound);

        Customer? customer = null;
        if (body.CustomerId != null)
        {
            customer = await context.Customer.FirstOrDefaultAsync(c => c.Id == body.CustomerId.Value,
                cancellationToken);
            if (customer == null)
                return NotFound("Customer not found");
        }

        Engagement? engagement = null;
        if (body.EngagementId != null)
        {
            engagement =
                await context.Project.FirstOrDefaultAsync(e => e.Id == body.EngagementId.Value, cancellationToken);
            if (engagement is null)
                return NotFound("Engagement not found");
        }

        var agreement = new Agreement
        {
            Name = body.Name,
            CustomerId = body.CustomerId,
            Customer = customer,
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
                UploadedOn = f.UploadedOn,
                UploadedBy = f.UploadedBy ?? "Unknown"
            }).ToList()
        };

        await agreementsRepository.AddAgreementAsync(agreement, cancellationToken);

        var responseModel = new AgreementReadModel(
            Name: agreement.Name,
            AgreementId: agreement.Id,
            CustomerId: agreement.CustomerId,
            EngagementId: agreement.EngagementId,
            StartDate: agreement.StartDate,
            EndDate: agreement.EndDate,
            NextPriceAdjustmentDate: agreement.NextPriceAdjustmentDate,
            PriceAdjustmentIndex: agreement.PriceAdjustmentIndex,
            Notes: agreement.Notes,
            Options: agreement.Options,
            PriceAdjustmentProcess: agreement.PriceAdjustmentProcess,
            Files: agreement.Files.Select(f => new FileReferenceReadModel(f)).ToList()
        );
        cache.Remove($"consultantCacheKey/{orgUrlKey}");

        return Ok(responseModel);
    }

    [HttpPut]
    [Route("{agreementId:int}")]
    public async Task<ActionResult<AgreementReadModel>> Put([FromRoute] string orgUrlKey,
        [FromRoute] int agreementId, [FromBody] AgreementWriteModel body, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (body.CustomerId is null && body.EngagementId is null)
        {
            ModelState.AddModelError("", "At least one of CustomerId or EngagementId must be provided.");
            return BadRequest(ModelState);
        }

        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null)
            return NotFound("Selected organization not found");

        var agreement = await agreementsRepository.GetAgreementById(agreementId, cancellationToken);
        if (agreement is null)
            return NotFound("Agreement not found");

        if (body.CustomerId is not null)
        {
            var customer = await context.Customer.FirstOrDefaultAsync(c => c.Id == body.CustomerId, cancellationToken);
            if (customer is null)
                return NotFound("Customer not found");

            agreement.CustomerId = body.CustomerId;
            agreement.Customer = customer;
        }
        else
        {
            agreement.CustomerId = null;
            agreement.Customer = null;
        }

        if (body.EngagementId is not null)
        {
            var engagement =
                await context.Project.FirstOrDefaultAsync(e => e.Id == body.EngagementId, cancellationToken);
            if (engagement is null)
                return NotFound("Engagement not found");

            agreement.EngagementId = body.EngagementId;
            agreement.Engagement = engagement;
        }
        else
        {
            agreement.EngagementId = null;
            agreement.Engagement = null;
        }

        agreement.Name = body.Name;
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
            UploadedOn = f.UploadedOn,
            UploadedBy = f.UploadedBy ?? "Unknown"
        }).ToList();

        await agreementsRepository.UpdateAgreementAsync(agreement, cancellationToken);

        var responseModel = new AgreementReadModel(
            AgreementId: agreement.Id,
            Name: agreement.Name,
            CustomerId: agreement.CustomerId,
            EngagementId: agreement.EngagementId,
            StartDate: agreement.StartDate,
            EndDate: agreement.EndDate,
            NextPriceAdjustmentDate: agreement.NextPriceAdjustmentDate,
            PriceAdjustmentIndex: agreement.PriceAdjustmentIndex,
            Notes: agreement.Notes,
            Options: agreement.Options,
            PriceAdjustmentProcess: agreement.PriceAdjustmentProcess,
            agreement.Files.Select(f => new FileReferenceReadModel(f)).ToList()
        );

        cache.Remove($"consultantCacheKey/{orgUrlKey}");

        return Ok(responseModel);
    }

    [HttpDelete]
    [Route("{agreementId:int}")]
    public async Task<ActionResult> Delete([FromRoute] string orgUrlKey, [FromRoute] int agreementId, CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return NotFound(SelectedOrganizationNotFound);

        var agreement = await agreementsRepository.GetAgreementById(agreementId, cancellationToken);
        if (agreement is null) return NotFound();

        await agreementsRepository.DeleteAgreementAsync(agreementId, cancellationToken);
        cache.Remove($"consultantCacheKey/{orgUrlKey}");

        return Ok("Deleted");
    }

    [HttpGet]
    [Route("priceAdjustmentIndexes")]
    public async Task<ActionResult<List<string>>> GetPriceAdjustmentIndexes([FromRoute] string orgUrlKey, CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return NotFound(SelectedOrganizationNotFound);

        var priceAdjustmentIndexes = await agreementsRepository.GetPriceAdjustmentIndexesAsync(cancellationToken);

        return Ok(priceAdjustmentIndexes);
    }
}