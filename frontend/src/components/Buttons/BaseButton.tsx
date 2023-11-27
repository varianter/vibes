import React from "react";

export default function BaseButton({
  onClick,
  disabled,
  className,
  children,
}: {
  onClick?: () => void;
  disabled?: true;
  className: string;
  children: React.ReactNode;
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
