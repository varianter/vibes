using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Consultants;

[Route("/v0/disciplines")]
[ApiController]
public sealed class DisciplineController(ApplicationContext applicationContext) : ControllerBase
{
    [HttpGet]
    public async Task<Ok<DisciplineReadModel[]>> Get(CancellationToken cancellationToken)
    {
        var disciplines = await applicationContext.Disciplines.Select(x => new DisciplineReadModel(x.Id, x.Name))
            .ToArrayAsync(cancellationToken);

        return TypedResults.Ok(disciplines);
    }
}
