import React from "react";

export default function PrimaryButton({
  children,
  disabled,
  fullWidth,
  onClick,
}: {
  children: React.ReactNode;
  fullWidth?: true;
  onClick?: () => void;
  disabled?: true;
}) {
  return (
    <button
      className={`px-3 py-2 h-10 bg-primary rounded-lg inline-flex items-center justify-center gap-2 ${
        disabled ? "bg-opacity-50" : ""
      } ${fullWidth ? "w-full" : ""}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
