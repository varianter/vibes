import { loginRequest } from "@/authConfig";
import { useMsal } from "@azure/msal-react";
import { Login } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch((e) => { console.error(`loginRedirect failed: ${e}`) })
    };

    return (
        <div>
            <IconButton
                onClick={handleLogin}
                size="small"
                color="inherit"
                sx={{ ml: 2 }}
            >
                <Login />
            </IconButton>
        </div>
    )
};

export default SignInButton;