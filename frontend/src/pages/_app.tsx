// From Material-ui nextjs sample https://github.com/mui-org/material-ui/tree/master/examples/nextjs

import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';


import { EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

import { PageLayout } from '@/app/components/PageLayout';
import type { AppProps } from "next/app";
import ThemeRegistry from "../app/components/ThemeRegistry/ThemeRegistry";
import { msalInstance } from '../app/msalInstance';

import {
    QueryClient,
    QueryClientProvider
} from 'react-query';


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


interface MyAppProps extends AppProps {
    // EXTEND HERE
};

const queryClient = new QueryClient()

export default function MyApp({ Component, pageProps }: MyAppProps) {
    return (
        <>
            <Head>
                <title>Vibes Frontend</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <ThemeRegistry>
                <CssBaseline />
                <MsalProvider instance={msalInstance}>
                    <QueryClientProvider client={queryClient}>
                        <PageLayout>
                            <Component {...pageProps} />
                        </PageLayout>
                    </QueryClientProvider>
                </MsalProvider>
            </ThemeRegistry>
        </>
    );
}


