import { ReactElement } from "react";

export default function IconSecondaryButton({
  icon,
  onClick,
}: {
  icon: ReactElement;
  onClick?: () => void;
}) {
  return (
    <button
      className="p-2 text-primary_default rounded-lg border border-primary_l1 hover:bg-primary_default hover:border-primary_default hover:bg-opacity-10"
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
