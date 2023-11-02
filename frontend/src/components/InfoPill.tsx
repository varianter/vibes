import { ReactElement } from "react";

interface InfoPill {
  text: string;
  icon: ReactElement;
  colors: string;
}

export default function InfoPill({ text, icon, colors }: InfoPill) {
  return (
    <div
      className={`flex flex-row gap-0.5 detail-pill-text p-0.5 items-center w-fit h-4 rounded-sm ${colors}`}
    >
      {icon}
      <p>{text}</p>
    </div>
  );
}
