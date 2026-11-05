using Core.Onboardings;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Api.Onboardings;

/// <summary>
///     Runs the "Bruker og lisens" step (Entra ID / O365) for onboardings where it has not started yet.
/// </summary>
public class EntraOnboardingStepProcessor(
    ApplicationContext context,
    IEntraUserProvisioner provisioner,
    ILogger<EntraOnboardingStepProcessor> logger) : OnboardingStepProcessor(context)
{
    protected override OnboardingStepType StepType => OnboardingStepType.EntraId;

    protected override async Task ProcessStep(int stepId, CancellationToken cancellationToken)
    {
        var step = await Context.OnboardingSteps.SingleAsync(s => s.Id == stepId, cancellationToken);
        var onboarding = await Context.Onboardings
            .Include(o => o.Consultant)
            .ThenInclude(c => c!.Department)
            .SingleAsync(o => o.Id == step.OnboardingId, cancellationToken);
        var consultant = onboarding.Consultant!;

        // The login name is made from the name; the email from the form is the candidate's own address
        EntraProvisioningResult result;
        try
        {
            result = await provisioner.CreateUser(new EntraUserRequest(
                consultant.Name,
                consultant.Department.Name,
                consultant.StartDate), cancellationToken);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            // Log only the type: the message can contain personal data
            logger.LogError("Creating Entra user for onboarding step {StepId} failed with {ExceptionType}",
                stepId, exception.GetType().Name);
            result = EntraProvisioningResult.Failure("Uventet feil ved opprettelse av bruker");
        }

        step.Status = result.Succeeded ? OnboardingStepStatus.Done : OnboardingStepStatus.Failed;
        step.Message = result.Message;
        step.UpdatedAt = DateTime.UtcNow;
        onboarding.EntraUserId = result.UserId ?? onboarding.EntraUserId;
        // Email stays the address from the form; the new O365 address goes in its own field
        if (result.Succeeded) consultant.WorkEmail = result.UserPrincipalName;
        await Context.SaveChangesAsync(cancellationToken);
    }
}
