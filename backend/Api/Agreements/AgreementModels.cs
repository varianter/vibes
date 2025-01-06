using System.ComponentModel.DataAnnotations;
using Core.Agreements;
// ReSharper disable NotAccessedPositionalProperty.Global

namespace Api.Agreements;

public record AgreementReadModel(
    int AgreementId,
    string? Name,
    int? CustomerId,
    int? EngagementId,
    DateTime? StartDate,
    DateTime EndDate,
    DateTime? NextPriceAdjustmentDate,
    string? PriceAdjustmentIndex,
    string? Notes,
    string? Options,
    string? PriceAdjustmentProcess,
    List<FileReferenceReadModel> Files
);

public record FileReferenceReadModel(
    string FileName,
    string BlobName,
    DateTime UploadedOn,
    string? UploadedBy
)
{
    public FileReferenceReadModel(FileReference fileReference) : this(fileReference.FileName, fileReference.BlobName,
        fileReference.UploadedOn, fileReference.UploadedBy ?? "Unknown")
    {
    }
}

public record AgreementWriteModel(
    string? Name,
    int? CustomerId,
    int? EngagementId,
    DateTime? StartDate,
    DateTime EndDate,
    DateTime? NextPriceAdjustmentDate,
    string? PriceAdjustmentIndex,
    string? Notes,
    string? Options,
    string? PriceAdjustmentProcess,
    List<FileReferenceWriteModel> Files
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (CustomerId == null && EngagementId == null)
        {
            yield return new ValidationResult(
                "At least one of CustomerId or EngagementId must be provided.",
                new[] { nameof(CustomerId), nameof(EngagementId) });
        }
    }
}


// ReSharper disable once ClassNeverInstantiated.Global
public record FileReferenceWriteModel(
    string FileName,
    string BlobName,
    DateTime UploadedOn,
    string? UploadedBy
);