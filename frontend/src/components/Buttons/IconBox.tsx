import React from "react";

export function IconBox({
  children,
  small,
}: {
  children: React.ReactNode;
  small?: boolean;
}) {
  const size = small ? "h-4 w-4" : "h-6 w-6";

  if (!children) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center ${size}`}>{children}</div>
  );
}
