import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Stack,
  TextField,
  Skeleton,
} from "@mui/material";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return events;
    return events.filter((e) =>
      (e.title || "").toLowerCase().includes(query) ||
      (e.description || "").toLowerCase().includes(query)
    );
  }, [events, q]);

  return (
    <Box sx={{ backgroundColor: "#170c37", minHeight: "100vh" }}>
      {/* Hero Header */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 6, md: 9 },
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2400&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.30,
            transform: "scale(1.03)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(70% 70% at 50% 40%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.70) 70%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              fontFamily: `"Georgia","Times New Roman",serif`,
              color: "rgba(255,255,255,0.92)",
              fontSize: { xs: 34, md: 54 },
              lineHeight: 1.1,
              mb: 1,
              textShadow: "0 10px 40px rgba(0,0,0,0.45)",
            }}
          >
            Events & Services
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.72)", maxWidth: 780, lineHeight: 1.8 }}>
            Explore upcoming workshops, guided meditations, community gatherings, and special events.
          </Typography>

          {/* Search */}
          <Box sx={{ mt: 3, maxWidth: 520 }}>
            <TextField
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search events..."
              fullWidth
              InputProps={{
                sx: {
                  color: "rgba(255,255,255,0.90)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: 999,
                  px: 1.5,
                  "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.28)" },
                  "&.Mui-focused fieldset": { borderColor: "rgba(240,195,74,0.65)" },
                },
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* List */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={3}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton
                  variant="rounded"
                  height={320}
                  sx={{ borderRadius: 3, bgcolor: "rgba(255,255,255,0.08)" }}
                />
              </Grid>
            ))
          ) : filtered.length === 0 ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  border: "1px dashed rgba(255,255,255,0.25)",
                  borderRadius: 3,
                  p: 3,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                No events found.
              </Box>
            </Grid>
          ) : (
            filtered.map((event) => {
              const isPaid = Number(event.amount || 0) > 0;
              const deadline = event.registrationDeadline
                ? new Date(event.registrationDeadline).toLocaleDateString()
                : "";

              return (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card
                    sx={{
                      height: "100%",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 3,
                      overflow: "hidden",
                      backdropFilter: "blur(8px)",
                      transition: "transform 200ms ease, border-color 200ms ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: "rgba(255,255,255,0.22)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="190"
                      image={
                        event.image ||
                        "https://images.unsplash.com/photo-1499083097717-a156f48c1c9d?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={event.title}
                    />

                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.2 }}>
                        <Chip
                          label={isPaid ? `Paid • $${event.amount}` : "Free"}
                          size="small"
                          sx={{
                            backgroundColor: isPaid
                              ? "rgba(240,195,74,0.95)"
                              : "rgba(255,255,255,0.18)",
                            color: isPaid ? "#1b0a3b" : "rgba(255,255,255,0.92)",
                            fontWeight: 800,
                          }}
                        />
                        <Typography sx={{ color: "rgba(255,255,255,0.70)", fontSize: 12 }}>
                          {deadline ? `Deadline: ${deadline}` : ""}
                        </Typography>
                      </Stack>

                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.92)",
                          fontWeight: 800,
                          fontSize: 16,
                          mb: 1,
                        }}
                      >
                        {event.title}
                      </Typography>

                      <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.7, mb: 2 }}>
                        {(event.description || "").slice(0, 110)}
                        {(event.description || "").length > 110 ? "..." : ""}
                      </Typography>

                      <Button
                        component={RouterLink}
                        to={`/events/${event.id}`}
                        variant="contained"
                        fullWidth
                        sx={{
                          textTransform: "none",
                          borderRadius: 999,
                          backgroundColor: "#f0c34a",
                          color: "#1b0a3b",
                          fontWeight: 900,
                          "&:hover": { backgroundColor: "#ffd36a" },
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Events;