using System;
using System.Collections.Generic;

namespace ApplicationCore.Entities;

public record EngagementEntity
{
    public string Id { get; set; }

    public string? Name { get; set; }

    public string? CustomerId { get; set; }

    public string? Status { get; set; }

    public string? Partner { get; set; }

    public string? ProjectManager { get; set; }

    public bool? Internal { get; set; }

    public bool? ExcludeFromBillRate { get; set; }

    public string OrganizationId { get; set; }
    public OrganizationEntity Organization { get; set; } = null!;

    public bool? Vacation { get; set; }
}
