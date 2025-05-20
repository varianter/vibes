import { SumRow } from "../../SumRow";
import "./styles.css";

export function ForecastSumSection({
  title,
  hourMap,
  incomeMap,
  invoiceRateMap,
}: {
  title: string;
  hourMap: Map<number, number>;
  incomeMap: Map<number, number>;
  invoiceRateMap?: Map<number, number>;
}) {
  const hours = Array.from(hourMap.values());
  const income = Array.from(incomeMap.values());
  const realizedHourlyRate = realizedHourlyRateArray(hours, income);

  const invoiceRates = invoiceRateMap && Array.from(invoiceRateMap.values());

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
    <tbody className="forecast-sum-section">
      <tr>
        <th align="left" colSpan={30}>
          {title}
        </th>
      </tr>
      <SumRow title="Sum timer" values={hours} unit="t" />
      <SumRow
        title="Total inntekt"
        values={income}
        unit="kr"
        minFractionDigits={0}
        maxFractionDigits={0}
      />
      <SumRow
        title="Oppnådd timepris (OT)"
        values={realizedHourlyRate}
        unit="kr"
        minFractionDigits={0}
        maxFractionDigits={0}
      />
      {invoiceRates && (
        <SumRow
          title="Faktureringsgrad"
          values={invoiceRates}
          displayPercentage={true}
        />
      )}
    </tbody>
  );
}
