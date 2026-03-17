import React, { useContext, useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  // Fetch notification count for logged-in user
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        const unread = (res.data || []).filter((n) => !n.isRead).length;
        setNotifCount(unread);
      } catch (err) {
        // ignore errors silently
      }
    };
    if (user) {
      fetchNotifications();
    } else {
      setNotifCount(0);
    }
  }, [user]);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const userInitial = React.useMemo(() => {
    if (!user) return "";
    const possible = [user.firstName, user.first_name, user.email];
    for (const val of possible) {
      if (val && typeof val === "string" && val.length > 0) {
        return val.charAt(0).toUpperCase();
      }
    }
    return "U";
  }, [user]);

  const linkBtnSx = (to) => ({
    color: "rgba(255,255,255,0.92)",
    textTransform: "none",
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: "0.02em",
    opacity: pathname === to ? 1 : 0.9,
    "&:hover": {
      opacity: 1,
      backgroundColor: "rgba(255,255,255,0.08)",
    },
    borderRadius: 999,
    px: 1.5,
    py: 0.75,
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(180deg, #1b0a3b 0%, #12082c 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <Toolbar sx={{ maxWidth: 1500, mx: "auto", width: "100%", py: 1.2 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            textDecoration: "none",
            color: "white",
            mr: 2,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            <span style={{ fontSize: 18 }}>✿</span>
          </Box>

          <Typography
            sx={{
              fontFamily: `"Georgia","Times New Roman",serif`,
              fontSize: 18,
              letterSpacing: "0.02em",
            }}
          >
            East End Meditaion and Wellness Society
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ ml: "auto", alignItems: "center" }}
        >
          <Button component={RouterLink} to="/" sx={linkBtnSx("/")}>
            Home
          </Button>
          <Button component={RouterLink} to="/about" sx={linkBtnSx("/about")}>
            About
          </Button>
          <Button component={RouterLink} to="/events" sx={linkBtnSx("/events")}>
            Events
          </Button>
          <Button
            component={RouterLink}
            to="/community"
            sx={linkBtnSx("/community")}
          >
            Community
          </Button>
          <Button
            component={RouterLink}
            to="/publications"
            sx={linkBtnSx("/publications")}
          >
            Publications
          </Button>
          <Button
            component={RouterLink}
            to="/contact"
            sx={linkBtnSx("/contact")}
          >
            Contact & Support
          </Button>

          {/* Dana booking button */}
          <Button
            component={RouterLink}
            to="/dana"
            sx={linkBtnSx('/dana')}
          >
            Dana
          </Button>

          {/* Notifications button shown for logged‑in users */}
          {user && (
            <Button
              component={RouterLink}
              to="/notifications"
              sx={linkBtnSx('/notifications')}
            >
              Notifications{notifCount > 0 ? ` (${notifCount})` : ''}
            </Button>
          )}

          <Button
            variant="contained"
            component={RouterLink}
            to="/donate"
            sx={{
              ml: 1,
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 999,
              px: 2.2,
              py: 0.9,
              backgroundColor: "#f0c34a",
              color: "#1b0a3b",
              "&:hover": { backgroundColor: "#ffd36a" },
            }}
          >
            Donate
          </Button>

          {!user && (
            <Button
              variant="contained"
              component={RouterLink}
              to="/donate-monthly"
              sx={{
                ml: 1,
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 999,
                px: 2.2,
                py: 0.9,
                backgroundColor: "#8c5aff",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#a27df5" },
              }}
            >
              Monthly
            </Button>
          )}

          {user ? (
            <>
              {user?.role === "admin" && (
                <Button component={RouterLink} to="/admin" sx={linkBtnSx("/admin")}>
                  Dashboard
                </Button>
              )}

              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  ml: 1.5,
                  p: 0,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: 16,
                    backgroundColor: "#8c5aff",
                  }}
                >
                  {userInitial}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    backgroundColor: "#1b0a3b",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.92)",
                  },
                }}
              >
                <MenuItem
                  component={RouterLink}
                  to="/profile"
                  onClick={handleMenuClose}
                  sx={{
                    fontSize: 14,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Profile
                </MenuItem>

                <MenuItem
                  component={RouterLink}
                  to="/donate-monthly"
                  onClick={handleMenuClose}
                  sx={{
                    fontSize: 14,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Monthly
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    logout();
                  }}
                  sx={{
                    fontSize: 14,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login" sx={linkBtnSx("/login")}>
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                sx={linkBtnSx("/register")}
              >
                Register
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;