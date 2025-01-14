import { BookedHoursPerMonth } from "@/types";
import InfoPill from "./InfoPill";
import {
  AlertTriangle,
  Calendar,
  Coffee,
  FileText,
  Moon,
  Sun,
} from "react-feather";
import { getInfopillVariantByColumnCount } from "./helpers/utils";
import { BookedHoursPerWeek } from "@/api-types";

export default function RenderInfoPills({
  bookedHours,
  columnCount,
}: {
  bookedHours: BookedHoursPerMonth | BookedHoursPerWeek;
  columnCount: number;
}) {
  let pillNumber = 0;

  if (bookedHours) {
    if (bookedHours.bookingModel.totalOffered > 0) {
      pillNumber++;
    }
    if (bookedHours.bookingModel.totalOverbooking > 0) {
      pillNumber++;
    }
    if (bookedHours.bookingModel.totalPlannedAbsences > 0) {
      pillNumber++;
    }
    if (bookedHours.bookingModel.totalVacationHours > 0) {
      pillNumber++;
    }
    if (bookedHours.bookingModel.totalSellableTime > 0) {
      pillNumber++;
    }
  }

  return (
    <div className="flex flex-row justify-end gap-1">
      {bookedHours.bookingModel.totalOffered > 0 && (
        <InfoPill
          text={bookedHours.bookingModel.totalOffered.toLocaleString("nb-No", {
            maximumFractionDigits: 1,
            minimumFractionDigits: 0,
          })}
          colors="bg-offer text-primary_darker border-primary_darker"
          icon={<FileText size="12" />}
          variant={getInfopillVariantByColumnCount(columnCount)}
        />
      )}
      {bookedHours.bookingModel.totalSellableTime > 0 &&
        getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
          <InfoPill
            text={bookedHours.bookingModel.totalSellableTime.toLocaleString(
              "nb-No",
              {
                maximumFractionDigits: 1,
                minimumFractionDigits: 0,
              },
            )}
            colors="bg-available text-available_darker border-available_darker"
            icon={<Coffee size="12" />}
            variant={getInfopillVariantByColumnCount(columnCount)}
          />
        )}
      {bookedHours.bookingModel.totalVacationHours > 0 && (
        <InfoPill
          text={bookedHours.bookingModel.totalVacationHours.toLocaleString(
            "nb-No",
            {
              maximumFractionDigits: 1,
              minimumFractionDigits: 0,
            },
          )}
          colors="bg-vacation text-vacation_darker border-vacation_darker"
          icon={<Sun size="12" />}
          variant={getInfopillVariantByColumnCount(columnCount)}
        />
      )}
      {bookedHours.bookingModel.totalPlannedAbsences > 0 &&
        getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
          <InfoPill
            text={bookedHours.bookingModel.totalPlannedAbsences.toLocaleString(
              "nb-No",
              {
                maximumFractionDigits: 1,
                minimumFractionDigits: 0,
              },
            )}
            colors="bg-absence text-absence_darker border-absence_darker"
            icon={<Moon size="12" />}
            variant={getInfopillVariantByColumnCount(columnCount)}
          />
        )}
      {bookedHours.bookingModel.totalOverbooking > 0 && (
        <InfoPill
          text={bookedHours.bookingModel.totalOverbooking.toLocaleString(
            "nb-No",
            {
              maximumFractionDigits: 1,
              minimumFractionDigits: 0,
            },
          )}
          colors="bg-overbooked_darker text-white border-white"
          icon={<AlertTriangle size="12" />}
          variant={getInfopillVariantByColumnCount(columnCount)}
        />
      )}
      {bookedHours.bookingModel.totalNotStartedOrQuit > 0 && (
        <InfoPill
          text={bookedHours.bookingModel.totalNotStartedOrQuit.toLocaleString(
            "nb-No",
            {
              maximumFractionDigits: 1,
              minimumFractionDigits: 0,
            },
          )}
          colors="bg-absence/60 text-absence_darker border-absence_darker"
          icon={<Calendar size="12" />}
          variant={getInfopillVariantByColumnCount(columnCount)}
        />
      )}
    </div>
  );
}
