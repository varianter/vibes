'use client'

import { AppBar, Container, Tab, Tabs, TabsProps, Toolbar, styled } from "@mui/material";
import Image from "next/image";
import React from "react";

export default function VibesAppBar() {
    const pages = ['Bemanning', 'Kunder', 'Rapporter', "Budsjett", "Konsulenter"];

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar>
                    <VibesTabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        indicatorColor="primary"
                        variant="fullWidth"
                    >
                        {pages.map((page, pageIndex) => <Tab key={page} value={pageIndex} label={page} sx={{ fontSize: "1.2rem" }} />)}
                    </VibesTabs>
                    <Image className="variant-logo" alt="Variant logo" src="./variant-logo-1.svg" width="65" height="16" />
                </Toolbar>
            </Container>

        </AppBar>
    )
}


interface VibesTabsProps extends TabsProps {
    children?: React.ReactNode;
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
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

