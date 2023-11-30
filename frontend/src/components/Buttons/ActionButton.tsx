import React from "react";
import BaseButton from "./BaseButton";
import { IconBox } from "./IconBox";

export type ActionButtonProps = {
  variant: "primary" | "secondary" | "terniary";
  onClick: () => void;
  children?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: true;
  className?: string;
  disabled?: boolean;
  isIconBtn?: boolean;
  small?: boolean;
};

export default function ActionButton({
  variant,
  onClick,
  children,
  iconLeft,
  iconRight,
  fullWidth,
  className = "",
  disabled = false,
  isIconBtn = false,
  small = false,
}: ActionButtonProps) {
  const variantClass =
    {
      primary: "bg-primary text-white hover:bg-primary_darker",
      secondary:
        "bg-white text-primary border border-primary/50 hover:bg-primary/10 hover:border-primary",
      terniary: "bg-white text-primary hover:bg-primary/10",
    }[variant] ?? "Default";

  const disabledClass = disabled ? "bg-opacity-50" : "";
  const fullWidthClass = fullWidth ? "w-full" : "";
  const buttonShapeClass = isIconBtn
    ? small
      ? "p-2 rounded-[4px]"
      : "px-3 py-2 rounded-lg"
    : "p-3 rounded-lg";

  return (
    <BaseButton
      className={` ${variantClass} ${disabledClass} ${fullWidthClass} ${buttonShapeClass} ${className}`}
      onClick={onClick}
    >
      <IconBox isSmallIcon={small}>{iconLeft}</IconBox>
      {children}
      <IconBox isSmallIcon={small}>{iconRight}</IconBox>
    </BaseButton>
  );
}
