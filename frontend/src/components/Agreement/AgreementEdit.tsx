"use client";
import {
  deleteFile,
  getAgreementForProject,
  getPriceAdjustmentIndexes,
  saveChanges,
} from "@/actions/agreementActions";
import { ProjectWithCustomerModel } from "@/api-types";
import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { EditInput } from "./components/EditInput";
import { EditDateInput } from "./components/EditDateInput";
import { Agreement } from "@/types";
import { getDownloadUrl } from "@/actions/blobActions";
import { EditTextarea } from "./components/EditTextarea";
import { EditSelect } from "./components/EditSelect";

export function AgreementEdit({
  project,
}: {
  project: ProjectWithCustomerModel;
}) {
  const params = useParams();
  const organisation = params.organisation as string;
  const [agreement, setAgreement] = useState<Agreement | null>();
  const [inEdit, setInEdit] = useState<boolean>(false);
  const [priceAdjustmentIndexes, setPriceAdjustmentIndexes] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    async function getAgreement() {
      if (organisation && project.projectId) {
        const agree = await getAgreementForProject(
          project.projectId,
          organisation,
        );
        await getPriceIndexes();

        if (agree?.agreementId) {
          setAgreement(agree);
        } else {
          setAgreement(null);
        }
      }
    }
    getAgreement();
  }, [organisation, project.projectId]);

  async function getPriceIndexes() {
    if (organisation) {
      const indexes = await getPriceAdjustmentIndexes(organisation);
      setPriceAdjustmentIndexes(
        indexes ? indexes.map((index) => ({ value: index, label: index })) : [],
      );
    }
  }

  async function save(formData: FormData) {
    try {
      const res = await saveChanges(
        formData,
        agreement?.files ?? [],
        organisation,
      );

      if (res) {
        setAgreement(res);
        setInEdit(false);
        await getPriceIndexes();
      } else {
        console.error("Failed to save agreement");
      }
    } catch (error) {
      console.error(`Failed to save agreement: ${error}`);
    }
  }

  async function download(blobName: string, filename: string) {
    try {
      const sasUrl = await getDownloadUrl(blobName, filename);
      const link = document.createElement("a");
      link.href = sasUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  return (
    <div>
      <h1 className="pb-1">Avtale</h1>
      <hr className="pb-3" />
      {agreement && agreement !== null ? (
        <form action={save}>
          <div className="flex flex-row flex-wrap justify-between">
            {agreement.agreementId !== -1 && (
              <input
                type="hidden"
                name="agreementId"
                value={agreement.agreementId}
              />
            )}
            <input
              type="hidden"
              name="engagementId"
              value={agreement.engagementId}
            />
            <EditDateInput
              value={agreement.startDate ?? null}
              label="Startdato"
              name="startDate"
              inEdit={inEdit}
            />
            <EditDateInput
              value={agreement.endDate}
              label="Utløpsdato"
              name="endDate"
              inEdit={inEdit}
              required={true}
            />
            <EditDateInput
              value={agreement.nextPriceAdjustmentDate ?? null}
              label="Neste prisjustering"
              name="nextPriceAdjustmentDate"
              inEdit={inEdit}
            />
            <EditSelect
              value={agreement.priceAdjustmentIndex}
              label="Prisjusteringsindeks"
              name="priceAdjustmentIndex"
              inEdit={inEdit}
              options={priceAdjustmentIndexes}
              onChange={(value) =>
                setAgreement((prev) =>
                  prev ? { ...prev, priceAdjustmentIndex: value } : prev,
                )
              }
            />
          </div>
          <div className="flex flex-row pt-2 pb-2 justify-between">
            {agreement.options || inEdit ? (
              <div className="flex-1 max-w-xl pr-2">
                <EditTextarea
                  value={agreement.options}
                  label="Opsjoner"
                  name="options"
                  inEdit={inEdit}
                />
              </div>
            ) : null}
            {agreement.priceAdjustmentProcess || inEdit ? (
              <div className="flex-1 max-w-xl pr-2">
                <EditTextarea
                  value={agreement.priceAdjustmentProcess}
                  label="Prisjusteringsprosess"
                  name="priceAdjustmentProcess"
                  inEdit={inEdit}
                />
              </div>
            ) : null}
            {agreement.notes || inEdit ? (
              <div className="flex-1 max-w-xl">
                <EditTextarea
                  value={agreement.notes}
                  label="Notat"
                  name="notes"
                  inEdit={inEdit}
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col max-w-xl pb-5">
            {agreement.files && agreement.files?.length > 0 ? (
              <label
                htmlFor="files"
                className="block text-sm font-medium text-gray-700 pb-2"
              >
                Filer
              </label>
            ) : null}
            {inEdit ? (
              <>
                <input type="file" name="files" multiple />
                {agreement.files?.map((file, i) => (
                  <div key={file.blobName + i} className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        let agreementCopy = { ...agreement };
                        agreementCopy.files = agreementCopy.files?.filter(
                          (f) => f.blobName !== file.blobName,
                        );
                        setAgreement(agreementCopy);
                        deleteFile(file.blobName, agreementCopy, organisation);
                      }}
                      className=" cursor-pointer pr-2"
                    >
                      X
                    </button>
                    {file.fileName}
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col">
                {agreement.files?.map((file, i) => (
                  <button
                    key={file.blobName + i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      download(file.blobName, file.fileName);
                    }}
                    className="border-none w-fit pb-2"
                  >
                    <div>{file.fileName}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {inEdit ? (
            <button
              type="submit"
              className="border border-primary p-1 rounded w-fit"
            >
              Lagre
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setInEdit(true);
              }}
              className="border border-primary p-1 rounded w-fit"
            >
              Rediger
            </button>
          )}
        </form>
      ) : (
        agreement === null && (
          <button
            onClick={() => {
              setAgreement({
                agreementId: -1,
                engagementId: project.projectId,
                startDate: undefined,
                endDate: new Date(),
                nextPriceAdjustmentDate: undefined,
                priceAdjustmentIndex: "",
                notes: "",
                files: [],
              });
              setInEdit(true);
            }}
            className="border border-primary p-2 rounded"
          >
            Lag avtale
          </button>
        )
      )}
    </div>
  );
}
