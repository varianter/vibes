using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Entities;

public record OrganizationEntity
{
    [Key] public string Id { get; set; }

    public string OrganizationName { get; set; }

    public string HolidayCountry { get; set; }

    public bool FullXmassHoliday { get; set; }

    public int? NumberOfVacationDays { get; set; }

    public float HoursPerDay { get; set; }
}