import { Box } from "@mui/material"
import SignInButton from "./vibes-buttons/SignInButton"

function SignInField(){
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
        >
            <SignInButton /> Sign in with Azure Entra ID
        </Box>
    )
}

export default SignInField;