using Core.Consultants;

namespace Core.Onboardings;

/// <summary>
///     An automated onboarding (beta) of a new consultant, with one step per system the consultant is set up in.
/// </summary>
public class Onboarding
{
    public int Id { get; init; }

    public required int ConsultantId { get; init; }
    public Consultant? Consultant { get; init; }

    public required DateTime CreatedAt { get; init; }

    /// <summary>Email of the person who started the onboarding</summary>
    public required string CreatedBy { get; init; }

    public List<OnboardingStep> Steps { get; init; } = [];

    /// <summary>Object id of the user created in Entra ID / O365, used by later steps</summary>
    public string? EntraUserId { get; set; }

    /// <summary>
    ///     Starts an onboarding for a consultant that has just been created in Vibes.
    ///     The staffing step is done at once; the other systems are not integrated yet and start as not started.
    /// </summary>
    public static Onboarding Start(Consultant consultant, string createdBy, DateTime now)
    {
        var steps = new[]
        {
            OnboardingStepType.Staffing,
            OnboardingStepType.EntraId,
            OnboardingStepType.Flowcase,
            OnboardingStepType.Slack,
            OnboardingStepType.Donut
        };

        return new Onboarding
        {
            ConsultantId = consultant.Id,
            Consultant = consultant,
            CreatedAt = now,
            CreatedBy = createdBy,
            Steps = steps.Select((type, index) => new OnboardingStep
            {
                Type = type,
                Order = index + 1,
                Status = type == OnboardingStepType.Staffing ? OnboardingStepStatus.Done : OnboardingStepStatus.NotStarted,
                UpdatedAt = now
            }).ToList()
        };
    }
}

public class OnboardingStep
{
    public int Id { get; init; }

    public int OnboardingId { get; init; }

    public required OnboardingStepType Type { get; init; }
    public required int Order { get; init; }
    public required OnboardingStepStatus Status { get; set; }
    public required DateTime UpdatedAt { get; set; }

    /// <summary>Optional details shown to the user, e.g. why a step failed. Never personal data.</summary>
    public string? Message { get; set; }
}

/// <summary>
///     Which steps must be done before a step can start. Background jobs only pick up a step when these are done,
///     and the status page shows what a step is waiting for.
/// </summary>
public static class OnboardingStepDependencies
{
    private static readonly Dictionary<OnboardingStepType, OnboardingStepType[]> DependsOn = new()
    {
        [OnboardingStepType.Staffing] = [],
        [OnboardingStepType.EntraId] = [OnboardingStepType.Staffing],
        // Uses the new @variant.no address
        [OnboardingStepType.Flowcase] = [OnboardingStepType.EntraId],
        // The candidate joins Slack with the new @variant.no address
        [OnboardingStepType.Slack] = [OnboardingStepType.EntraId],
        // Donut adds people who are in Slack
        [OnboardingStepType.Donut] = [OnboardingStepType.Slack]
    };

    public static OnboardingStepType[] For(OnboardingStepType type)
    {
        return DependsOn.GetValueOrDefault(type, []);
    }
}

public enum OnboardingStepType
{
    EntraId,
    Slack,
    Flowcase,
    Staffing,
    Donut
}

public enum OnboardingStepStatus
{
    NotStarted,
    InProgress,
    Done,
    Failed
}
