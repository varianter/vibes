import { AnchorProp } from "@/types";
import { useMsal } from "@azure/msal-react";
import { Logout } from "@mui/icons-material";
import { Avatar, ListItemIcon } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";

export const SignOutButton = () => {
    const { instance } = useMsal();
    const [accountSelectorOpen, setOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState<AnchorProp>(null);
    const open = Boolean(anchorEl);

    const handleLogout = () => {
        instance.logoutRedirect().catch((e) => { console.error(`logoutPopup failed: ${e}`) });
    }

    return (
        <div>
            <IconButton
                onClick={(event => setAnchorEl(event.currentTarget))}
                size="small"
                color="inherit"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <Avatar variant="circular" sx={{ backgroundColor: "transparent", border: "1px solid white", width: 36, height: 36, fontSize: "90%" }}>M</Avatar>
            </IconButton>
            <Menu
                sx={{ mt: '50px' }}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Log out
                </MenuItem>
            </Menu>
        </div>
    )
};