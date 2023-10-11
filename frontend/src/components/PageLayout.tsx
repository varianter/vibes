"use client";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Box, Container, Grid } from "@mui/material";
import VibesAppBar from "./VibesNavBar";
import SignInSignOutButton from "./vibes-buttons/SignInSignOutButton";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <VibesAppBar />
      <AuthenticatedTemplate>{children}</AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          Please log in first
          <SignInSignOutButton />
        </Box>
      </UnauthenticatedTemplate>
    </div>
  );
}
