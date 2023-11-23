import React from "react";

export default function BaseButton({
  onClick,
  disabled,
  className,
  small,
  children,
}: {
  onClick?: () => void;
  disabled?: true;
  small?: boolean;
  className: string;
  children: React.ReactNode;
}) {
  const smallClass = small ? "p-2" : "px-3 py-2";

  return (
    <button
      disabled={disabled}
      className={`normal-semibold rounded-lg inline-flex items-center justify-center gap-2 ${smallClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
