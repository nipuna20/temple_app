import React from "react";
import { Box, Container, Typography, Stack, Button, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
               
                background: "linear-gradient(180deg, #12082c 0%, #0c051e 100%)",
                borderTop: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.85)",
            }}
        >
            <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={4}
                    justifyContent="space-between"
                >
                    {/* Brand */}
                    <Box sx={{ maxWidth: 420 }}>
                        <Typography
                            sx={{
                                fontFamily: `"Georgia","Times New Roman",serif`,
                                fontSize: 20,
                                color: "rgba(255,255,255,0.92)",
                                mb: 1,
                            }}
                        >
                            Buddhist Temple
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
                            A warm, relaxing and zen-like space for mindfulness, community, and spiritual growth.
                        </Typography>
                    </Box>

                    {/* Links */}
                    <Box>
                        <Typography sx={{ fontWeight: 700, mb: 1.5, color: "rgba(255,255,255,0.92)" }}>
                            Quick Links
                        </Typography>
                        <Stack spacing={0.5}>
                            <Button component={RouterLink} to="/" sx={linkSx}>Home</Button>
                            <Button component={RouterLink} to="/about" sx={linkSx}>About</Button>
                            <Button component={RouterLink} to="/events" sx={linkSx}>Events</Button>
                            <Button component={RouterLink} to="/community" sx={linkSx}>Community</Button>
                            <Button component={RouterLink} to="/publications" sx={linkSx}>Publications</Button>
                            <Button component={RouterLink} to="/contact" sx={linkSx}>Contact</Button>
                        </Stack>
                    </Box>

                    {/* Contact */}
                    <Box>
                        <Typography sx={{ fontWeight: 700, mb: 1.5, color: "rgba(255,255,255,0.92)" }}>
                            Contact
                        </Typography>
                        <Stack spacing={1.2}>
                            <Stack direction="row" spacing={1.2} alignItems="center">
                                <LocationOnOutlinedIcon sx={contactIconSx} />
                                <Typography sx={smallText}>123 Temple Road, Colombo, Sri Lanka</Typography>
                            </Stack>

                            <Stack direction="row" spacing={1.2} alignItems="center">
                                <CallOutlinedIcon sx={contactIconSx} />
                                <Typography sx={smallText}>+94 11 234 5678</Typography>
                            </Stack>

                            <Stack direction="row" spacing={1.2} alignItems="center">
                                <MailOutlineIcon sx={contactIconSx} />
                                <Typography sx={smallText}>info@buddhisttemple.org</Typography>
                            </Stack>
                        </Stack>

                        <Stack direction="row" spacing={1.2} sx={{ mt: 2.2 }}>
                            <Box component="a" href="#" aria-label="Facebook" sx={socialSx}>
                                <FacebookRoundedIcon sx={{ fontSize: 18 }} />
                            </Box>

                            <Box component="a" href="#" aria-label="Instagram" sx={socialSx}>
                                <InstagramIcon sx={{ fontSize: 18 }} />
                            </Box>

                            <Box component="a" href="#" aria-label="YouTube" sx={socialSx}>
                                <YouTubeIcon sx={{ fontSize: 20 }} />
                            </Box>
                        </Stack>
                    </Box>
                </Stack>

                <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.10)" }} />

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                >
                    <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.60)" }}>
                        © {new Date().getFullYear()} Buddhist Temple. All rights reserved.
                    </Typography>

                    <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.60)" }}>
                        Designed with compassion & mindfulness.
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};

const linkSx = {
    justifyContent: "flex-start",
    color: "rgba(255,255,255,0.70)",
    textTransform: "none",
    padding: 0,
    minWidth: 0,
    "&:hover": { color: "rgba(255,255,255,0.95)", backgroundColor: "transparent" },
};

const smallText = {
    fontSize: 14,
    color: "rgba(255,255,255,0.70)",
};

const contactIconSx = {
    fontSize: 18,
    color: "rgba(240,195,74,0.92)",
};

const socialSx = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    textDecoration: "none",
    color: "rgba(255,255,255,0.88)",
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    transition: "all 0.25s ease",
    "&:hover": {
        transform: "translateY(-2px)",
        backgroundColor: "rgba(240,195,74,0.18)",
        borderColor: "rgba(240,195,74,0.50)",
        color: "#fff",
    },
};

export default Footer;