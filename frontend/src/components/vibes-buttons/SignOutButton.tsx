"use client";
import { AnchorProp } from "@/types";
import { Logout } from "@mui/icons-material";
import { Avatar, ListItemIcon } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { signOut } from "next-auth/react";

import { useState } from "react";

export default function SignOutButton() {
  const [anchorEl, setAnchorEl] = useState<AnchorProp>(null);
  const open = Boolean(anchorEl);

  return (
    <div>
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        size="small"
        color="inherit"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar
          variant="circular"
          sx={{
            backgroundColor: "transparent",
            border: "1px solid white",
            width: 36,
            height: 36,
            fontSize: "90%",
          }}
        >
          ABC
        </Avatar>
      </IconButton>
      <Menu
        sx={{ mt: "50px" }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => signOut()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </div>
  );
}
