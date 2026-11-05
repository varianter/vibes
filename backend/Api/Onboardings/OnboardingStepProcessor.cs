using Core.Onboardings;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Api.Onboardings;

/// <summary>
///     Runs one type of onboarding step for every onboarding where it has not started yet.
/// </summary>
public abstract class OnboardingStepProcessor(ApplicationContext context)
{
    protected ApplicationContext Context => context;

    protected abstract OnboardingStepType StepType { get; }

    /// <returns>Number of steps processed</returns>
    public async Task<int> ProcessPendingSteps(CancellationToken cancellationToken)
    {
        // Only steps whose dependencies (OnboardingStepDependencies) are all done
        var dependsOn = OnboardingStepDependencies.For(StepType);
        var pendingIds = await context.OnboardingSteps
            .Where(step => step.Type == StepType && step.Status == OnboardingStepStatus.NotStarted)
            .Where(step => context.OnboardingSteps.Count(other =>
                other.OnboardingId == step.OnboardingId &&
                dependsOn.Contains(other.Type) &&
                other.Status == OnboardingStepStatus.Done) == dependsOn.Length)
            .Select(step => step.Id)
            .ToListAsync(cancellationToken);

        var processed = 0;
        foreach (var stepId in pendingIds)
        {
            // Claim the step atomically, so two app instances never run the same step twice
            var claimed = await context.OnboardingSteps
                .Where(step => step.Id == stepId && step.Status == OnboardingStepStatus.NotStarted)
                .ExecuteUpdateAsync(set => set
                    .SetProperty(step => step.Status, OnboardingStepStatus.InProgress)
                    .SetProperty(step => step.UpdatedAt, DateTime.UtcNow), cancellationToken);
            if (claimed == 0) continue;

            await ProcessStep(stepId, cancellationToken);
            processed++;
        }

        return processed;
    }

    /// <summary>Runs a claimed step (status InProgress) and saves the outcome</summary>
    protected abstract Task ProcessStep(int stepId, CancellationToken cancellationToken);
}

/// <summary>
///     Checks for pending steps of one type every few seconds.
/// </summary>
public class OnboardingStepBackgroundService<TProcessor>(
    IServiceScopeFactory scopeFactory,
    TimeSpan pollInterval,
    ILogger<OnboardingStepBackgroundService<TProcessor>> logger) : BackgroundService
    where TProcessor : OnboardingStepProcessor
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(pollInterval);
        do
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var processor = scope.ServiceProvider.GetRequiredService<TProcessor>();
                await processor.ProcessPendingSteps(stoppingToken);
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                logger.LogError("{Processor} run failed with {ExceptionType}", typeof(TProcessor).Name,
                    exception.GetType().Name);
            }
        } while (await timer.WaitForNextTickAsync(stoppingToken));
    }
}

public static class OnboardingStepBackgroundServiceExtensions
{
    public static IServiceCollection AddOnboardingStepProcessor<TProcessor>(this IServiceCollection services,
        int pollIntervalSeconds) where TProcessor : OnboardingStepProcessor
    {
        services.AddScoped<TProcessor>();
        services.AddHostedService(provider => new OnboardingStepBackgroundService<TProcessor>(
            provider.GetRequiredService<IServiceScopeFactory>(),
            TimeSpan.FromSeconds(pollIntervalSeconds),
            provider.GetRequiredService<ILogger<OnboardingStepBackgroundService<TProcessor>>>()));
        return services;
    }
}
