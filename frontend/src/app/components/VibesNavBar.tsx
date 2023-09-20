'use client'

import { AppBar, Box, Tab, Tabs, TabsProps, Toolbar, styled } from "@mui/material";
import Image from "next/image";
import React from "react";

export default function VibesAppBar() {
    const pages = ['Bemanning'];

    return (
        <AppBar position="static">
            <Toolbar>
                <VibesTabs
                    value={1}
                    textColor="inherit"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <Tab key={"Bemanning"} value={1} label={"Bemanning"} sx={{ fontSize: "1.2rem" }} />
                </VibesTabs>
                <Box component="div" sx={{ flexGrow: 1 }}></Box>
                <Image className="variant-logo" alt="Variant logo" src="./variant-logo-1.svg" width="65" height="16" />
            </Toolbar>
        </AppBar >
    )
}


interface VibesTabsProps extends TabsProps {
    children?: React.ReactNode;
}

const VibesTabs = styled((props: VibesTabsProps) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        // maxWidth: 40,
        width: '100%',
        backgroundColor: 'rgba(104, 233, 221, 1)',
    },
});

