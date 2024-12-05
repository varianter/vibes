using System.ComponentModel.DataAnnotations.Schema;
using Core.Customers;
using Core.Engagements;

namespace Core.Agreements
{
    public class Agreement
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public int? CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public int? EngagementId { get; set; }
        public Engagement? Engagement { get; set; }

        public ICollection<FileReference> Files { get; set; } = new List<FileReference>();

        public DateOnly? StartDate { get; set; }
        public required DateOnly EndDate { get; set; }

        public DateOnly? NextPriceAdjustmentDate { get; set; }

        public string? PriceAdjustmentIndex { get; set; }
        public string? Notes { get; set; } = string.Empty;
        public string? Options { get; set; } = string.Empty;
        public string? PriceAdjustmentProcess { get; set; } = string.Empty;
    }


    public class FileReference
    {
        public string FileName { get; set; } = string.Empty;
        public string BlobName { get; set; } = string.Empty; // URI to the blob storage
        public DateTime UploadedOn { get; set; }

        public string? UploadedBy { get; set; } = string.Empty;
    }
}