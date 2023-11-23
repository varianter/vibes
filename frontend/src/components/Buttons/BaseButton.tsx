import React from "react";

export default function BaseButton({
  onClick,
  disabled,
  className,
  small,
  children,
}: {
  onClick?: () => void;
  disabled?: true;
  small?: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      className={`normal-semibold rounded-lg inline-flex items-center justify-center gap-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
