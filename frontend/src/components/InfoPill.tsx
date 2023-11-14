import { ReactElement } from "react";

export type InfoPillProps = {
  text: string;
  icon: ReactElement;
  colors: string;
  variant: InfoPillVariant;
};

export type InfoPillVariant = "wide" | "medium" | "narrow" | "circle" | "none";

export default function InfoPill({
  text,
  icon,
  colors,
  variant,
}: InfoPillProps) {
  return variant == "none" ? (
    <></>
  ) : (
    <>
      <div
        className={`h-2 w-2 rounded-full border mb-1 ${colors} ${
          variant != "circle" && "hidden"
        }`}
      />
      <div
        className={`flex flex-row gap-0.5 xsmall p-0.5 items-center h-4 rounded-sm ${colors} ${
          variant == "circle" && "hidden"
        }`}
      >
        {(variant == "wide" || variant == "narrow") && icon}
        {(variant == "wide" || variant == "medium") && (
          <p className="hidden lg:flex">{text}</p>
        )}
      </div>
    </>
  );
}
