import React from "react";

export default function BaseButton({
  onClick,
  className,
  children,
  disabled = false,
}: {
  onClick: () => void;
  className: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={`normal-semibold inline-flex items-center justify-center gap-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
