import { useEffect, useState } from "react";

interface ForecastSumsProps {
  monthlyTotalBillable?: Map<number, number>;
  monthlyTotalBillableAndOffered: Map<number, number>;
  monthlyInvoiceRates?: Map<number, number>;
  monthlyForecastSums: Map<number, number>;
  hoursInMonth: Map<number, number>;
}

export function ForecastSums({
  monthlyTotalBillable,
  monthlyTotalBillableAndOffered,
  monthlyInvoiceRates,
  monthlyForecastSums,
  hoursInMonth,
}: ForecastSumsProps) {
  const [totalBillableHours, setTotalBillableHours] = useState<number[]>();
  const totalBillableAndOfferedHours = Array.from(
    monthlyTotalBillableAndOffered.values(),
  );
  const [monthlyInvoiceRatesArray, setMonthlyInvoiceRatesArray] =
    useState<number[]>();
  const [monthlyForecastTotal, setMonthlyForecastTotal] = useState<number[]>();

  useEffect(() => {
    if (monthlyTotalBillable) {
      setTotalBillableHours(Array.from(monthlyTotalBillable.values()));
    }
    if (monthlyInvoiceRates) {
      setMonthlyInvoiceRatesArray(Array.from(monthlyInvoiceRates.values()));
    }
    if (monthlyForecastSums) {
      setMonthlyForecastTotal(Array.from(monthlyForecastSums.values()));
    }
  }, [monthlyTotalBillable, monthlyInvoiceRates]);

  return (
    <thead className="border-t-[3px] border-t-primary/20">
      {monthlyTotalBillable && (
        <tr>
          <td colSpan={1}>
            <p className="small-medium text-black">Sum bemanning</p>
          </td>
          {totalBillableHours?.map((totalBillableHour, index) => (
            <td key={index} className="m-2 px-2 py-1 pt-3 gap-1">
              <p className="small-medium text-right">
                {totalBillableHour.toLocaleString("nb-No", {
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 1,
                })}
              </p>
            </td>
          ))}
        </tr>
      )}
      <tr>
        <td colSpan={1}>
          <p className="small-medium text-black">Sum bemanning og tilbud</p>
        </td>
        {totalBillableAndOfferedHours.map(
          (totalBillableAndOfferedHour, index) => (
            <td key={index} className="m-2 px-2 py-1 pt-3 gap-1">
              <p className="small-medium text-right">
                {totalBillableAndOfferedHour.toLocaleString("nb-No", {
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 1,
                })}
              </p>
            </td>
          ),
        )}
      </tr>
      {/* {monthlyForecastTotal && (
        <tr>
          <td colSpan={1}>
            <p className="small-medium text-black">Prognosetall i timer</p>
          </td>
          {monthlyForecastTotal.map((indexRates, index) => (
            <td key={index} className="m-2 px-2 py-1 pt-3 gap-1">
              <p className="small-medium text-right">
                {Math.round((indexRates / 100) * hoursInMonth.get(index)!)} t
              </p>
            </td>
          ))}
        </tr>
      )} */}
      {monthlyInvoiceRatesArray && (
        <tr>
          <td colSpan={1}>
            <p className="small-medium text-black">Fakureringsgrad</p>
          </td>
          {monthlyInvoiceRatesArray.map((indexRates, index) => (
            <td key={index} className="m-2 px-2 py-1 pt-3 gap-1">
              <p className="small-medium text-right">
                {Math.round(indexRates * 100)}%
              </p>
            </td>
          ))}
        </tr>
      )}
    </thead>
  );
}
