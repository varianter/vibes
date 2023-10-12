import VibesAppBar from "./VibesNavBar";
import React from "react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <VibesAppBar />
      {children}
    </div>
  );
}