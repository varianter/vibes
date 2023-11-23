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
  small?: true;
  className: string;
  children: React.ReactNode;
}) {
  const smallClass = ` ${small ? "h-8 p-2" : "h-10 px-3 py-2"} `;

  return (
    <button
      disabled={disabled}
      className={`normal-semibold rounded-lg inline-flex items-center justify-center gap-2 ${className} ${smallClass}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
