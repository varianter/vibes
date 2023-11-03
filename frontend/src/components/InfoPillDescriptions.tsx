import InfoPill from "@/components/InfoPill";
import { AlertTriangle, Calendar, Coffee, FileText, Sun } from "react-feather";

export default function InfoPillDescriptions() {
  return (
    <div className="flex flex-row gap-2">
      <InfoPill
        text={"Ledig tid"}
        colors="bg-free_light text-free_dark"
        icon={<Coffee size="12" />}
      />
      <InfoPill
        text={"Tilbud"}
        colors="bg-offer_light text-offer_dark"
        icon={<FileText size="12" />}
      />
      <InfoPill
        text={"Ferie"}
        colors="bg-vacation_light text-vacation_dark"
        icon={<Sun size="12" />}
      />
      <InfoPill
        text={"Helligdag"}
        colors="bg-holiday_light text-holiday_dark"
        icon={<Calendar size="12" />}
      />
      <InfoPill
        text={"Overbooket"}
        colors="bg-overbooking_dark text-overbooking_light"
        icon={<AlertTriangle size="12" />}
      />
    </div>
  );
}
