using System.Diagnostics;
using Api.Common;
using Api.Helpers;
using Core.Consultants;
using Core.Extensions;
using Core.Forecasts;
using Core.PlannedAbsences;
using Core.Staffings;
using Core.Weeks;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Forecasts;

[Authorize]
[Route("/v0/{orgUrlKey}/forecasts")]
[ApiController]
public class ForecastController(
    ApplicationContext context,
    IMemoryCache cache,
    ILogger<StorageService> logger,
    IForecastRepository forecastRepository,
    IStaffingRepository staffingRepository,
    IPlannedAbsenceRepository plannedAbsenceRepository)
    : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> Get(
        [FromRoute] string orgUrlKey,
        CancellationToken cancellationToken,
        [FromQuery(Name = "Date")] DateOnly? requestedDate = null,
        [FromQuery(Name = "MonthCount")] int monthCount = 12)
    {
        var service = new StorageService(cache, logger, context);
        var stopwatch = Stopwatch.StartNew();
        var consultants = service.LoadConsultants(orgUrlKey);
        Console.WriteLine($"GET FORECAST - [Checkpoint 0] Loaded consultants - {stopwatch.ElapsedMilliseconds} ms");
        consultants = await AddRelationalDataToConsultant(consultants, cancellationToken);
        Console.WriteLine(
            $"GET FORECAST - [Checkpoint 5] Add relational data completed - {stopwatch.ElapsedMilliseconds} ms");
        var date = requestedDate ?? DateOnly.FromDateTime(DateTime.Today);

        var firstDayInQuarter = date.FirstDayInQuarter();

        var consultantsWithForecast =
            ConsultantWithForecastFactory.CreateMultiple(consultants, firstDayInQuarter, monthCount);
        Console.WriteLine($"GET FORECAST - [Checkpoint 6] Created forecast data - {stopwatch.ElapsedMilliseconds} ms");
        stopwatch.Stop();
        return Ok(consultantsWithForecast);
    }

    [HttpPut]
    [Route("update")]
    public async Task<ActionResult> Put([FromRoute] string orgUrlKey, [FromBody] ForecastWriteModel forecastWriteModel,
        CancellationToken cancellationToken)
    {
        var service = new StorageService(cache, logger, context);
        var adjustedPercentage = forecastWriteModel.AdjustedValue;

        var consultant = service.LoadConsultantForSingleWeek(forecastWriteModel.ConsultantId,
            Week.FromDateOnly(forecastWriteModel.DateOnly));

        if (consultant is null)
        {
            return NotFound("Consultant not found");
        }

        consultant = await AddRelationalDataToConsultant(consultant, cancellationToken);

        var withForecast = ConsultantWithForecastFactory.CreateSingle(consultant, forecastWriteModel.DateOnly,
            forecastWriteModel.DateOnly.AddMonths(1));

        var billablePercentage = withForecast.Forecasts[0].BillablePercentage;

        if (billablePercentage == 100)
        {
            return BadRequest("Staffing percentage is 100%, can't adjust forecast");
        }

        if (adjustedPercentage < billablePercentage)
        {
            return BadRequest(
                $"Percentage cannot be lower than staffing percentage ({billablePercentage}%)");
        }

        if (adjustedPercentage > 100)
        {
            return BadRequest("Percentage cannot be higher than 100");
        }

        var forecast = consultant.Forecasts.FirstOrDefault(f => f.Month == forecastWriteModel.DateOnly);
        if (forecast is null)
        {
            forecast = new Forecast
            {
                Month = forecastWriteModel.DateOnly,
                ConsultantId = consultant.Id,
                AdjustedValue = adjustedPercentage,
            };
        }
        else
        {
            forecast.AdjustedValue = adjustedPercentage;
        }

        await forecastRepository.UpsertForecasts([forecast], cancellationToken);

        return Ok(forecast);
    }

    private async Task<Consultant> AddRelationalDataToConsultant(Consultant consultant,
        CancellationToken cancellationToken)
    {
        var staffings = await staffingRepository.GetStaffingForConsultant(consultant.Id, cancellationToken);
        var plannedAbsences =
            await plannedAbsenceRepository.GetPlannedAbsenceForConsultant(consultant.Id, cancellationToken);
        var forecasts = await forecastRepository.GetForecastForConsultant(consultant.Id, cancellationToken);

        consultant.Staffings = staffings;
        consultant.PlannedAbsences = plannedAbsences;
        consultant.Forecasts = forecasts;

        return consultant;
    }

    // Using the same pattern as in AddRelationalDataToConsultant() in StaffingController
    private async Task<List<Consultant>> AddRelationalDataToConsultant(List<Consultant> consultants,
        CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();
        var consultantIds = consultants.Select(c => c.Id).Distinct().ToList();
        Console.WriteLine(
            $"ADDING RELATIONAL DATA - [Checkpoint 1] Extracted consultant IDs - {stopwatch.ElapsedMilliseconds} ms");
        var staffings = await staffingRepository.GetStaffingForConsultants(consultantIds, cancellationToken);
        Console.WriteLine(
            $"ADDING RELATIONAL DATA - [Checkpoint 2] Retrieved staffing data - {stopwatch.ElapsedMilliseconds} ms");
        var plannedAbsences =
            await plannedAbsenceRepository.GetPlannedAbsenceForConsultants(consultantIds, cancellationToken);
        Console.WriteLine(
            $"ADDING RELATIONAL DATA - [Checkpoint 3] Retrieved absence data - {stopwatch.ElapsedMilliseconds} ms");
        var forecasts = await forecastRepository.GetForecastForConsultants(consultantIds, cancellationToken);
        Console.WriteLine(
            $"ADDING RELATIONAL DATA - [Checkpoint 4] Retrieved forecast data - {stopwatch.ElapsedMilliseconds} ms");
        stopwatch.Stop();
        return consultants.Select(consultant =>
        {
            consultant.Staffings = DictionaryHelper.GetFromDictOrDefault(consultant.Id, staffings);
            consultant.PlannedAbsences = DictionaryHelper.GetFromDictOrDefault(consultant.Id, plannedAbsences);
            consultant.Forecasts = DictionaryHelper.GetFromDictOrDefault(consultant.Id, forecasts);

            return consultant;
        }).ToList();
    }
}

public record ForecastWriteModel(
    int ConsultantId,
    DateTime Month,
    int AdjustedValue
)
{
    public DateOnly DateOnly => new(Month.Year, Month.Month, 1);
}