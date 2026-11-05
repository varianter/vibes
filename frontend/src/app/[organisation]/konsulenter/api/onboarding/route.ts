import { ConsultantWriteModel } from "@/api-types";
import { postWithToken } from "@/data/apiCallsWithToken";
import { OnboardingReadModel } from "@/types";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const requestBody = (await request.json()) as ConsultantWriteModel;

  const onboarding = await postWithToken<
    OnboardingReadModel,
    ConsultantWriteModel
  >(`${orgUrlKey}/onboardings`, requestBody);

  if (!onboarding) {
    return NextResponse.json(
      { error: "Klarte ikke å starte onboarding" },
      { status: 500 },
    );
  }

  return NextResponse.json(onboarding);
}
