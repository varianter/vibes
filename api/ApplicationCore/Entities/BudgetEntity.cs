using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Entities;

public record BudgetEntity
{
    public string DepartmentId { get; set; }
    public DepartmentEntity Department { get; set; } = null!;
    public long YearMonth { get; set; }

    public int Value { get; set; }

    public string OrganizationId { get; set; }
    public OrganizationEntity Organization { get; set; } = null!;
}
