import React from "react";
import { ReportContent } from "@/components/staffingReports/ReportContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rapport | VIBES",
};

export default function Rapport() {
  return <ReportContent />;
}
