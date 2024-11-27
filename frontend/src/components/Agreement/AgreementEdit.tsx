"use client";
import {
  deleteAgreementWithFiles,
  deleteFile,
  getAgreementsForCustomer,
  getAgreementsForProject,
  getPriceAdjustmentIndexes,
  saveChanges,
} from "@/actions/agreementActions";
import {
  CustomersWithProjectsReadModel,
  ProjectWithCustomerModel,
} from "@/api-types";
import { useParams } from "next/navigation";
import { useEffect, useState, Fragment } from "react";
import { EditDateInput } from "./components/EditDateInput";
import { Agreement, FileReference } from "@/types";
import { getDownloadUrl } from "@/actions/blobActions";
import { EditTextarea } from "./components/EditTextarea";
import { EditSelect } from "./components/EditSelect";
import { EditInput } from "./components/EditInput";
import { AgreementButton } from "./components/AgreementButton";
import { AgreementFileTable } from "./components/AgreementFileTable";

export function AgreementEdit({
  project,
  customer,
}: {
  project?: ProjectWithCustomerModel;
  customer?: CustomersWithProjectsReadModel;
}) {
  const params = useParams();
  const organisation = params.organisation as string;
  const [agreements, setAgreements] = useState<Agreement[] | null>(null);
  const [inEditIndex, setInEditIndex] = useState<number | null>(null);
  const [priceAdjustmentIndexes, setPriceAdjustmentIndexes] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    async function getAgreements() {
      if (organisation) {
        if (project) {
          const agree = await getAgreementsForProject(
            project.projectId,
            organisation,
          );

          await getPriceIndexes();

          if (agree && agree.length > 0) {
            setAgreements(
              agree.sort(
                (a, b) =>
                  new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
              ),
            );
            setInEditIndex(null);
          } else {
            setAgreements([]);
            setInEditIndex(null);
          }
        } else if (customer) {
          const agree = await getAgreementsForCustomer(
            customer.customerId,
            organisation,
          );

          await getPriceIndexes();

          if (agree && agree.length > 0) {
            setAgreements(
              agree.sort(
                (a, b) =>
                  new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
              ),
            );
            setInEditIndex(null);
          } else {
            setAgreements([]);
            setInEditIndex(null);
          }
        }
      }
    }
    getAgreements();
  }, [organisation, project, customer]);

  async function getPriceIndexes() {
    if (organisation) {
      const indexes = await getPriceAdjustmentIndexes(organisation);
      setPriceAdjustmentIndexes(
        indexes ? indexes.map((index) => ({ value: index, label: index })) : [],
      );
    }
  }

  async function save(formData: FormData, index: number) {
    try {
      const res = await saveChanges(
        formData,
        agreements ? agreements[index]?.files ?? [] : [],
        organisation,
      );

      if (res) {
        let agreementsCopy = [...(agreements ? agreements : [])];
        agreementsCopy[index] = res;
        setAgreements(
          agreementsCopy.sort(
            (a, b) =>
              new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
          ),
        );
        setInEditIndex(null);
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

  function handlePriceAdjustmentIndexChange(value: string, index: number) {
    setAgreements((prevAgreements) => {
      if (!Array.isArray(prevAgreements)) return prevAgreements;
      const newAgreements = [...prevAgreements];
      newAgreements[index] = {
        ...newAgreements[index],
        priceAdjustmentIndex: value,
      };
      return newAgreements;
    });
  }

  return (
    <div>
      <h1 className="pb-1">Avtaler</h1>

      {agreements &&
        agreements.map((agreement, i) => (
          <form
            action={(form) => save(form, i)}
            key={agreement.agreementId}
            className="border-primary/5 bg-primary/5 shadow-md rounded-md p-4 mr-32 mt-2"
          >
            <div className="w-full">
              <EditInput
                onClick={(e) => {
                  e.preventDefault();
                  setInEditIndex(i);
                }}
                value={agreement.name ?? null}
                label="Navn"
                name="name"
                inEdit={inEditIndex === i}
              />
            </div>

            <div className="flex flex-row flex-wrap justify-start items-start gap-16">
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
                value={
                  agreement.engagementId ? agreement.engagementId : undefined
                }
              />
              <input
                type="hidden"
                name="customerId"
                value={agreement.customerId ? agreement.customerId : undefined}
              />
              <EditDateInput
                onClick={(e) => {
                  e.preventDefault();
                  setInEditIndex(i);
                }}
                value={agreement.startDate ?? null}
                label="Startdato"
                name="startDate"
                inEdit={inEditIndex === i}
              />
              <EditDateInput
                onClick={(e) => {
                  e.preventDefault();
                  setInEditIndex(i);
                }}
                value={agreement.endDate}
                label="Utløpsdato"
                name="endDate"
                inEdit={inEditIndex === i}
                required={true}
              />
              <EditDateInput
                onClick={(e) => {
                  e.preventDefault();
                  setInEditIndex(i);
                }}
                value={agreement.nextPriceAdjustmentDate ?? null}
                label="Neste prisjustering"
                name="nextPriceAdjustmentDate"
                inEdit={inEditIndex === i}
              />
              <EditSelect
                onClick={(e) => {
                  e.preventDefault();
                  setInEditIndex(i);
                }}
                value={agreement.priceAdjustmentIndex}
                label="Prisjusteringsindeks"
                name="priceAdjustmentIndex"
                inEdit={inEditIndex === i}
                options={priceAdjustmentIndexes}
                onChange={(value) => handlePriceAdjustmentIndexChange(value, i)}
              />
            </div>
            <div className="flex flex-col pt-2 pb-2 justify-between">
              <div className="flex-1 pr-2">
                <EditTextarea
                  onClick={(e) => {
                    e.preventDefault();
                    setInEditIndex(i);
                  }}
                  value={agreement.options}
                  label="Opsjoner"
                  name="options"
                  inEdit={inEditIndex === i}
                />
              </div>

              <div className="flex-1  pr-2">
                <EditTextarea
                  onClick={(e) => {
                    e.preventDefault();
                    setInEditIndex(i);
                  }}
                  value={agreement.priceAdjustmentProcess}
                  label="Prisjusteringsprosess"
                  name="priceAdjustmentProcess"
                  inEdit={inEditIndex === i}
                />
              </div>
              <div className="flex-1 pr-2">
                <EditTextarea
                  onClick={(e) => {
                    e.preventDefault();
                    setInEditIndex(i);
                  }}
                  value={agreement.notes}
                  label="Notat"
                  name="notes"
                  inEdit={inEditIndex === i}
                />
              </div>
            </div>

            <div className="flex flex-col max-w-3xl pb-5">
              {agreement.files && agreement.files?.length > 0 ? (
                <label
                  htmlFor="files"
                  className="block px-2 font-medium text-gray-700"
                  style={{ fontSize: "1.1rem" }}
                >
                  Filer
                </label>
              ) : null}
              {inEditIndex === i ? (
                <div className="px-2">
                  <input
                    type="file"
                    name="files"
                    multiple
                    className="file-upload"
                  />
                </div>
              ) : (
                <></>
              )}
              <div className="flex flex-row w-full">
                <AgreementFileTable
                  agreement={agreement}
                  inEditIndex={inEditIndex}
                  i={i}
                  onDelete={(e: any, file: FileReference) => {
                    e.preventDefault();

                    let agreementsCopy = [...agreements];

                    agreementsCopy[i].files = agreementsCopy[i].files?.filter(
                      (f) => f.blobName !== file.blobName,
                    );
                    setAgreements(agreementsCopy);
                    deleteFile(file.blobName, agreementsCopy[i], organisation);
                  }}
                  download={download}
                />
              </div>
            </div>

            {inEditIndex === i ? (
              <div className="flex flex-row justify-between">
                <div className="flex gap-3">
                  <AgreementButton
                    buttonText="Lagre"
                    type="submit"
                    className="border-2 border-black shadow-md bg-primary text-white font-semibold py-2 px-4 rounded-md  w-fit"
                  />
                  <AgreementButton
                    type="button"
                    className="border-2 border-primary shadow-md text-primary font-semibold "
                    buttonText="Avbryt"
                    onClick={(e) => {
                      e.preventDefault();
                      setInEditIndex(null);
                    }}
                  />
                </div>
                <AgreementButton
                  type="button"
                  buttonText="Slett"
                  onClick={async (e) => {
                    var result = confirm("Er du sikker på at du vil slette?");
                    if (result) {
                      e.preventDefault();
                      let agreementsCopy = [...agreements];
                      agreementsCopy.splice(i, 1);
                      setAgreements(agreementsCopy);
                      await deleteAgreementWithFiles(agreement, organisation);
                    }
                  }}
                  className="border-holiday_darker border-2 bg-white f text-holiday_darker shadow-md "
                />
              </div>
            ) : (
              <AgreementButton
                type="button"
                buttonText="Rediger"
                onClick={(e) => {
                  e.preventDefault();
                  setInEditIndex(i);
                }}
              />
            )}
          </form>
        ))}

      {inEditIndex === null && agreements !== null && (
        <button
          onClick={() => {
            let agreementsCopy = [...agreements];
            agreementsCopy.push({
              agreementId: -1,
              name: "",
              customerId: customer ? customer.customerId : undefined,
              engagementId: project ? project.projectId : undefined,
              startDate: undefined,
              endDate: new Date(),
              nextPriceAdjustmentDate: undefined,
              priceAdjustmentIndex: "",
              notes: "",
              files: [],
            });
            setAgreements(agreementsCopy);
            setInEditIndex(agreementsCopy.length - 1);
          }}
          className="border border-primary p-2 rounded mt-4 mb-4"
        >
          Lag avtale
        </button>
      )}
    </div>
  );
}
