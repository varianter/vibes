import { ReactElement } from "react";

export default function IconSecondaryButton({
  label,
  onClick,
}: {
  label: ReactElement;
  onClick?: () => void;
}) {
  return (
    <button
      className="p-2 text-primary_default rounded-lg border border-primary_l1 justify-center items-center gap-2 inline-flex hover:bg-primary_default hover:border-primary_default hover:bg-opacity-10"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
