import { Tabs, TabsProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

export const VibesNavBarTabs = styled((props: VibesNavBarTabsProps) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        width: '100%',
        backgroundColor: 'rgba(104, 233, 221, 1)',
    },
});

interface VibesNavBarTabsProps extends TabsProps {
    children?: React.ReactNode;
}
