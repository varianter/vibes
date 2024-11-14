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
      engagementId: Number(formData.get("engagementId") as string),
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
      files: oldFiles,
    };

    const files = formData.getAll("files") as File[];
    const validFiles = files.filter(
      (file) => file.size > 0 && file.name !== "undefined",
    );

    if (validFiles.length > 0) {
      const fileRes = await uploadFiles(agreementData.engagementId, validFiles);
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
              (file) => `${agreementData.engagementId}${file.name}`,
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
              (file) => `${agreementData.engagementId}${file.name}`,
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

export async function getAgreementForProject(
  projectId: number,
  orgUrlKey: string,
) {
  try {
    const res = await fetchWithToken<Agreement>(
      `${orgUrlKey}/agreements/get/engagement/${projectId}`,
    );

    return await res;
  } catch (e) {
    console.error("Error fetching agreement for project", e);
  }
}

export async function updateAgreement(agreement: Agreement, orgUrlKey: string) {
  try {
    const res = await putWithToken<Agreement, Agreement>(
      `${orgUrlKey}/agreements/update/${agreement.agreementId}`,
      agreement,
    );

    return await res;
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

    return res;
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
