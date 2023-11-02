import { ReactElement } from "react";

interface HourInfoPill {
  hours: number;
  icon: ReactElement;
  colors: string;
}

export default function HourInfoPill({ hours, icon, colors }: HourInfoPill) {
  return (
    <div
      className={`flex flex-row gap-0.5 detail-pill-text p-0.5 items-center w-fit h-4 rounded-sm ${colors}`}
    >
      {icon}
      <p>{hours.toFixed(1)}</p>
    </div>
  );
}
