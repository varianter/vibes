import React from "react";
import { IconBox } from "./IconBox";
import BaseButton from "./BaseButton";

export type IconActionButtonProps = {
  variant: "primary" | "secondary" | "terniary";
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  isSmallBtn?: boolean;
};

export default function IconActionButton({
  variant,
  icon,
  onClick,
  className = "",
  disabled = false,
  isSmallBtn = false,
}: IconActionButtonProps) {
  const variantClass =
    {
      primary: "bg-primary text-white hover:bg-primary_darker",
      secondary:
        "bg-white text-primary border border-primary/50 hover:bg-primary/10 hover:border-primary",
      terniary: "bg-white text-primary hover:bg-primary/10 ",
    }[variant] ?? "Default";
  const disabledClass = disabled ? "bg-opacity-50" : "";

  return (
    <BaseButton
      className={`p-2 rounded-lg ${variantClass} ${disabledClass} ${className} `}
      onClick={onClick}
    >
      <IconBox isSmallIcon={isSmallBtn}>{icon}</IconBox>
    </BaseButton>
  );
}
