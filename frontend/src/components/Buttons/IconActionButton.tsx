import React from "react";
import ActionButton, { ActionButtonProps, IconBox } from "./ActionButton";

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
