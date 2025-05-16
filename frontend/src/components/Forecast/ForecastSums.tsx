import { useEffect, useState } from "react";
import { ForecastSumRow } from "./ForecastSumRow";

interface ForecastSumsProps {
  monthlyTotalBillable?: Map<number, number>;
  monthlyTotalBillableAndOffered: Map<number, number>;
  monthlyInvoiceRates?: Map<number, number>;
  monthlyForecastTotalHours: Map<number, number>;
}

export function ForecastSums({
  monthlyTotalBillable,
  monthlyTotalBillableAndOffered,
  monthlyInvoiceRates,
  monthlyForecastTotalHours,
}: ForecastSumsProps) {
  const [totalBillableHours, setTotalBillableHours] = useState<number[]>();
  const totalBillableAndOfferedHours = Array.from(
    monthlyTotalBillableAndOffered.values(),
  );
  const [monthlyInvoiceRatesArray, setMonthlyInvoiceRatesArray] =
    useState<number[]>();
  const [monthlyForecastHours, setMonthlyForecastHours] = useState<number[]>();

  useEffect(() => {
    if (monthlyTotalBillable) {
      setTotalBillableHours(Array.from(monthlyTotalBillable.values()));
    }
    if (monthlyInvoiceRates) {
      setMonthlyInvoiceRatesArray(Array.from(monthlyInvoiceRates.values()));
    }

    if (monthlyForecastTotalHours) {
      setMonthlyForecastHours(Array.from(monthlyForecastTotalHours.values()));
    }
  }, [monthlyTotalBillable, monthlyInvoiceRates]);

  return (
    <thead className="border-t-[3px] border-t-primary/20">
      {monthlyTotalBillable && (
        <ForecastSumRow title="Sum ordre" values={totalBillableHours!} />
      )}
      <ForecastSumRow
        title="Sum ordre, opsjon og tilbud"
        values={totalBillableAndOfferedHours}
      />
      {monthlyForecastHours && (
        <ForecastSumRow
          title="Prognosetall i timer"
          values={monthlyForecastHours}
        />
      )}
      {monthlyInvoiceRatesArray && (
        <ForecastSumRow
          title="Prognostisert faktureringsgrad"
          values={monthlyInvoiceRatesArray}
          displayPercentage={true}
        />
      )}
    </thead>
  );
}
