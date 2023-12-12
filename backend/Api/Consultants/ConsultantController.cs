using Api.Common;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Consultants;

[Authorize]
[Route("/v0/{orgUrlKey}/consultants")]
[ApiController]
public class ConsultantController : ControllerBase
{
    
    private readonly IMemoryCache _cache;
    private readonly ApplicationContext _context;

    public ConsultantController(ApplicationContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }
    
    
    [HttpGet]
    public ActionResult<SingleConsultantReadModel> Get([FromRoute] string orgUrlKey,
        [FromQuery(Name = "Email")] string? email = "")
    {
        var service = new StorageService(_cache, _context);

        var consultant = service.GetConsultantByEmail(orgUrlKey, email ?? "");

        if (consultant is null)
        {
            return NotFound();
        }
        
        return Ok( new SingleConsultantReadModel(consultant));
    }

    
}
