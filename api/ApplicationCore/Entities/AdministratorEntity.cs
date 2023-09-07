using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ApplicationCore.Entities;

public record AdministratorEntity
{
    public string Email { get; set; }
    
    public string ConsultantId { get; set; }
    public ConsultantEntity Consultant { get; set; } = null!;

    public string OrganizationId { get; set; }
    public OrganizationEntity Organization { get; set; } = null!;

    public bool Selected { get; set; }
} 
