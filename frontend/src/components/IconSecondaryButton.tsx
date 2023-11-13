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
      className="p-2 text-primary rounded-lg border border-primary_l1 hover:bg-primary hover:border-primary hover:bg-opacity-10"
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
