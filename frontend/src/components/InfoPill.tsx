import { ReactElement } from "react";

export type InfoPillProps = {
  text: string;
  icon: ReactElement;
  colors: string;
  variant: InfoPillVariant;
};

export type InfoPillVariant = "wide" | "medium" | "narrow" | "none";

export default function InfoPill({
  text,
  icon,
  colors,
  variant,
}: InfoPillProps) {
  return variant == "none" ? (
    <></>
  ) : (
    <div
      className={`flex flex-row gap-0.5 detail-pill-text p-0.5 items-center w-fit h-4 rounded-sm ${colors}`}
    >
      {(variant == "wide" || variant == "narrow") && icon}
      {(variant == "wide" || variant == "medium") && (
        <p className="hidden lg:flex">{text}</p>
      )}
    </div>
  );
}
