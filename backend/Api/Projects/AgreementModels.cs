using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public record AgreementReadModel(
    int AgreementId,
    int EngagementId,
    DateTime? StartDate,
    DateTime EndDate,
    DateTime? NextPriceAdjustmentDate,
    string? PriceAdjustmentIndex,
    string? Notes,
    List<FileReferenceReadModel> Files
);

public record FileReferenceReadModel(
    string FileName,
    string BlobName,
    DateTime UploadedOn
);

public record AgreementWriteModel(
    int EngagementId,
    DateTime? StartDate,
    DateTime EndDate,
    DateTime? NextPriceAdjustmentDate,
    string? PriceAdjustmentIndex,
    string? Notes,
    List<FileReferenceWriteModel> Files
);

public record FileReferenceWriteModel(
    string FileName,
    string BlobName,
    DateTime UploadedOn
);
    