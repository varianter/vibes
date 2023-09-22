import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { Box, Container, Grid } from "@mui/material";
import React from "react";
import VibesAppBar from "./VibesNavBar";
import SignInSignOutButton from "./vibes-buttons/SignInSignOutButton";

export const PageLayout = (props: React.PropsWithChildren) => {
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
                        {props.children}
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