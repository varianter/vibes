import { SumRow } from "../SumRow";

interface ForecastSumsProps {
  monthlyTotalBillable: Map<string, number>;
  monthlyTotalBillableIncome: Map<string, number>;
  monthlyTotalBillableAndOffered: Map<string, number>;
  monthlyTotalBillableAndOfferedIncome: Map<string, number>;
  monthlyInvoiceRates: Map<string, number>;
  monthlyForecastTotalHours: Map<string, number>;
  monthlyForecastIncome: Map<string, number>;
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
      const realizedHourlyRate = hours[i] === 0 ? 0 : income[i] / hours[i];

      realizedHourlyRates[i] = realizedHourlyRate;
    }

    return realizedHourlyRates;
  }

  return (
    <>
      <tbody className="border-t-[3px] border-t-primary/20">
        <tr>
          <th align="left">Ordre</th>
        </tr>
        <SumRow title="Sum timer" values={totalBillableHours} unit="t" />
        <SumRow
          title="Total inntekt"
          values={totalBillableIncome}
          unit="kr"
          minFractionDigits={0}
          maxFractionDigits={0}
        />
        <SumRow
          title="Oppnådd timepris (OT)"
          values={totalBillableRealizedHourlyRate}
          unit="kr"
          minFractionDigits={0}
          maxFractionDigits={0}
        />
      </tbody>
      <tbody className="bg-background_light_purple">
        <tr>
          <th align="left" colSpan={20}>
            Ordre, opsjon og tilbud
          </th>
        </tr>
        <SumRow
          title="Sum timer"
          values={totalBillableAndOfferedHours}
          unit="t"
        />
        <SumRow
          title="Total inntekt"
          values={totalBillableAndOfferedIncome}
          unit="kr"
          minFractionDigits={0}
          maxFractionDigits={0}
        />
        <SumRow
          title="Oppnådd timepris (OT)"
          values={totalBillableAndOfferedRealizedHourlyRate}
          unit="kr"
          minFractionDigits={0}
          maxFractionDigits={0}
        />
      </tbody>
      <tbody>
        <tr>
          <th align="left">Prognose</th>
        </tr>
        <SumRow title="Sum timer" values={monthlyForecastHours} unit="t" />
        <SumRow
          title="Total inntekt"
          values={forecastIncome}
          unit="kr"
          minFractionDigits={0}
          maxFractionDigits={0}
        />
        <SumRow
          title="Oppnådd timepris (OT)"
          values={forecastRealizedHourlyRate}
          unit="kr"
          minFractionDigits={0}
          maxFractionDigits={0}
        />
        <SumRow
          title="Faktureringsgrad"
          values={monthlyInvoiceRatesArray}
          displayPercentage={true}
        />
      </tbody>
    </>
  );
}
