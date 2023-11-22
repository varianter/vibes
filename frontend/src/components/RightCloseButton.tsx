import React from "react";
import { X } from "react-feather";

export function RightCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative h-8">
      <div className="w-10 h-10 p-2 rounded-lg justify-center items-center gap-2 inline-flex">
        <button
          className="absolute top-0 right-0 w-8 h-8 flex justify-center items-center rounded bg-primary/0 hover:bg-primary/5"
          onClick={onClick}
        >
          <X className="h-6 w-6 text-primary" />
        </button>
      </div>
    </div>
  );
}

export default RightCloseButton;
