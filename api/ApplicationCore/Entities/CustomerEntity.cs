using System;
using System.Collections.Generic;

namespace Infrastructure.Entities;

public record CustomerEntity
{
    public string Id { get; set; }

    public string Name { get; set; }

    public string OrganizationId { get; set; }
    public OrganizationEntity Organization { get; set; } = null!;


    public bool? Internal { get; set; }
}
