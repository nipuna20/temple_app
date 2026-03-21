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
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        const unread = (res.data || []).filter((n) => !n.isRead).length;
        setNotifCount(unread);
      } catch (err) {
        setNotifCount(0);
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

  const toggleMobileDrawer = (open) => {
    setMobileDrawerOpen(open);
  };

  const handleLogout = () => {
    handleMenuClose();
    setMobileDrawerOpen(false);
    logout();
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

  const userDisplayName = React.useMemo(() => {
    if (!user) return "";
    return user.firstName || user.first_name || user.name || user.email || "User";
  }, [user]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Events", to: "/events" },
    { label: "Community", to: "/community" },
    { label: "Publications", to: "/publications" },
    { label: "Contact & Support", to: "/contact" },
    { label: "Poya Calender", to: "/poya-calendar" },
  ];

  if (user) {
    navLinks.push({
      label: `Notifications${notifCount > 0 ? ` (${notifCount})` : ""}`,
      to: "/notifications",
    });
  }

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
    whiteSpace: "nowrap",
  });

  const mobileLinkBtnSx = (to) => ({
    width: "100%",
    justifyContent: "flex-start",
    color: "rgba(255,255,255,0.92)",
    textTransform: "none",
    fontWeight: pathname === to ? 700 : 500,
    fontSize: 15,
    letterSpacing: "0.02em",
    borderRadius: 2,
    px: 1.5,
    py: 1.2,
    backgroundColor: pathname === to ? "rgba(255,255,255,0.10)" : "transparent",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.08)",
    },
  });

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(180deg, #1b0a3b 0%, #12082c 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1500,
            mx: "auto",
            width: "100%",
            py: { xs: 1, md: 1.2 },
            px: { xs: 1.5, sm: 2, md: 3 },
            minHeight: { xs: 72, md: 80 },
          }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              textDecoration: "none",
              color: "white",
              minWidth: 0,
              flexShrink: 1,
              maxWidth: isMobile ? "calc(100% - 64px)" : "unset",
            }}
          >
            <Box
              sx={{
                width: { xs: 34, md: 36 },
                height: { xs: 34, md: 36 },
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 18 }}>✿</span>
            </Box>

            <Typography
              sx={{
                fontFamily: `"Georgia","Times New Roman",serif`,
                fontSize: { xs: 16, sm: 18, md: 23 },
                letterSpacing: "0.02em",
                lineHeight: 2.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: 500,
              }}
            >
              East End Meditaion and Wellness Society
            </Typography>
          </Box>

          {!isMobile ? (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ ml: "auto", alignItems: "center" }}
            >
              {navLinks.map((item) => (
                <Button
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  sx={linkBtnSx(item.to)}
                >
                  {item.label}
                </Button>
              ))}

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
                <>
                  {/* <Button
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
                  </Button> */}

                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{
                      ...linkBtnSx("/login"),
                      ml: 1,
                    }}
                  >
                    Login
                  </Button>

                  {/* <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/register"
                    sx={{
                      ml: 0.5,
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 999,
                      px: 2.2,
                      py: 0.9,
                      color: "#fff",
                      borderColor: "rgba(255,255,255,0.22)",
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.38)",
                        backgroundColor: "rgba(255,255,255,0.08)",
                      },
                    }}
                  >
                    Register
                  </Button> */}
                </>
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

                    {/* <MenuItem
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
                    </MenuItem> */}

                    <MenuItem
                      onClick={handleLogout}
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
              ) : null}
            </Stack>
          ) : (
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
              {user && (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: 14,
                    backgroundColor: "#8c5aff",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  {userInitial}
                </Avatar>
              )}

              <IconButton
                onClick={() => toggleMobileDrawer(true)}
                sx={{
                  color: "white",
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => toggleMobileDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: "84vw", sm: 340 },
            maxWidth: 360,
            background: "linear-gradient(180deg, #1b0a3b 0%, #12082c 100%)",
            color: "rgba(255,255,255,0.92)",
            borderLeft: "1px solid rgba(255,255,255,0.10)",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              px: 2,
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, minWidth: 0 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 17 }}>✿</span>
              </Box>
              <Typography
                sx={{
                  fontFamily: `"Georgia","Times New Roman",serif`,
                  fontSize: 15,
                  lineHeight: 1.2,
                }}
              >
                Menu
              </Typography>
            </Box>

            <IconButton
              onClick={() => toggleMobileDrawer(false)}
              sx={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.12)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />

          {user && (
            <>
              <Box
                sx={{
                  px: 2,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    width: 42,
                    height: 42,
                    fontSize: 18,
                    backgroundColor: "#8c5aff",
                  }}
                >
                  {userInitial}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {userDisplayName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.70)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.email || ""}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />
            </>
          )}

          <Stack spacing={0.5} sx={{ px: 1.5, py: 1.5 }}>
            {navLinks.map((item) => (
              <Button
                key={item.to}
                component={RouterLink}
                to={item.to}
                onClick={() => toggleMobileDrawer(false)}
                sx={mobileLinkBtnSx(item.to)}
              >
                {item.label}
              </Button>
            ))}

            {user?.role === "admin" && (
              <Button
                component={RouterLink}
                to="/admin"
                onClick={() => toggleMobileDrawer(false)}
                sx={mobileLinkBtnSx("/admin")}
              >
                Dashboard
              </Button>
            )}
          </Stack>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mx: 1.5 }} />

          <Stack spacing={1.2} sx={{ px: 2, py: 2 }}>
            <Button
              variant="contained"
              component={RouterLink}
              to="/donate"
              onClick={() => toggleMobileDrawer(false)}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 999,
                py: 1.1,
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
                onClick={() => toggleMobileDrawer(false)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 999,
                  py: 1.1,
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
                <Button
                  component={RouterLink}
                  to="/profile"
                  onClick={() => toggleMobileDrawer(false)}
                  sx={mobileLinkBtnSx("/profile")}
                >
                  Profile
                </Button>

                <Button
                  component={RouterLink}
                  to="/donate-monthly"
                  onClick={() => toggleMobileDrawer(false)}
                  sx={mobileLinkBtnSx("/donate-monthly")}
                >
                  Monthly
                </Button>

                <Button
                  onClick={handleLogout}
                  sx={{
                    ...mobileLinkBtnSx("/logout"),
                    color: "#ffd7d7",
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  onClick={() => toggleMobileDrawer(false)}
                  sx={mobileLinkBtnSx("/login")}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  onClick={() => toggleMobileDrawer(false)}
                  sx={mobileLinkBtnSx("/register")}
                >
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;