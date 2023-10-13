"use client";
import { CircularProgress } from "@mui/material";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
import { useSession } from "next-auth/react";

function SignInSignOutButton() {
  const { status } = useSession();

  if (status === "authenticated") {
    return <SignOutButton />;
  } else if (status === "unauthenticated") {
    return <SignInButton />;
  } else {
    return <CircularProgress />;
  }
}

export default SignInSignOutButton;
