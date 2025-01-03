import { useState } from "react";

//        __     __  __ _       __
//       / /__  / /_/ /| |     / /___ __   _____
//  __  / / _ \/ __/ __/ | /| / / __ `/ | / / _ \
// / /_/ /  __/ /_/ /_ | |/ |/ / /_/ /| |/ /  __/
// \____/\___/\__/\__/ |__/|__/\__,_/ |___/\___/

// https://jettwave.com

export function ToggleSwitch({
  value,
  onChange,
}: {
  value: boolean | string;
  onChange: () => any;
}) {
  return (
    <div
      onClick={onChange}
      className={
        !value
          ? "relative h-[22px] w-[40px] cursor-pointer rounded-full bg-black/30 duration-150 "
          : "relative h-[22px] w-[40px] cursor-pointer rounded-full bg-black duration-150"
      }
    >
      <div
        className={
          !value
            ? "absolute inset-0 flex translate-x-[0] p-[1px] duration-150"
            : "absolute inset-0 flex translate-x-[46%] p-[1px] duration-150"
        }
      >
        <div className="aspect-square h-full rounded-full bg-white" />
      </div>
    </div>
  );
}
