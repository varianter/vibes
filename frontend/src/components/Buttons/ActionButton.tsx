import React from "react";
import BaseButton from "./BaseButton";

export default function ActionButton({
  variant,
  iconLeft,
  iconRight,
  small,
  fullWidth,
  disabled,
  onClick,
  children,
}: {
  variant: "primary" | "secondary" | "terniary";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  small?: true;
  fullWidth?: true;
  onClick?: () => void;
  disabled?: true;
  children: React.ReactNode;
}) {
  const variantClass =
    {
      primary:
        "bg-primary text-white hover:bg-primary_darker hover:border-primary_darker",
      secondary:
        "bg-white text-primary border border-primary/50 hover:bg-primary hover:border-primary hover:bg-opacity-10",
      terniary:
        "bg-white text-primary hover:bg-primary hover:border-primary hover:bg-opacity-10",
    }[variant] ?? "Default";

  const disabledClass = disabled ? "bg-opacity-50" : "";
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <BaseButton
      className={`${variantClass} + ${disabledClass} + ${widthClass}`}
      small={small}
      onClick={onClick}
    >
      {iconLeft}
      {children}
      {iconRight}
    </BaseButton>
  );
}
