using System;
using System.Collections.Generic;

namespace Infrastructure.Entities;

public record AdditionalVacationDayEntity
{
    public string ConsultantId { get; set; }
    public ConsultantEntity Consultant { get; set; } = null!;

    public int Year { get; set; }

    public int NumberOfDays { get; set; }

    public string? Type { get; set; }
}
