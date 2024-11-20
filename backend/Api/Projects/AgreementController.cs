using Core.Agreements;
using Core.Customers;
using Core.Engagements;
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
    public async Task<ActionResult<List<AgreementReadModel>>> GetAgreementsByEngagement([FromRoute] string orgUrlKey,
        [FromRoute] int engagementId, CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var agreements = await agreementsRepository.GetAgreementsByEngagementId(engagementId, ct);

        if (agreements is null || !agreements.Any()) return NotFound();

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
            Files: agreement.Files.Select(f => new FileReferenceReadModel(
                FileName: f.FileName,
                BlobName: f.BlobName,
                UploadedOn: f.UploadedOn
            )).ToList()
        )).ToList();

        return Ok(responseModels);
    }

    [HttpGet]
    [Route("get/customer/{customerId}")]
    public async Task<ActionResult<List<AgreementReadModel>>> GetAgreementsByCustomer([FromRoute] string orgUrlKey,
        [FromRoute] int customerId, CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var agreements = await agreementsRepository.GetAgreementsByCustomerId(customerId, ct);

        if (agreements is null || !agreements.Any()) return NotFound();

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
            Files: agreement.Files.Select(f => new FileReferenceReadModel(
                FileName: f.FileName,
                BlobName: f.BlobName,
                UploadedOn: f.UploadedOn
            )).ToList()
        )).ToList();

        return Ok(responseModels);
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult<AgreementReadModel>> Post([FromRoute] string orgUrlKey,
        [FromBody] AgreementWriteModel body, CancellationToken ct)
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

        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null)
            return BadRequest("Selected organization not found");

        Customer? customer = null;
        if (body.CustomerId != null)
        {
            customer = await context.Customer.FindAsync(body.CustomerId.Value);
            if (customer == null)
                return BadRequest("Customer not found");
        }

        Engagement? engagement = null;
        if (body.EngagementId != null)
        {
            engagement = await context.Project.FindAsync(body.EngagementId.Value);
            if (engagement is null)
                return BadRequest("Engagement not found");
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
                UploadedOn = f.UploadedOn
            }).ToList()
        };

        await agreementsRepository.AddAgreementAsync(agreement, ct);

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
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (body.CustomerId is null && body.EngagementId is null)
        {
            ModelState.AddModelError("", "At least one of CustomerId or EngagementId must be provided.");
            return BadRequest(ModelState);
        }

        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null)
            return BadRequest("Selected organization not found");

        var agreement = await agreementsRepository.GetAgreementById(agreementId, ct);
        if (agreement is null)
            return NotFound("Agreement not found");

        Customer? customer = null;
        if (body.CustomerId is not null)
        {
            customer = await context.Customer.FindAsync(body.CustomerId);
            if (customer is null)
                return BadRequest("Customer not found");

            agreement.CustomerId = body.CustomerId;
            agreement.Customer = customer;
        }
        else
        {
            agreement.CustomerId = null;
            agreement.Customer = null;
        }

        Engagement? engagement = null;
        if (body.EngagementId is not null)
        {
            engagement = await context.Project.FindAsync(body.EngagementId);
            if (engagement is null)
                return BadRequest("Engagement not found");

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
            UploadedOn = f.UploadedOn
        }).ToList();

        await agreementsRepository.UpdateAgreementAsync(agreement, ct);

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

        return Ok("Deleted");
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