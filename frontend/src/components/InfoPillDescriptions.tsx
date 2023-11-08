import InfoPill from "@/components/InfoPill";
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
        colors="bg-primary_l5 text-black"
        icon={<Briefcase size="12" />}
      />
      <InfoPill
        text={"Ledig tid"}
        colors="bg-free_light text-free_dark"
        icon={<Coffee size="12" />}
        variant={"wide"}
      />
      <InfoPill
        text={"Tilbud"}
        colors="bg-offer_light text-offer_dark"
        icon={<FileText size="12" />}
        variant={"wide"}
      />
      <InfoPill
        text={"Ferie"}
        colors="bg-vacation_light text-vacation_dark"
        icon={<Sun size="12" />}
        variant={"wide"}
      />
      <InfoPill
        text={"Helligdag"}
        colors="bg-holiday_light text-holiday_dark"
        icon={<Calendar size="12" />}
        variant={"wide"}
      />
      <InfoPill
        text={"Overbooket"}
        colors="bg-overbooking_dark text-overbooking_light"
        icon={<AlertTriangle size="12" />}
        variant={"wide"}
      />
      <InfoPill
        text={"Fravær"}
        colors="bg-absence_light text-absence_dark"
        icon={<Moon size="12" />}
      />
    </div>
  );
}
