"use client";
import { RefObject, useEffect } from "react";

export function useOutsideClick(
  ref: RefObject<HTMLElement>,
  callback: () => void,
) {
  const htmlElement = ref?.current;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const clickIsOutside = isClickOutsideElement(e, htmlElement);

      if (clickIsOutside) {
        callback();
      }
    }
    if (htmlElement) {
      document.addEventListener("click", handleClick);

      return () => {
        document.removeEventListener("click", handleClick);
      };
    }
  }, [htmlElement, callback]);
}

export function isClickOutsideElement(e: MouseEvent, el: HTMLElement | null) {
  return el && !el.contains(e.target as Node);
}
