"use client";
import { CssBaseline } from "@mui/material";
import PageLayout from "./PageLayout";
import ThemeRegistry from "./ThemeRegistry/ThemeRegistry";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeRegistry>
      <CssBaseline />
      <PageLayout>{children}</PageLayout>
    </ThemeRegistry>
  );
}
