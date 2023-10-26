"use client";
import { useState, useEffect } from "react";

interface ScreenSize {
  width: number;
  height: number;
}

function windowIsUp() {
  return typeof window !== "undefined";
}

function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: (windowIsUp() && window.innerWidth) || 0,
    height: (windowIsUp() && window.innerHeight) || 0,
  });

  useEffect(() => {
    function handleResize() {
      setScreenSize({
        width: window.innerWidth ?? 0,
        height: window.innerHeight ?? 0,
      });
    }

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
}

export default useScreenSize;
