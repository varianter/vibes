"use client";

import { BarChart2 } from "react-feather";
import ForecastDepartmentReportModal from "@/components/rapport/ForecastDepartmentReportModal";

interface ReportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}

function ReportCard({ icon, title, description, action }: ReportCardProps) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-primary/10 bg-white shadow-sm w-[280px]">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <h3 className="normal-medium text-black">{title}</h3>
      </div>
      <p className="small text-black/60">{description}</p>
      <div className="pt-1">{action}</div>
    </div>
  );
}

export function ReportContent() {
  return (
    <div className="main p-4 pt-5 w-full flex flex-col gap-8">
      <h1>Rapporter</h1>
      <div className="flex flex-row flex-wrap gap-4">
        <ReportCard
          icon={<BarChart2 size={20} />}
          title="Ordre per avdeling"
          description="Ordretimer summert per avdeling og måned for en valgfri periode. Eksporteres som CSV."
          action={<ForecastDepartmentReportModal />}
        />
      </div>
    </div>
  );
}
