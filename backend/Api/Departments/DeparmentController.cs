using Database.DatabaseContext;
using Microsoft.AspNetCore.Mvc;

[Route("/v0/departments")]
[ApiController]
public class DepartmentController : ControllerBase {

    [HttpGet]
    public ActionResult<List<DepartmentReadModel>> Get(ApplicationContext applicationContext){

        return applicationContext.Department.Select(d => new DepartmentReadModel(d.Id, d.Name)).ToList();
        
    }
}

public record DepartmentReadModel(string Id, string Name);
