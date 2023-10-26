"use client";
import { useState, useEffect } from "react";

interface ScreenSize {
  width: number;
  height: number;
}

function useScreenSize(): ScreenSize {
  const isClient = typeof window === "object";

  const [screenSize, setScreenSize] = useState<ScreenSize>(() => ({
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
  }));

  useEffect(() => {
    if (!isClient) {
      return;
    }

    function handleResize() {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isClient]);

  return screenSize;
}

export default useScreenSize;
