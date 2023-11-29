import React from "react";
import BaseButton from "./BaseButton";
import { IconBox } from "./IconBox";

export type ActionButtonProps = {
  variant: "primary" | "secondary" | "terniary";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  small?: boolean;
  fullWidth?: true;
  onClick?: () => void;
  disabled?: true;
  children?: React.ReactNode;
  className?: string;
  isIconBtn?: boolean;
};

export default function ActionButton({
  variant,
  iconLeft,
  iconRight,
  small,
  fullWidth,
  disabled,
  onClick,
  children,
  className = "",
  isIconBtn = true,
}: ActionButtonProps) {
  const variantClass =
    {
      primary:
        "bg-primary text-white hover:bg-primary_darker hover:border-primary_darker",
      secondary:
        "bg-white text-primary border border-primary/50 hover:bg-primary/10 hover:border-primary",
      terniary:
        "bg-white text-primary hover:bg-primary/10 hover:border-primary",
    }[variant] ?? "Default";

  const disabledClass = disabled ? "bg-opacity-50" : "";
  const fullWidthClass = fullWidth ? "w-full" : "";

  const paddingClass = isIconBtn ? "p-2" : "p-3";
  const roundedBorders = small ? "rounded h-8" : "rounded-lg h-10";

  return (
    <BaseButton
      className={`${variantClass} ${disabledClass} ${fullWidthClass} ${paddingClass} ${roundedBorders} ${className} `}
      onClick={onClick}
    >
      <IconBox small={small}>{iconLeft}</IconBox>
      {children}
      <IconBox small={small}>{iconRight}</IconBox>
    </BaseButton>
  );
}
