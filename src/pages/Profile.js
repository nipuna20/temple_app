import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Container,
    Paper,
    Grid,
    Avatar,
    Chip,
    Divider,
    Skeleton,
    Alert,
    Button,
    Stack,
} from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import { Link as RouterLink } from "react-router-dom";

const Profile = () => {
    const { user, logout } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState("dashboard");
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [freeEvents, setFreeEvents] = useState([]);
    const [paidRegisteredEvents, setPaidRegisteredEvents] = useState([]);
    const [myDanaBookings, setMyDanaBookings] = useState([]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError("");

            const [profileRes, eventsRes, registrationsRes, danaRes] = await Promise.all([
                api.get("/auth/me"),
                api.get("/events"),
                api.get("/events/my/registrations"),
                api.get("/dana/my-bookings"),
            ]);

            const profileData = profileRes.data;
            const allEvents = eventsRes.data || [];
            const myRegistrations = registrationsRes.data || [];
            const danaBookings = danaRes.data || [];

            const freeOnly = allEvents.filter((event) => Number(event.amount || 0) <= 0);

            const paidMap = new Map();
            myRegistrations.forEach((reg) => {
                if (
                    reg?.Event &&
                    Number(reg.Event.amount || 0) > 0 &&
                    reg.paymentStatus === "paid" &&
                    !paidMap.has(reg.Event.id)
                ) {
                    paidMap.set(reg.Event.id, reg.Event);
                }
            });

            setProfile(profileData);
            setFreeEvents(freeOnly);
            setPaidRegisteredEvents(Array.from(paidMap.values()));
            setMyDanaBookings(danaBookings);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const fullName = useMemo(() => {
        if (!profile) return "";
        return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
    }, [profile]);

    const avatarLetter =
        (profile?.firstName?.charAt(0) ||
            user?.firstName?.charAt(0) ||
            user?.email?.charAt(0) ||
            "U").toUpperCase();

    const dashboardCounts = {
        dana: myDanaBookings.length,
        freeEvents: freeEvents.length,
        paidEvents: paidRegisteredEvents.length,
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at top left, rgba(140,90,255,0.14) 0%, rgba(140,90,255,0) 32%), linear-gradient(180deg, #17003a 0%, #12052b 100%)",
                py: { xs: 4, md: 7 },
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    sx={{
                        fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
                        color: "#f2ebff",
                        fontSize: { xs: "2.6rem", md: "4rem" },
                        lineHeight: 1,
                        mb: 4,
                        textAlign: "center",
                    }}
                >
                    My Profile
                </Typography>

                {error ? (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            backgroundColor: "rgba(255,255,255,0.08)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.12)",
                        }}
                    >
                        {error}
                    </Alert>
                ) : null}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
                        gap: 3,
                        alignItems: "start",
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.10)",
                            borderRadius: 4,
                            backdropFilter: "blur(8px)",
                            p: 2,
                            position: { md: "sticky" },
                            top: { md: 24 },
                        }}
                    >
                        {loading ? (
                            <>
                                <Skeleton
                                    variant="circular"
                                    width={70}
                                    height={70}
                                    sx={{ bgcolor: "rgba(255,255,255,0.10)", mb: 2 }}
                                />
                                <Skeleton
                                    variant="text"
                                    sx={{ height: 38, width: "80%", bgcolor: "rgba(255,255,255,0.10)" }}
                                />
                                <Skeleton
                                    variant="text"
                                    sx={{ height: 28, width: "60%", bgcolor: "rgba(255,255,255,0.10)", mb: 2 }}
                                />
                            </>
                        ) : (
                            <Box sx={{ mb: 2.5 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Avatar
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            fontSize: 24,
                                            fontWeight: 700,
                                            backgroundColor: "#8c5aff",
                                        }}
                                    >
                                        {avatarLetter}
                                    </Avatar>

                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            sx={{
                                                color: "#fff",
                                                fontWeight: 700,
                                                fontSize: 18,
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {fullName || "User"}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: "rgba(255,255,255,0.68)",
                                                fontSize: 13,
                                                mt: 0.4,
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {profile?.email || user?.email || "-"}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Chip
                                    label={profile?.role || "user"}
                                    size="small"
                                    sx={{
                                        mt: 1.5,
                                        textTransform: "capitalize",
                                        backgroundColor: "rgba(255,255,255,0.12)",
                                        color: "#fff",
                                        border: "1px solid rgba(255,255,255,0.10)",
                                    }}
                                />
                            </Box>
                        )}

                        <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2 }} />

                        <Stack spacing={1.2}>
                            <SidebarButton
                                active={activeTab === "dashboard"}
                                onClick={() => setActiveTab("dashboard")}
                            >
                                Dashboard
                            </SidebarButton>

                            <SidebarButton
                                active={activeTab === "dana"}
                                onClick={() => setActiveTab("dana")}
                            >
                                Booking Dana
                            </SidebarButton>

                            <SidebarButton
                                active={activeTab === "events"}
                                onClick={() => setActiveTab("events")}
                            >
                                Events
                            </SidebarButton>
                        </Stack>

                        <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", my: 2 }} />

                        <Stack spacing={1.2}>
                            <Button
                                variant="contained"
                                component={RouterLink}
                                to="/donate-monthly"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 999,
                                    px: 2.5,
                                    py: 1.1,
                                    backgroundColor: "#8c5aff",
                                    "&:hover": { backgroundColor: "#a27df5" },
                                }}
                            >
                                Monthly
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={fetchAllData}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 999,
                                    px: 2.5,
                                    py: 1.1,
                                    color: "#fff",
                                    borderColor: "rgba(255,255,255,0.20)",
                                    "&:hover": {
                                        borderColor: "rgba(255,255,255,0.36)",
                                        backgroundColor: "rgba(255,255,255,0.05)",
                                    },
                                }}
                            >
                                Refresh
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={logout}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 999,
                                    px: 2.5,
                                    py: 1.1,
                                    color: "#fff",
                                    borderColor: "rgba(255,255,255,0.20)",
                                    "&:hover": {
                                        borderColor: "rgba(255,255,255,0.36)",
                                        backgroundColor: "rgba(255,255,255,0.05)",
                                    },
                                }}
                            >
                                Logout
                            </Button>
                        </Stack>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.10)",
                            borderRadius: 4,
                            backdropFilter: "blur(8px)",
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                px: { xs: 3, md: 5 },
                                py: { xs: 4, md: 5 },
                            }}
                        >
                            {loading ? (
                                <>
                                    <Skeleton
                                        variant="text"
                                        sx={{ height: 48, width: "35%", bgcolor: "rgba(255,255,255,0.10)", mb: 2 }}
                                    />
                                    <Skeleton
                                        variant="rectangular"
                                        height={170}
                                        sx={{ borderRadius: 3, bgcolor: "rgba(255,255,255,0.10)", mb: 2 }}
                                    />
                                    <Skeleton
                                        variant="rectangular"
                                        height={120}
                                        sx={{ borderRadius: 3, bgcolor: "rgba(255,255,255,0.10)" }}
                                    />
                                </>
                            ) : (
                                <>
                                    {activeTab === "dashboard" && (
                                        <>
                                            <Typography
                                                sx={{
                                                    color: "#fff",
                                                    fontSize: { xs: 26, md: 34 },
                                                    fontWeight: 700,
                                                    lineHeight: 1.2,
                                                    mb: 3,
                                                }}
                                            >
                                                Dashboard
                                            </Typography>

                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <InfoCard label="First name" value={profile?.firstName || "-"} />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <InfoCard label="Last name" value={profile?.lastName || "-"} />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <InfoCard label="Email" value={profile?.email || "-"} />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <InfoCard label="Role" value={profile?.role || "-"} />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <InfoCard
                                                        label="Joined"
                                                        value={
                                                            profile?.createdAt
                                                                ? new Date(profile.createdAt).toLocaleDateString()
                                                                : "-"
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", my: 3 }} />

                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={4}>
                                                    <CountCard title="Dana Bookings" count={dashboardCounts.dana} />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <CountCard title="Free Events" count={dashboardCounts.freeEvents} />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <CountCard title="Paid Events" count={dashboardCounts.paidEvents} />
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}

                                    {activeTab === "dana" && (
                                        <>
                                            <Typography
                                                sx={{
                                                    color: "#fff",
                                                    fontSize: { xs: 26, md: 34 },
                                                    fontWeight: 700,
                                                    lineHeight: 1.2,
                                                    mb: 3,
                                                }}
                                            >
                                                Booking Dana
                                            </Typography>

                                            {myDanaBookings.length === 0 ? (
                                                <EmptyState text="You do not have any Dana bookings yet." />
                                            ) : (
                                                <Stack spacing={2}>
                                                    {myDanaBookings.map((booking) => (
                                                        <ContentCard key={booking.id}>
                                                            <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>
                                                                {new Date(booking.date).toLocaleDateString()}
                                                            </Typography>

                                                            <Typography sx={{ color: "rgba(255,255,255,0.78)", mt: 0.8 }}>
                                                                Meal: {booking.mealType || "-"}
                                                            </Typography>

                                                            <Typography sx={{ color: "rgba(255,255,255,0.78)", mt: 0.5 }}>
                                                                Booking status: {booking.status || "-"}
                                                            </Typography>

                                                            <Typography sx={{ color: "rgba(255,255,255,0.78)", mt: 0.5 }}>
                                                                Request status: {booking.requestStatus || "none"}
                                                            </Typography>
                                                        </ContentCard>
                                                    ))}
                                                </Stack>
                                            )}
                                        </>
                                    )}

                                    {activeTab === "events" && (
                                        <>
                                            <Typography
                                                sx={{
                                                    color: "#fff",
                                                    fontSize: { xs: 26, md: 34 },
                                                    fontWeight: 700,
                                                    lineHeight: 1.2,
                                                    mb: 3,
                                                }}
                                            >
                                                Events
                                            </Typography>

                                            <Box sx={{ mb: 4 }}>
                                                <Typography
                                                    sx={{
                                                        color: "#f2ebff",
                                                        fontSize: 22,
                                                        fontWeight: 700,
                                                        mb: 2,
                                                    }}
                                                >
                                                    Free Events
                                                </Typography>

                                                {freeEvents.length === 0 ? (
                                                    <EmptyState text="No free events available." />
                                                ) : (
                                                    <Stack spacing={2}>
                                                        {freeEvents.map((event) => (
                                                            <EventCard key={event.id} event={event} showPaid={false} />
                                                        ))}
                                                    </Stack>
                                                )}
                                            </Box>

                                            <Box sx={{ mt: 5 }}>
                                                <Typography
                                                    sx={{
                                                        color: "#f2ebff",
                                                        fontSize: 22,
                                                        fontWeight: 700,
                                                        mb: 2,
                                                    }}
                                                >
                                                    Paid Events
                                                </Typography>

                                                {paidRegisteredEvents.length === 0 ? (
                                                    <EmptyState text="You do not have any paid registered events yet." />
                                                ) : (
                                                    <Stack spacing={2}>
                                                        {paidRegisteredEvents.map((event) => (
                                                            <EventCard key={event.id} event={event} showPaid />
                                                        ))}
                                                    </Stack>
                                                )}
                                            </Box>
                                        </>
                                    )}
                                </>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

const SidebarButton = ({ active, children, onClick }) => {
    return (
        <Button
            fullWidth
            onClick={onClick}
            sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderRadius: 3,
                px: 2,
                py: 1.35,
                color: "#fff",
                fontWeight: 600,
                backgroundColor: active ? "rgba(140,90,255,0.22)" : "rgba(255,255,255,0.03)",
                border: active
                    ? "1px solid rgba(140,90,255,0.38)"
                    : "1px solid rgba(255,255,255,0.08)",
                "&:hover": {
                    backgroundColor: active ? "rgba(140,90,255,0.28)" : "rgba(255,255,255,0.06)",
                },
            }}
        >
            {children}
        </Button>
    );
};

const InfoCard = ({ label, value }) => {
    return (
        <Box
            sx={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 3,
                p: 2.2,
                height: "100%",
            }}
        >
            <Typography
                sx={{
                    color: "rgba(255,255,255,0.62)",
                    fontSize: 13,
                    mb: 0.8,
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 600,
                    wordBreak: "break-word",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

const CountCard = ({ title, count }) => {
    return (
        <Box
            sx={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 3,
                p: 2.4,
            }}
        >
            <Typography sx={{ color: "rgba(255,255,255,0.64)", fontSize: 13, mb: 1 }}>
                {title}
            </Typography>
            <Typography sx={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>
                {count}
            </Typography>
        </Box>
    );
};

const ContentCard = ({ children }) => {
    return (
        <Box
            sx={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 3,
                p: 2.4,
            }}
        >
            {children}
        </Box>
    );
};

const EmptyState = ({ text }) => {
    return (
        <Box
            sx={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 3,
                p: 3,
            }}
        >
            <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>{text}</Typography>
        </Box>
    );
};

const EventCard = ({ event, showPaid }) => {
    return (
        <ContentCard>
            <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>
                {event.title}
            </Typography>

            <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 0.8 }}>
                Deadline:{" "}
                {event.registrationDeadline
                    ? new Date(event.registrationDeadline).toLocaleDateString()
                    : "-"}
            </Typography>

            {showPaid && (
                <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 0.5 }}>
                    Fee: ${event.amount || 0}
                </Typography>
            )}

            <Typography sx={{ color: "rgba(255,255,255,0.78)", mt: 1.2 }}>
                {event.description || "No description available."}
            </Typography>

            <Button
                component={RouterLink}
                to={`/events/${event.id}`}
                variant="outlined"
                sx={{
                    mt: 2,
                    textTransform: "none",
                    borderRadius: 999,
                    px: 2.5,
                    py: 1,
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.20)",
                    "&:hover": {
                        borderColor: "rgba(255,255,255,0.36)",
                        backgroundColor: "rgba(255,255,255,0.05)",
                    },
                }}
            >
                View Event
            </Button>
        </ContentCard>
    );
};

export default Profile;