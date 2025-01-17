using Api.Common;
using Api.Helpers;
using Core.Consultants;
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
	IForecastRepository forecastRepository,
	IStaffingRepository staffingRepository,
	IPlannedAbsenceRepository plannedAbsenceRepository)
	: ControllerBase
{
	[HttpGet]
	public async Task<ActionResult> Get(
		[FromRoute] string orgUrlKey,
		CancellationToken cancellationToken,
		[FromQuery(Name = "Year")] int? selectedYearParam = null,
		[FromQuery(Name = "Month")] int? selectedMonthParam = null,
		[FromQuery(Name = "MonthCount")] int monthCount = 0)
	{
		var service = new StorageService(cache, context);

		var consultants = service.LoadConsultants(orgUrlKey);
		consultants = await AddRelationalDataToConsultant(consultants, cancellationToken);

		// TODO Is the month input parameter 0- or 1-indexed? GetDateOrToday() considers 1-indexed month
		var month = GetDateOrToday(selectedYearParam, selectedMonthParam);

		var forecasts = ReadModelFactory.GetForecastReadModels(consultants, month, monthCount);

		return Ok(forecasts);
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

	private static DateOnly GetDateOrToday(int? year, int? month)
	{
		if (TryParseAsDateOnly(out var date, year, month))
		{
			return date;
		}

		var today = DateTime.Today;

		return new DateOnly(today.Year, today.Month, 1);
	}

	private static bool TryParseAsDateOnly(out DateOnly date, int? year, int? month, int? day = 1)
	{
		try
		{
			date = new DateOnly(year.Value, month.Value, day.Value);
			return true;
		}
		catch
		{
			date = DateOnly.MinValue;
			return false;
		}
	}
}
