import React from "react";
import Link from "next/link";
import { IconBox } from "./IconBox";
import { ActionButtonProps, getActionButtonClassName } from "./ActionButton";

export type ActionLinkProps = Pick<
  ActionButtonProps,
  "variant" | "children" | "iconLeft" | "iconRight" | "small" | "className"
> & {
  href: string;
};

export default function ActionLink({
  variant,
  href,
  children,
  iconLeft,
  iconRight,
  small = false,
  className = "",
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      className={`normal-semibold inline-flex items-center justify-center gap-2 ${getActionButtonClassName(
        { variant, small },
      )} ${className}`}
    >
      <IconBox small={small}>{iconLeft}</IconBox>
      {children}
      <IconBox small={small}>{iconRight}</IconBox>
    </Link>
  );
}
