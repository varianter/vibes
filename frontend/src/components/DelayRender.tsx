"use client";

import { PropsWithChildren, useEffect, useState } from "react";

type Props = {
  ms: number;
};

export function DelayRender({ ms, children }: PropsWithChildren<Props>) {
  const [render, setRender] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setRender(true), ms);
    return () => clearTimeout(timeout);
  }, [ms]);

  return render ? children : null;
}
