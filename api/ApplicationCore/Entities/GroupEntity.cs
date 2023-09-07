using System;
using System.Collections.Generic;

namespace Infrastructure.Entities;

public record GroupEntity
{
    public string Id { get; set; }
    public string Name { get; set; }

    public string OrganizationId { get; set; }
    public OrganizationEntity Organization { get; set; } = null!;

    public virtual ICollection<ConsultantEntity> Consultants { get; set; } = new List<ConsultantEntity>();
}
