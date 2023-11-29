interface StaffingSumsProps {
  weeklyTotalBillable: Map<number, number>;
  weeklyTotalBillableAndOffered: Map<number, number>;
  weeklyInvoiceRates: Map<number, number>;
}

export default function StaffingSums({
  weeklyTotalBillable,
  weeklyTotalBillableAndOffered,
  weeklyInvoiceRates,
}: StaffingSumsProps) {
  const totalBillableHours = Array.from(weeklyTotalBillable.values());
  const totalBillableAndOfferedHours = Array.from(
    weeklyTotalBillableAndOffered.values(),
  );
  const weeklyInvoiceRatesArray = Array.from(weeklyInvoiceRates.values());

  return (
    <thead>
      <tr>
        <td colSpan={2}>
          <p className="small-medium text-black">Sum bemanning</p>
        </td>
        {totalBillableHours.map((totalBillableHour, index) => (
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
      <tr>
        <td colSpan={2}>
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
      <tr>
        <td colSpan={2}>
          <p className="small-medium text-black">Fakureringsgrad</p>
        </td>
        {weeklyInvoiceRatesArray.map((indexRates, index) => (
          <td key={index} className="m-2 px-2 py-1 pt-3 gap-1">
            <p className="small-medium text-right">
              {Math.floor(indexRates * 100).toLocaleString("nb-No", {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1,
              })}
              %
            </p>
          </td>
        ))}
      </tr>
    </thead>
  );
}
