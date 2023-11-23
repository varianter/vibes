import React from "react";
import BaseButton from "./BaseButton";

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
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <BaseButton
      className={`${variantClass} ${disabledClass} ${widthClass} ${className}`}
      small={small}
      onClick={onClick}
    >
      <IconBox small={small}>{iconLeft}</IconBox>
      {children}
      <IconBox small={small}>{iconRight}</IconBox>
    </BaseButton>
  );
}

export function IconBox({
  children,
  small,
}: {
  children: React.ReactNode;
  small?: boolean;
}) {
  const size = small ? "h-4 w-4" : "h-6 w-6";

  if (!children) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center ${size}`}>{children}</div>
  );
}
