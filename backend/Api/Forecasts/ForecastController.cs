using Api.Common;
using Api.Helpers;
using Core.Consultants;
using Core.Extensions;
using Core.Forecasts;
using Core.PlannedAbsences;
using Core.Staffings;
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

		var consultants = service.LoadConsultants(orgUrlKey);
		consultants = await AddRelationalDataToConsultant(consultants, cancellationToken);

		var date = requestedDate ?? DateOnly.FromDateTime(DateTime.Today);

		var firstDayInQuarter = date.FirstDayInQuarter();

		var consultantsWithForecast = ConsultantWithForecastFactory.CreateMultiple(consultants, firstDayInQuarter, monthCount);

		return Ok(consultantsWithForecast);
	}

	// Using the same pattern as in AddRelationalDataToConsultant() in StaffingController
	private async Task<List<Consultant>> AddRelationalDataToConsultant(List<Consultant> consultants, CancellationToken cancellationToken)
	{
		var consultantIds = consultants.Select(c => c.Id).Distinct().ToList();

		var staffings = await staffingRepository.GetStaffingForConsultants(consultantIds, cancellationToken);
		var plannedAbsences = await plannedAbsenceRepository.GetPlannedAbsenceForConsultants(consultantIds, cancellationToken);
		var forecasts = await forecastRepository.GetForecastForConsultants(consultantIds, cancellationToken);

		return consultants.Select(consultant =>
		{
			consultant.Staffings = DictionaryHelper.GetFromDictOrDefault(consultant.Id, staffings);
			consultant.PlannedAbsences = DictionaryHelper.GetFromDictOrDefault(consultant.Id, plannedAbsences);
			consultant.Forecasts = DictionaryHelper.GetFromDictOrDefault(consultant.Id, forecasts);

			return consultant;
		}).ToList();
	}
}
