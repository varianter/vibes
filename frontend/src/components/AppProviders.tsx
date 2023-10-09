"use client"
import { EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { msalInstance } from "../utils/msalInstance";
import PageLayout from "./PageLayout";
import ThemeRegistry from "./ThemeRegistry/ThemeRegistry";


msalInstance.initialize().then(() => {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
    }

    msalInstance.addEventCallback((event) => {
        // Types are outdated: Event payload is an object with account, token, etcw
        //@ts-ignore
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
            //@ts-ignore
            const account = event.payload.account;
            msalInstance.setActiveAccount(account);
        }
    });
});

const queryClient = new QueryClient()

export default function AppProviders({ children }: { children: React.ReactNode }) {

    return (<ThemeRegistry>
        <CssBaseline />
        <MsalProvider instance={msalInstance}>
            <QueryClientProvider client={queryClient}>
                <PageLayout>
                    {children}
                </PageLayout>
            </QueryClientProvider>
        </MsalProvider>
    </ThemeRegistry>)

}
