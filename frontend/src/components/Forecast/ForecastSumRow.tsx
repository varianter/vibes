export function ForecastSumRow({
  title,
  values,
  minFractionDigits = 1,
  maxFractionDigits = 1,
  displayPercentage,
}: {
  title: string;
  values: number[];
  minFractionDigits?: number;
  maxFractionDigits?: number;
  displayPercentage?: boolean;
}) {
  function displayValue(value: number) {
    if (displayPercentage) return `${Math.round(value * 100)} %`;

    return value.toLocaleString("nb-No", {
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: maxFractionDigits,
    });
  }

  return (
    <tr>
      <td colSpan={1}>
        <p className="small-medium text-black">{title}</p>
      </td>
      {values?.map((value, index) => (
        <td key={index} className="m-2 px-2 py-1 pt-3 gap-1">
          <p className="small-medium text-right">{displayValue(value)}</p>
        </td>
      ))}
    </tr>
  );
}
