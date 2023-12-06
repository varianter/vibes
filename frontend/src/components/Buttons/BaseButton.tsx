import React from "react";

export default function BaseButton({
  onClick,
  className,
  children,
  disabled = false,
  type = "button",
}: {
  onClick?: () => void;
  className: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      disabled={disabled}
      className={`normal-semibold inline-flex items-center justify-center gap-2 ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
