import React from "react";
import ActionButton, { ActionButtonProps } from "./ActionButton";
import { IconBox } from "./IconBox";

type IconActionButtonProps = ActionButtonProps & {
  icon: React.ReactNode;
  small?: true;
};

export default function IconActionButton(props: IconActionButtonProps) {
  return (
    <ActionButton {...props} isIconBtn>
      <IconBox small={props.small}>{props.icon}</IconBox>
    </ActionButton>
  );
}
