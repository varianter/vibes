using ApplicationCore.Services;
using Microsoft.AspNetCore.Mvc;

namespace RestApi.Controllers;

public class ConsultantsController : ControllerBase
{
    private readonly ConsultantsService _consultantsService;
    private readonly ILogger<ConsultantsController> _logger;
}