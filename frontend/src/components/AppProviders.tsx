"use client"
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import PageLayout from "./PageLayout";
import ThemeRegistry from "./ThemeRegistry/ThemeRegistry";


const queryClient = new QueryClient()

export default function AppProviders({ children }: { children: React.ReactNode }) {

    return (<ThemeRegistry>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
            <PageLayout>
                {children}
            </PageLayout>
        </QueryClientProvider>
    </ThemeRegistry>)
}
