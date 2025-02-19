import { Metadata } from "next";
import { CustomerPageContent } from "@/app/[organisation]/kunder/[customer]/content";

export const metadata: Metadata = {
  title: "Kunder | VIBES",
};

export default async function Kunde({
  params,
}: {
  params: { organisation: string; customer: string };
}) {
  return (
    <CustomerPageContent
      customer={params.customer}
      organization={params.organisation}
    />
  );
}
