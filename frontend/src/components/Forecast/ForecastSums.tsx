import { SumRow } from "../SumRow";

interface ForecastSumsProps {
  monthlyTotalBillable: Map<number, number>;
  monthlyTotalBillableIncome: Map<number, number>;
  monthlyTotalBillableAndOffered: Map<number, number>;
  monthlyTotalBillableAndOfferedIncome: Map<number, number>;
  monthlyInvoiceRates: Map<number, number>;
  monthlyForecastTotalHours: Map<number, number>;
  monthlyForecastIncome: Map<number, number>;
}

export function ForecastSums({
  monthlyTotalBillable,
  monthlyTotalBillableIncome,
  monthlyTotalBillableAndOffered,
  monthlyTotalBillableAndOfferedIncome,
  monthlyInvoiceRates,
  monthlyForecastTotalHours,
  monthlyForecastIncome,
}: ForecastSumsProps) {
  // Billable
  const totalBillableHours = Array.from(monthlyTotalBillable.values());
  const totalBillableIncome = Array.from(monthlyTotalBillableIncome.values());
  const totalBillableRealizedHourlyRate = realizedHourlyRateArray(
    totalBillableHours,
    totalBillableIncome,
  );

  // Billable and offered
  const totalBillableAndOfferedHours = Array.from(
    monthlyTotalBillableAndOffered.values(),
  );
  const totalBillableAndOfferedIncome = Array.from(
    monthlyTotalBillableAndOfferedIncome.values(),
  );
  const totalBillableAndOfferedRealizedHourlyRate = realizedHourlyRateArray(
    totalBillableAndOfferedHours,
    totalBillableAndOfferedIncome,
  );

  // Forecast
  const monthlyForecastHours = Array.from(monthlyForecastTotalHours.values());
  const forecastIncome = Array.from(monthlyForecastIncome.values());
  const forecastRealizedHourlyRate = realizedHourlyRateArray(
    monthlyForecastHours,
    forecastIncome,
  );
  const monthlyInvoiceRatesArray = Array.from(monthlyInvoiceRates.values());

  function realizedHourlyRateArray(
    hours: number[],
    income: number[],
  ): number[] {
    const count = [hours.length, income.length].sort()[0];

    const realizedHourlyRates = Array<number>(count);

    for (let i = 0; i < count; i++) {
      const realizedHourlyRate =
        hours[i] === 0 ? 0 : Math.floor(income[i] / hours[i]);

      realizedHourlyRates[i] = realizedHourlyRate;
    }

    return realizedHourlyRates;
  }

  return (
    <thead className="border-t-[3px] border-t-primary/20">
      <tr>
        <th align="left">Ordre</th>
      </tr>
      <SumRow title="Sum timer" values={totalBillableHours} />
      <SumRow
        title="Total inntekt"
        values={totalBillableIncome}
        minFractionDigits={0}
        maxFractionDigits={0}
      />
      <SumRow
        title="Oppnådd timepris (OT)"
        values={totalBillableRealizedHourlyRate}
        minFractionDigits={0}
        maxFractionDigits={0}
      />
      <tr>
        <th align="left">Ordre, opsjon og tilbud</th>
      </tr>
      <SumRow title="Sum timer" values={totalBillableAndOfferedHours} />
      <SumRow
        title="Total inntekt"
        values={totalBillableAndOfferedIncome}
        minFractionDigits={0}
        maxFractionDigits={0}
      />
      <SumRow
        title="Oppnådd timepris (OT)"
        values={totalBillableAndOfferedRealizedHourlyRate}
        minFractionDigits={0}
        maxFractionDigits={0}
      />
      <tr>
        <th align="left">Prognose</th>
      </tr>
      <SumRow title="Sum timer" values={monthlyForecastHours} />
      <SumRow
        title="Total inntekt"
        values={forecastIncome}
        minFractionDigits={0}
        maxFractionDigits={0}
      />
      <SumRow
        title="Oppnådd timepris (OT)"
        values={forecastRealizedHourlyRate}
        minFractionDigits={0}
        maxFractionDigits={0}
      />
      <SumRow
        title="Faktureringsgrad"
        values={monthlyInvoiceRatesArray}
        displayPercentage={true}
      />
    </thead>
  );
}
