import { useState } from "react";

export default function ForecastCell({
  forecastValue,
}: {
  forecastValue: number;
}) {
  const [forecast, setForecast] = useState(forecastValue);
  const [isInputFocused, setIsInputFocused] = useState(false);
  return (
    <>
      <input
        type="number"
        min="0"
        step={10}
        value={`${forecast}`}
        draggable={true}
        disabled={forecastValue == 100}
        onChange={(e) => setForecast(Number(e.target.value))}
        onFocus={(e) => {
          e.target.select();
          setIsInputFocused(true);
        }}
        onBlur={() => {
          setIsInputFocused(false);
        }}
        className={`${
          forecastValue == forecast ? "small" : "small-medium"
        } rounded w-full bg-transparent focus:outline-none min-w-[24px] text-right`}
      />
      <span
        className={`${forecastValue == forecast ? "small" : "small-medium"}`}
      >
        %
      </span>
    </>
  );
}
