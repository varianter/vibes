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
  if (!el) {
    return false;
  }

  const elDimensions = el.getBoundingClientRect();
  return (
    e.clientX < elDimensions.left ||
    e.clientX > elDimensions.right ||
    e.clientY < elDimensions.top ||
    e.clientY > elDimensions.bottom
  );
}
