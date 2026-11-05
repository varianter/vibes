using Api.Common;
using Api.Consultants;
using Core.Onboardings;
using Core.Organizations;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Onboardings;

/// <summary>
///     Automated onboarding of new consultants (beta). Creates the consultant and tracks the status per system.
/// </summary>
[Authorize(Roles = AppRoles.Onboarding)]
[Route("/v0/{orgUrlKey}/onboardings")]
[ApiController]
public class OnboardingController(
    ApplicationContext context,
    IMemoryCache cache,
    ILogger<StorageService> logger,
    IOrganisationRepository organisationRepository) : ControllerBase
{
    private readonly StorageService _storageService = new(cache, logger, context);

    [HttpPost]
    public async Task<ActionResult<OnboardingReadModel>> Start([FromRoute] string orgUrlKey,
        [FromBody] ConsultantWriteModel body, CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        // The consultant and the onboarding are created together, or not at all
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);

        var consultant = await _storageService.CreateConsultant(selectedOrg, body, cancellationToken);
        var onboarding = Onboarding.Start(consultant, GetUserEmail(), DateTime.UtcNow);

        context.Onboardings.Add(onboarding);
        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return CreatedAtAction(nameof(Get), new { orgUrlKey, id = onboarding.Id },
            new OnboardingReadModel(onboarding));
    }

    [HttpGet]
    public async Task<ActionResult<List<ActiveOnboardingReadModel>>> GetActive([FromRoute] string orgUrlKey,
        CancellationToken cancellationToken)
    {
        var active = await context.Onboardings.ActiveInOrganization(orgUrlKey).ToListAsync(cancellationToken);

        return Ok(active);
    }

    [HttpGet]
    [Route("{id:int}")]
    public async Task<ActionResult<OnboardingReadModel>> Get([FromRoute] string orgUrlKey, [FromRoute] int id,
        CancellationToken cancellationToken)
    {
        var onboarding = await context.Onboardings
            .Include(o => o.Steps)
            .Include(o => o.Consultant)
            .ThenInclude(c => c!.Department)
            .ThenInclude(d => d.Organization)
            .SingleOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (onboarding?.Consultant?.Department.Organization.UrlKey != orgUrlKey) return NotFound();

        return Ok(new OnboardingReadModel(onboarding));
    }

    private string GetUserEmail()
    {
        return User.FindFirst("preferred_username")?.Value ?? User.Identity?.Name ?? "unknown";
    }
}
