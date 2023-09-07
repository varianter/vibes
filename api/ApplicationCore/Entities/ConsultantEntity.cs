using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Entities;

public record ConsultantEntity
{
    [Key] public string Id { get; set; }

    public string Name { get; set; }

    public string DepartmentId { get; set; }
    public DepartmentEntity Department { get; set; } = null!;

    public DateTime EndDate { get; set; }

    public string OrganizationId { get; set; }
    public OrganizationEntity Organization { get; set; } = null!;

    public string? Email { get; set; }

    public virtual ICollection<GroupEntity> Groups { get; set; } = new List<GroupEntity>();
}