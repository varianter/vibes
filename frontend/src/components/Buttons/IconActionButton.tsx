import React from "react";
import ActionButton, { ActionButtonProps } from "./ActionButton";

type IconActionButtonProps = ActionButtonProps & {
  icon: React.ReactNode;
};

export default function IconActionButton(props: IconActionButtonProps) {
  return <ActionButton {...props}>{props.icon}</ActionButton>;
}
