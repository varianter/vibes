"use server";

import {
  deleteWithToken,
  fetchWithToken,
  postWithToken,
  putWithToken,
} from "@/data/apiCallsWithToken";
import { Agreement, AgreementWriteModel, FileReference } from "@/types";
import { deleteFiles, uploadFiles } from "./blobActions";

export async function saveChanges(
  formData: FormData,
  oldFiles: FileReference[],
  org: string,
) {
  try {
    const agreementId = formData.get("agreementId") as string;
    let agreementData: AgreementWriteModel = {
      name: formData.get("name") as string,
      engagementId: formData.get("engagementId")
        ? Number(formData.get("engagementId") as string)
        : undefined,
      customerId: formData.get("customerId")
        ? Number(formData.get("customerId") as string)
        : undefined,
      startDate: (formData.get("startDate") as string)
        ? new Date(formData.get("startDate") as string)
        : undefined,
      endDate: new Date(formData.get("endDate") as string),
      nextPriceAdjustmentDate: (formData.get(
        "nextPriceAdjustmentDate",
      ) as string)
        ? new Date(formData.get("nextPriceAdjustmentDate") as string)
        : undefined,
      priceAdjustmentIndex: formData.get("priceAdjustmentIndex") as string,
      notes: formData.get("notes") as string,
      options: formData.get("options") as string,
      priceAdjustmentProcess: formData.get("priceAdjustmentProcess") as string,
      files: oldFiles,
    };

    const files = formData.getAll("files") as File[];
    const validFiles = files.filter(
      (file) => file.size > 0 && file.name !== "undefined",
    );

    if (validFiles.length > 0) {
      const fileRes = await uploadFiles(validFiles);
      agreementData.files = [...(agreementData.files ?? []), ...fileRes];
    }

    if (agreementId !== null) {
      const res = await updateAgreement(
        { ...agreementData, agreementId: Number(agreementId) },
        org,
      );

      if (res) {
        return res;
      } else {
        if (validFiles.length > 0) {
          await deleteFiles(
            validFiles.map(
              (file) =>
                `${file.name}${agreementData.files?.find(
                  (f) => f.fileName === file.name,
                )?.uploadedOn}`,
            ),
          );
        }
        console.error("Failed to update agreement");
        return;
      }
    } else {
      const res = await createAgreement(agreementData, org);
      if (res) {
        return res;
      } else {
        if (validFiles.length > 0) {
          await deleteFiles(
            validFiles.map(
              (file) =>
                `${file.name}${agreementData.files?.find(
                  (f) => f.fileName === file.name,
                )?.uploadedOn}`,
            ),
          );
        }
        console.error("Failed to create agreement");
        return;
      }
    }
  } catch (error) {
    console.error("Failed to save changes", error);
    throw new Error(`Failed to save changes: ${error}`);
  }
}
function ensureDatesOnAgreement(agreement: Agreement) {
  if (typeof agreement.endDate === "string") {
    console.log("heei", agreement.endDate);
    agreement.endDate = new Date(agreement.endDate);
  }

  if (typeof agreement.startDate === "string") {
    agreement.startDate = new Date(agreement.startDate);
  }

  if (typeof agreement.nextPriceAdjustmentDate === "string") {
    agreement.nextPriceAdjustmentDate = new Date(
      agreement.nextPriceAdjustmentDate,
    );
  }

  return agreement;
}

export async function deleteFile(
  blobName: string,
  agreement: Agreement,
  org: string,
) {
  try {
    await updateAgreement(agreement, org);

    await deleteFiles([blobName]);
  } catch (error) {
    console.error("Failed to delete file", error);
    throw new Error(`Failed to delete file: ${error}`);
  }
}

export async function getAgreementsForProject(
  projectId: number,
  orgUrlKey: string,
) {
  try {
    const res = await fetchWithToken<Agreement[]>(
      `${orgUrlKey}/agreements/get/engagement/${projectId}`,
    );

    let agreementsWithDateTypes: Agreement[] = [];
    if (res) {
      agreementsWithDateTypes = res.map(ensureDatesOnAgreement);
    }
    return agreementsWithDateTypes;
  } catch (e) {
    console.error("Error fetching agreement for project", e);
  }
}

export async function getAgreementsForCustomer(
  customerId: number,
  orgUrlKey: string,
) {
  try {
    const res = await fetchWithToken<Agreement[]>(
      `${orgUrlKey}/agreements/get/customer/${customerId}`,
    );

    let agreementsWithDateTypes: Agreement[] = [];
    if (res) {
      agreementsWithDateTypes = res.map(ensureDatesOnAgreement);
    }
    return agreementsWithDateTypes;
  } catch (e) {
    console.error("Error fetching agreement for customer", e);
  }
}

export async function updateAgreement(agreement: Agreement, orgUrlKey: string) {
  try {
    const res = await putWithToken<Agreement, Agreement>(
      `${orgUrlKey}/agreements/update/${agreement.agreementId}`,
      agreement,
    );

    let agreementWithDateTypes: Agreement | null = null;
    if (res) {
      agreementWithDateTypes = ensureDatesOnAgreement(res);
    }
    return agreementWithDateTypes;
  } catch (e) {
    console.error("Error updating agreement", e);
  }
}

export async function createAgreement(
  agreement: AgreementWriteModel,
  orgUrlKey: string,
) {
  try {
    const res = await postWithToken<Agreement, AgreementWriteModel>(
      `${orgUrlKey}/agreements/create`,
      agreement,
    );
    let agreementWithDateTypes: Agreement | null = null;
    if (res) {
      agreementWithDateTypes = ensureDatesOnAgreement(res);
    }
    return agreementWithDateTypes;
  } catch (e) {
    console.error("Error creating agreement", e);
  }
}

export async function deleteAgreement(agreementId: number, orgUrlKey: string) {
  try {
    const res = await deleteWithToken<Agreement, Agreement>(
      `${orgUrlKey}/agreements/delete/${agreementId}`,
    );

    return res;
  } catch (e) {
    console.error("Error deleting agreement", e);
  }
}

export async function deleteAgreementWithFiles(
  agreement: Agreement,
  org: string,
) {
  try {
    await deleteFiles(agreement.files?.map((file) => file.blobName) ?? []);

    return await deleteAgreement(agreement.agreementId, org);
  } catch (e) {
    console.error("Error deleting agreement with files", e);
  }
}

export async function getPriceAdjustmentIndexes(orgUrlKey: string) {
  try {
    const res = await fetchWithToken<string[]>(
      `${orgUrlKey}/agreements/priceAdjustmentIndexes`,
    );

    return res;
  } catch (e) {
    console.error("Error fetching price adjustment indexes", e);
  }
}
