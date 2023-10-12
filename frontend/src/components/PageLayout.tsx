import { Box, Grid } from "@mui/material";
import VibesAppBar from "./VibesNavBar";
import SignInField from "./SignInField";
import { useAuth } from "@/hooks/useAuth";

export default function PageLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();

    return (
        <Grid container justifyContent="center">
            <VibesAppBar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                }}
            >
                {isAuthenticated ?
                    children :
                    <SignInField />
                }
            </Box>
        </Grid>
    );
}