using Core.Onboardings;

// ReSharper disable NotAccessedPositionalProperty.Global

namespace Api.Onboardings;

public record OnboardingReadModel(
    int Id,
    int ConsultantId,
    string ConsultantName,
    DateTime CreatedAt,
    List<OnboardingStepReadModel> Steps)
{
    public OnboardingReadModel(Onboarding onboarding) : this(
        onboarding.Id,
        onboarding.ConsultantId,
        onboarding.Consultant?.Name ?? "",
        onboarding.CreatedAt,
        onboarding.Steps
            .OrderBy(step => step.Order)
            .Select(step => new OnboardingStepReadModel(step.Type, step.Order, step.Status, step.UpdatedAt,
                step.Message, OnboardingStepDependencies.For(step.Type).ToList()))
            .ToList())
    {
    }
}

/// <param name="StepStatuses">Status of each step, in step order</param>
public record ActiveOnboardingReadModel(int Id, int ConsultantId, List<OnboardingStepStatus> StepStatuses);

public static class OnboardingQueries
{
    /// <summary>
    ///     Onboardings in process (at least one step not done) in the organisation, the newest per consultant.
    /// </summary>
    public static IQueryable<ActiveOnboardingReadModel> ActiveInOrganization(this IQueryable<Onboarding> onboardings,
        string orgUrlKey)
    {
        var inProcess = onboardings
            .Where(o => o.Consultant!.Department.Organization.UrlKey == orgUrlKey)
            .Where(o => o.Steps.Any(step => step.Status != OnboardingStepStatus.Done));

        return inProcess
            .Where(o => !inProcess.Any(newer => newer.ConsultantId == o.ConsultantId && newer.Id > o.Id))
            .Select(o => new ActiveOnboardingReadModel(
                o.Id,
                o.ConsultantId,
                o.Steps.OrderBy(step => step.Order).Select(step => step.Status).ToList()));
    }
}

public record OnboardingStepReadModel(
    OnboardingStepType Type,
    int Order,
    OnboardingStepStatus Status,
    DateTime UpdatedAt,
    string? Message,
    List<OnboardingStepType> DependsOn);
