import { SumRow } from "../SumRow";

interface ForecastSumsProps {
  monthlyTotalBillable: Map<number, number>;
  monthlyTotalBillableAndOffered: Map<number, number>;
  monthlyInvoiceRates: Map<number, number>;
  monthlyForecastTotalHours: Map<number, number>;
}

export function ForecastSums({
  monthlyTotalBillable,
  monthlyTotalBillableAndOffered,
  monthlyInvoiceRates,
  monthlyForecastTotalHours,
}: ForecastSumsProps) {
  const totalBillableHours = Array.from(monthlyTotalBillable.values());
  const totalBillableAndOfferedHours = Array.from(
    monthlyTotalBillableAndOffered.values(),
  );
  const monthlyForecastHours = Array.from(monthlyForecastTotalHours.values());
  const monthlyInvoiceRatesArray = Array.from(monthlyInvoiceRates.values());

  return (
    <thead className="border-t-[3px] border-t-primary/20">
      <SumRow title="Sum ordre" values={totalBillableHours} />
      <SumRow
        title="Sum ordre, opsjon og tilbud"
        values={totalBillableAndOfferedHours}
      />
      <SumRow title="Prognosetall i timer" values={monthlyForecastHours} />
      <SumRow
        title="Prognostisert faktureringsgrad"
        values={monthlyInvoiceRatesArray}
        displayPercentage={true}
      />
    </thead>
  );
}
