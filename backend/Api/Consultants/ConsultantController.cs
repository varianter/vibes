using Api.Common;
using Core.DomainModels;
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
    [Route("{Email}")]
    public ActionResult<SingleConsultantReadModel> Get([FromRoute] string orgUrlKey,
        [FromRoute(Name = "Email")] string? email = "")
    {
        var service = new StorageService(_cache, _context);

        var consultant = service.GetConsultantByEmail(orgUrlKey, email ?? "");
        

        if (consultant is null)
        {
            return NotFound();
        }
        
        return Ok( new SingleConsultantReadModel(consultant));
    }

    [HttpGet]
    public ActionResult<List<SingleConsultantReadModel>> GetAll([FromRoute] string orgUrlKey)
    {
        var service = new StorageService(_cache, _context);

        var consultants = service.GetConsultants(orgUrlKey);

        List<SingleConsultantReadModel> readModels = consultants
            .Select(c => new SingleConsultantReadModel(c))
            .ToList();
        
        return Ok(readModels);
    }

    [HttpGet]
    [Route("employment")]
    public ActionResult<List<ConsultantsEmploymentReadModel>> GetConsultantsEmployment([FromRoute] string orgUrlKey)
    {
        var service = new StorageService(_cache, _context);

        var consultants = service.GetConsultantsEmploymentVariant(orgUrlKey);
    
        List<ConsultantsEmploymentReadModel> readModels = consultants
            .Select(c => new ConsultantsEmploymentReadModel(c))
            .ToList();
        
        
        return Ok(readModels);
    }

    [HttpPut]
    public ActionResult<SingleConsultantReadModel> Put([FromRoute] string orgUrlKey,
        [FromBody] ConsultantWriteModel body)
    {

        var service = new StorageService(_cache, _context);

        var selectedOrg = _context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var consultant = service.UpdateOrCreateConsultant(selectedOrg, body, orgUrlKey);



        var responseModel =
            new SingleConsultantReadModel(consultant);

        return Ok(responseModel);
    }
}
