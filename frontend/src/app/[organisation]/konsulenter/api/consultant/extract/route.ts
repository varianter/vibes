import { postFormDataWithTokenNoParse } from "@/data/apiCallsWithToken";
import { ConsultantDocumentDraft } from "@/types";
import { NextResponse } from "next/server";

const maxFileSizeInBytes = 10 * 1024 * 1024;

export async function POST(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Mangler fil" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Filen må være en PDF" },
      { status: 400 },
    );
  }
  if (file.size > maxFileSizeInBytes) {
    return NextResponse.json(
      { error: "Filen er for stor (maks 10 MB)" },
      { status: 400 },
    );
  }

  const backendFormData = new FormData();
  backendFormData.append("file", file, file.name);

  const response = await postFormDataWithTokenNoParse(
    `${orgUrlKey}/consultants/extract`,
    backendFormData,
  );

  if (!response || !response.ok) {
    // Don't log the response body - it may contain personal data from the document
    console.error(
      `Failed from ${orgUrlKey}/consultants/extract. Status: ${response?.status}`,
    );
    return NextResponse.json(
      { error: "Klarte ikke å hente verdier fra dokumentet" },
      { status: response?.status ?? 500 },
    );
  }

  const draft = (await response.json()) as ConsultantDocumentDraft;
  return NextResponse.json(draft);
}
