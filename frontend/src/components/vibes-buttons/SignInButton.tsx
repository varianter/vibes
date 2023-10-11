import { loginRequest } from "@/authConfig";
import { useMsal } from "@azure/msal-react";
import LoginIcon from "@mui/icons-material/Login";
import { IconButton } from "@mui/material";

export default function SignInButton() {
  const { instance } = useMsal();

  function handleLogin() {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.error(`loginRedirect failed: ${e}`);
    });
  }

  return (
    <div>
      <IconButton
        onClick={handleLogin}
        size="small"
        color="inherit"
        sx={{ ml: 2 }}
      >
        <LoginIcon />
      </IconButton>
    </div>
  );
}
