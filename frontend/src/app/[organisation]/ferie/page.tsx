import { Metadata } from "next";
import { VacationPageContent } from "@/app/[organisation]/ferie/content";

export const metadata: Metadata = {
  title: "Ferie | VIBES",
};

export default async function Ferie() {
  return <VacationPageContent />;
}
