import { AppBar, Box, Tab, Toolbar } from "@mui/material";
import Image from "next/image";
import VibesNavBarTabs from "./VibesNavBarTabs";
import SignInSignOutButton from "./vibes-buttons/SignInSignOutButton";
import zIndex from "@mui/material/styles/zIndex";
import theme from "@/app/components/ThemeRegistry/theme";

export default function VibesAppBar() {
    return (
        <AppBar position="fixed" sx={{zIndex:  (theme) => theme.zIndex.drawer + 1}}>
            <Toolbar>
                <VibesNavBarTabs
                    value={1}
                    textColor="inherit"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <Tab key={"Bemanning"} value={1} label={"Bemanning"} sx={{ fontSize: "1.2rem" }} />
                </VibesNavBarTabs>
                <Box component="div" sx={{ flexGrow: 1 }}></Box>
                <Image className="variant-logo" alt="Variant logo" src="./variant-logo-1.svg" width="65" height="16" />
                <Box component="div" sx={{ flexGrow: 0, minWidth: "1px", height: "50%", backgroundColor: "grey" }} ml={2}></Box>
                <SignInSignOutButton />
            </Toolbar>
        </AppBar >
    )
}
