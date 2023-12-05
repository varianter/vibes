import InfoPill from "@/components/Staffing/InfoPill";
import {
  AlertTriangle,
  Briefcase,
  Calendar,
  Coffee,
  FileText,
  Moon,
  Sun,
} from "react-feather";

export default function InfoPillDescriptions() {
  return (
    <div className="flex flex-row gap-2">
      <InfoPill
        text={"Booking"}
        colors="bg-primary/[3%] text-black"
        icon={<Briefcase size="12" />}
        variant={"wide"}
        isInfoPillDesc={true}
      />
      <InfoPill
        text={"Ledig tid"}
        colors="bg-available text-available_darker"
        icon={<Coffee size="12" />}
        variant={"wide"}
        isInfoPillDesc={true}
      />
      <InfoPill
        text={"Tilbud"}
        colors="bg-offer text-primary_darker"
        icon={<FileText size="12" />}
        variant={"wide"}
        isInfoPillDesc={true}
      />
      <InfoPill
        text={"Ferie"}
        colors="bg-vacation text-vacation_darker"
        icon={<Sun size="12" />}
        variant={"wide"}
        isInfoPillDesc={true}
      />
      <InfoPill
        text={"Helligdag"}
        colors="bg-holiday text-holiday_darker"
        icon={<Calendar size="12" />}
        variant={"wide"}
        isInfoPillDesc={true}
      />
      <InfoPill
        text={"Overbooket"}
        colors="bg-overbooked_darker text-white"
        icon={<AlertTriangle size="12" />}
        variant={"wide"}
        isInfoPillDesc={true}
      />
      <InfoPill
        text={"Fravær"}
        colors="bg-absence text-absence_darker"
        icon={<Moon size="12" />}
        variant={"wide"}
        isInfoPillDesc={true}
      />
    </div>
  );
}
