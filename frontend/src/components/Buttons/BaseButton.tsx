import React from "react";

interface ButtonProps {
  onClick?: () => void;
  className: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function BaseButton({
  onClick,
  className,
  children,
  disabled = false,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`normal-semibold inline-flex items-center justify-center gap-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
