using System;
using System.Collections.Generic;

namespace Infrastructure.Entities;

public record StaffingEntity
{
    public string ConsultantId { get; set; }
    public ConsultantEntity Consultant { get; set; }

    public string EngagementId { get; set; }
    public EngagementEntity Engagement { get; set; }

    public long YearWeek { get; set; }

    public float Hours { get; set; }
}
