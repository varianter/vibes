import React from "react";
import { X } from "react-feather";
import IconActionButton from "./Buttons/IconActionButton";

export function RightCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <IconActionButton onClick={onClick} variant={"terniary"} icon={<X />} />
  );
}

export default RightCloseButton;
