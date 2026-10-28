import { ConsultantDocumentDraft } from "@/types";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Upload, X } from "react-feather";

export default function UploadConsultantDocumentModal({
  onClose,
}: {
  onClose: (draft: ConsultantDocumentDraft | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { organisation } = useParams();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!file) {
      setError("Velg en PDF først");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `/${organisation}/konsulenter/api/consultant/extract`,
        {
          method: "POST",
          body: formData,
        },
      );
      const res = await response.json();

      if (!response.ok) {
        setError(res.error ?? "Noe gikk galt");
        return;
      }

      onClose(res as ConsultantDocumentDraft);
    } catch {
      setError("Noe gikk galt");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 z-10 flex flex-col gap-5 w-96 rounded-md"
      >
        <button
          type="button"
          onClick={() => onClose(null)}
          className="w-fit self-end"
          disabled={isLoading}
        >
          <X size={24} />
        </button>
        <div className="flex flex-col gap-2">
          <label htmlFor="document" className="text-sm">
            Last opp ansettelsestilbud (PDF)
          </label>
          <input
            className="w-full text-sm text-primary file:mr-3 file:py-1.5 file:px-3 file:border file:border-primary_50 file:rounded-md file:bg-white file:text-primary"
            type="file"
            id="document"
            accept="application/pdf"
            disabled={isLoading}
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setError(null);
            }}
          />
          <p className="xsmall text-black/75">
            Verdiene hentes ut automatisk (beta). Du kan kontrollere og endre
            dem før konsulenten lagres.
          </p>
        </div>
        {error && <p className="small text-error">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || !file}
          className="flex h-10 flex-row gap-2 justify-center items-center bg-primary text-white py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary_50 disabled:opacity-50"
        >
          <Upload size="20" />
          {isLoading ? "Leser dokumentet …" : "Hent verdier"}
        </button>
      </form>
    </div>
  );
}
