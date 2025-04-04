import React from "react";
import BaseButton from "./BaseButton";
import { IconBox } from "./IconBox";

export type ActionButtonProps = {
  variant: "primary" | "secondary" | "terniary";
  onClick?: () => void;
  children?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: true;
  className?: string;
  disabled?: boolean;
  iconBtn?: boolean;
  small?: boolean;
  type?: "button" | "submit" | "reset";
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
  iconBtn = false,
  small = false,
  type = "button",
}: ActionButtonProps) {
  const variantClass =
    {
      primary: `bg-primaryActionButton text-white ${
        !disabled && "hover:bg-primary_darker"
      }`,
      secondary: `bg-white text-primary border border-primary/50 ${
        !disabled && "hover:border-primary"
      }`,
      terniary: `bg-white text-primary ${
        !disabled && "hover:bg-primary/10 hover:bg-primary/10"
      }`,
    }[variant] ?? "Default";

  const disabledClass = disabled ? "bg-opacity-50 cursor-default" : "";
  const fullWidthClass = fullWidth ? "w-full" : "";
  const buttonShapeClass = iconBtn
    ? small
      ? "p-2 rounded-[4px]"
      : "px-3 py-2 rounded-lg"
    : "p-3 rounded-lg";

  return (
    <BaseButton
      className={`${variantClass} ${disabledClass} ${fullWidthClass} ${buttonShapeClass} ${className}`}
      onClick={() => {
        !disabled && onClick && onClick();
      }}
      type={type}
    >
      <IconBox small={small}>{iconLeft}</IconBox>
      {children}
      <IconBox small={small}>{iconRight}</IconBox>
    </BaseButton>
  );
}
