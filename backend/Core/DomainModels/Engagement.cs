using System.ComponentModel.DataAnnotations.Schema;

namespace Core.DomainModels;

public class Engagement
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public required Customer Customer { get; set; }

    public required EngagementState State { get; set; }

    public List<Consultant> Consultants { get; set; } = new();

    public required List<Staffing> Staffings { get; set; } = new();

    public required string Name { get; set; }

    public required bool IsBillable { get; set; }

    public void MergeEngagement(Engagement otherEngagement)
    {
        otherEngagement.Staffings.ForEach(s =>
        {
            var crashStaffing = Staffings.SingleOrDefault(staffing =>
                s.ConsultantId == staffing.ConsultantId && s.Week.Equals(staffing.Week));

            if (crashStaffing is not null)
                crashStaffing.Hours += s.Hours;
            else
                Staffings.Add(new Staffing
                {
                    EngagementId = Id,
                    Engagement = this,
                    ConsultantId = s.ConsultantId,
                    Consultant = s.Consultant,
                    Week = s.Week,
                    Hours = s.Hours
                });
            ;
        });
    }
}

public enum EngagementState
{
    Closed,
    Order,
    Lost,
    Offer,
    Absence,

    [Obsolete("'Active' is no longer used. Please use 'Order' instead")]
    Active
}