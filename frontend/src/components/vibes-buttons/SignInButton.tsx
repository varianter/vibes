"use client"

import LoginIcon from "@mui/icons-material/Login";
import { IconButton } from "@mui/material";
import { signIn } from "next-auth/react";


const SignInButton = () => {
    return (
        <div>
            <IconButton
                onClick={() => signIn("azure-ad")}
                size="small"
                color="inherit"
                sx={{ ml: 2 }}
            >
                <LoginIcon />
            </IconButton>
        </div>
    )
};

export default SignInButton;