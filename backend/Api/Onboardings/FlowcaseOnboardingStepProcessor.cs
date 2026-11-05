using Core.Onboardings;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Api.Onboardings;

/// <summary>
///     Runs the "CV-profil" step (Flowcase). Starts when the Entra step is done (see OnboardingStepDependencies),
///     since the profile uses the new @variant.no address.
/// </summary>
public class FlowcaseOnboardingStepProcessor(
    ApplicationContext context,
    IFlowcaseUserProvisioner provisioner,
    ILogger<FlowcaseOnboardingStepProcessor> logger) : OnboardingStepProcessor(context)
{
    protected override OnboardingStepType StepType => OnboardingStepType.Flowcase;

    protected override async Task ProcessStep(int stepId, CancellationToken cancellationToken)
    {
        var step = await Context.OnboardingSteps.SingleAsync(s => s.Id == stepId, cancellationToken);
        var onboarding = await Context.Onboardings
            .Include(o => o.Consultant)
            .ThenInclude(c => c!.Department)
            .SingleAsync(o => o.Id == step.OnboardingId, cancellationToken);
        var consultant = onboarding.Consultant!;

        FlowcaseProvisioningResult result;
        if (string.IsNullOrWhiteSpace(consultant.WorkEmail))
            result = FlowcaseProvisioningResult.Failure("Mangler @variant.no-adresse fra Entra-steget");
        else
            try
            {
                result = await provisioner.CreateUser(new FlowcaseUserRequest(
                    consultant.Name,
                    consultant.WorkEmail,
                    consultant.Department.Name), cancellationToken);
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                // Log only the type: the message can contain personal data
                logger.LogError("Creating Flowcase user for onboarding step {StepId} failed with {ExceptionType}",
                    stepId, exception.GetType().Name);
                result = FlowcaseProvisioningResult.Failure("Uventet feil ved opprettelse av CV-profil");
            }

        step.Status = result.Succeeded ? OnboardingStepStatus.Done : OnboardingStepStatus.Failed;
        step.Message = result.Message;
        step.UpdatedAt = DateTime.UtcNow;
        await Context.SaveChangesAsync(cancellationToken);
    }
}
