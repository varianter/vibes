import { Agreement, FileReference } from "@/types";
import { Fragment } from "react";
import InfoPill from "@/components/Staffing/InfoPill";
import { X } from "react-feather";
import { format } from "date-fns";

export function AgreementFileTable({
  agreement,
  inEditIndex,
  i,
  onDelete,
  download,
}: {
  agreement: Agreement;
  inEditIndex: number | null;
  i: number;
  onDelete: (e: any, file: FileReference) => void;
  download: (blobName: string, filename: string) => Promise<void>;
}) {
  return (
    <table className="table-auto m-2 w-full text-sm text-left rounded text-gray-500">
      <thead className="text-xs text-gray-700 bg-primary_darker/20 font-semibold rounded w-full ">
        <tr>
          {inEditIndex === i && <th className="px-2 text-transparent">f</th>}
          <th className="pl-2 py-1 text-left font-semibold">Filnavn</th>
          <th className="pl-2 py-1 text-left font-semibold">Opplastet</th>
          <th className="pl-2 py-1 text-left font-semibold">Opplastet av</th>
        </tr>
      </thead>
      <tbody>
        {agreement.files?.map((file, ind) => (
          <Fragment key={file.blobName + ind}>
            <tr
              className={`border-b${
                inEditIndex === i
                  ? ""
                  : " hover:bg-primary_darker/10 cursor-pointer"
              }`}
              onClick={(e) => {
                e.preventDefault();
                download(file.blobName, file.fileName);
              }}
            >
              {inEditIndex === i && (
                <td className="flex justify-start px-2 pt-2 relative">
                  <button
                    type="button"
                    onClick={(e) => onDelete(e, file)}
                    className="absolute cursor-pointer h-5 pr-2  flex justify-center items-center"
                  >
                    <InfoPill
                      variant="wide"
                      text=""
                      colors={"text-primary hover:bg-primary_darker/20"}
                      icon={<X size="16" />}
                    />
                  </button>
                </td>
              )}
              <td
                className={`py-1 pl-2 border-b  items-center ${
                  inEditIndex === i ? "hover:bg-primary_darker/10" : ""
                }`}
              >
                {file.fileName}
              </td>
              <td className="py-1 px-2 border-b items-center">
                {format(file.uploadedOn, "dd.MM.yyyy")}
              </td>
              <td className="py-1 px-2 border-b items-center">
                {file.uploadedBy}
              </td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
