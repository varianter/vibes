import React from "react";
import { X } from "react-feather";

export function RightCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="p-2 flex justify-center items-center rounded-lg hover:bg-primary/5 "
      onClick={onClick}
    >
      <X className="h-6 w-6 text-primary" />
    </button>
  );
}

export default RightCloseButton;
