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

export default function RenderInfoPills({
  bookedHoursPerMonth,
  columnCount,
}: {
  bookedHoursPerMonth: BookedHoursPerMonth;
  columnCount: number;
}) {
  let pillNumber = 0;

  if (bookedHoursPerMonth) {
    if (bookedHoursPerMonth.bookingModel.totalOffered > 0) {
      pillNumber++;
    }
    if (bookedHoursPerMonth.bookingModel.totalOverbooking > 0) {
      pillNumber++;
    }
    if (bookedHoursPerMonth.bookingModel.totalPlannedAbsences > 0) {
      pillNumber++;
    }
    if (bookedHoursPerMonth.bookingModel.totalVacationHours > 0) {
      pillNumber++;
    }
    if (bookedHoursPerMonth.bookingModel.totalSellableTime > 0) {
      pillNumber++;
    }
  }

  return (
    <div className="flex flex-row justify-end gap-1">
      {bookedHoursPerMonth.bookingModel.totalOffered > 0 && (
        <InfoPill
          text={bookedHoursPerMonth.bookingModel.totalOffered.toLocaleString(
            "nb-No",
            {
              maximumFractionDigits: 1,
              minimumFractionDigits: 0,
            },
          )}
          colors="bg-offer text-primary_darker border-primary_darker"
          icon={<FileText size="12" />}
          variant={getInfopillVariantByColumnCount(columnCount)}
        />
      )}
      {bookedHoursPerMonth.bookingModel.totalSellableTime > 0 &&
        getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
          <InfoPill
            text={bookedHoursPerMonth.bookingModel.totalSellableTime.toLocaleString(
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
      {bookedHoursPerMonth.bookingModel.totalVacationHours > 0 && (
        <InfoPill
          text={bookedHoursPerMonth.bookingModel.totalVacationHours.toLocaleString(
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
      {bookedHoursPerMonth.bookingModel.totalPlannedAbsences > 0 &&
        getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
          <InfoPill
            text={bookedHoursPerMonth.bookingModel.totalPlannedAbsences.toLocaleString(
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
      {bookedHoursPerMonth.bookingModel.totalOverbooking > 0 && (
        <InfoPill
          text={bookedHoursPerMonth.bookingModel.totalOverbooking.toLocaleString(
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
      {bookedHoursPerMonth.bookingModel.totalNotStartedOrQuit > 0 && (
        <InfoPill
          text={bookedHoursPerMonth.bookingModel.totalNotStartedOrQuit.toLocaleString(
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
