using System.ComponentModel.DataAnnotations;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Organisation;

[Route("/v0/competences")]
[ApiController]
public class CompetenceController : ControllerBase
{
    private readonly ApplicationContext _applicationContext;

    public CompetenceController(ApplicationContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    [HttpGet]
    public ActionResult<List<CompetenceReadModel>> Get()
    {
        return _applicationContext.Competence
            .Select(competence => new CompetenceReadModel(competence.Id, competence.Name))
            .ToList();
    }
}

public record CompetenceReadModel([property: Required] string Id, [property: Required] string Name);
