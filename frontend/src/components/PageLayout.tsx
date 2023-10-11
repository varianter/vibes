"use client";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Box } from "@mui/material";
import VibesAppBar from "./VibesNavBar";
import SignInSignOutButton from "./vibes-buttons/SignInSignOutButton";
import React from "react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <VibesAppBar />
      <Authenticated>{children}</Authenticated>

      <Unauthenticated>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          Please log in first
          <SignInSignOutButton />
        </Box>
      </Unauthenticated>
    </div>
  );
}

function Authenticated({ children }: { children: React.ReactNode }) {
  return process.env.NEXT_PUBLIC_NO_AUTH ? <>{children}</> : <AuthenticatedTemplate>{children}</AuthenticatedTemplate>;
}

function Unauthenticated({ children }: { children: React.ReactNode }) {
  return process.env.NEXT_PUBLIC_NO_AUTH ?
    <></> : <UnauthenticatedTemplate>{children}</UnauthenticatedTemplate>;
}