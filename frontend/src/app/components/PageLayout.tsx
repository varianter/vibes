import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { Box, Container, Grid } from "@mui/material";
import VibesAppBar from "./VibesNavBar";
import SignInSignOutButton from "./vibes-buttons/SignInSignOutButton";

export default function PageLayout({ children }: { children: React.ReactNode }) {
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
                <AuthenticatedTemplate>
                    <Container>
                        {children}
                    </Container>
                </AuthenticatedTemplate>

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
            </Box>
        </Grid>
    );
}