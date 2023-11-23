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
  isIconBtn?: true;
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
  isIconBtn,
}: ActionButtonProps) {
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
  const fullWidthClass = fullWidth ? "w-full" : "";

  const paddingClass = isIconBtn ? "p-2" : "px-3 py-2";
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
