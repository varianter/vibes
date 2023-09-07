using System;
using System.Collections.Generic;

namespace Infrastructure.Entities;

public record VacationEntity
{
    public string ConsultantId { get; set; }
    public ConsultantEntity Consultant { get; set; }
    public string VacationDate { get; set; } = null!;
}
