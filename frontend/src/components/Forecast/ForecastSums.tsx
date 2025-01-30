import { useEffect, useState } from "react";

interface StaffingSumsProps {
  weeklyTotalBillable?: Map<number, number>;
  weeklyTotalBillableAndOffered: Map<number, number>;
  weeklyInvoiceRates?: Map<number, number>;
}

export function ForecastSums({
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
    <thead className="border-t-[3px] border-t-primary/20">
      {weeklyTotalBillable && (
        <tr>
          <td colSpan={1}>
            <p className="small-medium text-black">Sum bemanning i timer</p>
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
          <p className="small-medium text-black">
            Sum bemanning og tilbud i timer
          </p>
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
      {weeklyInvoiceRatesArray && (
        <tr>
          <td colSpan={1}>
            <p className="small-medium text-black">Prognosetall i timer</p>
          </td>
          {weeklyInvoiceRatesArray.map((indexRates, index) => (
            <td key={index} className="m-2 px-2 py-1 pt-3 gap-1">
              <p className="small-medium text-right">
                {Math.round(indexRates * 100)}%
              </p>
            </td>
          ))}
        </tr>
      )}
      {weeklyInvoiceRatesArray && (
        <tr>
          <td colSpan={1}>
            <p className="small-medium text-black">Fakureringsgrad i prosent</p>
          </td>
          {weeklyInvoiceRatesArray.map((indexRates, index) => (
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
