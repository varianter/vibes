import { useEffect, useState } from "react";
import { SumRow } from "./SumRow";

interface StaffingSumsProps {
  weeklyTotalBillable?: Map<number, number>;
  weeklyTotalBillableAndOffered: Map<number, number>;
  weeklyInvoiceRates?: Map<number, number>;
}

export default function StaffingSums({
  weeklyTotalBillable,
  weeklyTotalBillableAndOffered,
  weeklyInvoiceRates,
}: StaffingSumsProps) {
  const [totalBillableHours, setTotalBillableHours] = useState<number[]>();
  const totalBillableAndOfferedHours = Array.from(
    weeklyTotalBillableAndOffered.values(),
  );
  const [weeklyInvoiceRatesArray, setWeeklyInvoiceRatesArray] =
    useState<number[]>();

  useEffect(() => {
    if (weeklyTotalBillable) {
      setTotalBillableHours(Array.from(weeklyTotalBillable.values()));
    }
    if (weeklyInvoiceRates) {
      setWeeklyInvoiceRatesArray(Array.from(weeklyInvoiceRates.values()));
    }
  }, [weeklyTotalBillable, weeklyInvoiceRates]);

  return (
    <thead>
      {weeklyTotalBillable && (
        <SumRow title="Sum ordre" values={totalBillableHours!} colSpan={2} />
      )}
      <SumRow
        title="Sum ordre, opsjon og tilbud"
        values={totalBillableAndOfferedHours}
        colSpan={2}
      />
      {weeklyInvoiceRatesArray && (
        <SumRow
          title="Faktureringsgrad"
          values={weeklyInvoiceRatesArray}
          colSpan={2}
          displayPercentage={true}
        />
      )}
    </thead>
  );
}
