using Core.Consultants;
using Core.Onboardings;
using Core.Organizations;

namespace Tests.Core.Tests;

public class OnboardingTests
{
    private static readonly DateTime Now = new(2026, 11, 2, 12, 0, 0, DateTimeKind.Utc);

    private static Consultant CreateConsultant()
    {
        return new Consultant
        {
            Id = 42,
            Name = "Kari Nordmann",
            Email = "kari@variant.no",
            Department = null!
        };
    }

    [Fact]
    public void Start_CreatesOneStepPerSystemInOrder()
    {
        var onboarding = Onboarding.Start(CreateConsultant(), "leder@variant.no", Now);

        Assert.Equal(
            [
                OnboardingStepType.Staffing, OnboardingStepType.EntraId, OnboardingStepType.Flowcase,
                OnboardingStepType.Slack, OnboardingStepType.Donut
            ],
            onboarding.Steps.Select(step => step.Type));
        Assert.Equal([1, 2, 3, 4, 5], onboarding.Steps.Select(step => step.Order));
    }

    [Fact]
    public void Start_MarksOnlyStaffingAsDone()
    {
        var onboarding = Onboarding.Start(CreateConsultant(), "leder@variant.no", Now);

        Assert.Equal(OnboardingStepStatus.Done,
            onboarding.Steps.Single(step => step.Type == OnboardingStepType.Staffing).Status);
        Assert.All(onboarding.Steps.Where(step => step.Type != OnboardingStepType.Staffing),
            step => Assert.Equal(OnboardingStepStatus.NotStarted, step.Status));
    }

    [Fact]
    public void Start_RecordsConsultantCreatorAndTime()
    {
        var onboarding = Onboarding.Start(CreateConsultant(), "leder@variant.no", Now);

        Assert.Equal(42, onboarding.ConsultantId);
        Assert.Equal("leder@variant.no", onboarding.CreatedBy);
        Assert.Equal(Now, onboarding.CreatedAt);
        Assert.All(onboarding.Steps, step => Assert.Equal(Now, step.UpdatedAt));
    }

    [Fact]
    public void Dependencies_AreEarlierStepsInTheOnboarding()
    {
        // Guards against cycles: a step can only wait for steps listed before it
        var steps = Onboarding.Start(CreateConsultant(), "leder@variant.no", Now).Steps;

        foreach (var step in steps)
        foreach (var dependency in OnboardingStepDependencies.For(step.Type))
            Assert.True(steps.Single(s => s.Type == dependency).Order < step.Order,
                $"{step.Type} depends on {dependency}, which comes later");
    }

    [Fact]
    public void Dependencies_FlowcaseAndSlackWaitForEntra()
    {
        Assert.Equal([OnboardingStepType.EntraId], OnboardingStepDependencies.For(OnboardingStepType.Flowcase));
        Assert.Equal([OnboardingStepType.EntraId], OnboardingStepDependencies.For(OnboardingStepType.Slack));
        Assert.Equal([OnboardingStepType.Slack], OnboardingStepDependencies.For(OnboardingStepType.Donut));
    }
}
