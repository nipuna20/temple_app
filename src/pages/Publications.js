import React, { useEffect, useMemo, useState } from "react";
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

const Publications = () => {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/publications");
        setItems(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (i) =>
        (i.title || "").toLowerCase().includes(query) ||
        (i.description || "").toLowerCase().includes(query) ||
        (i.type || "").toLowerCase().includes(query)
    );
  }, [items, q]);

  return (
    <Box sx={{ backgroundColor: "#0f0726", minHeight: "100vh" }}>
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
              "url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.28,
            transform: "scale(1.03)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(70% 70% at 50% 40%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.70) 70%, rgba(0,0,0,0.86) 100%)",
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
            Publications
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.72)", maxWidth: 780, lineHeight: 1.8 }}>
            Download PDFs and watch videos shared by our community and leaders.
          </Typography>

          {/* Search */}
          <Box sx={{ mt: 3, maxWidth: 520 }}>
            <TextField
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search publications..."
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
                No publications found.
              </Box>
            </Grid>
          ) : (
            filtered.map((item) => {
              const isVideo = item.type === "video";
              const badgeLabel = isVideo ? "Video" : "PDF";

              return (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
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
                    {/* Top media area */}
                    {isVideo ? (
                      <CardMedia component="video" height="200" src={item.url} controls />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, rgba(240,195,74,0.18) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.04) 100%)",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: `"Georgia","Times New Roman",serif`,
                            color: "rgba(255,255,255,0.90)",
                            fontSize: 22,
                          }}
                        >
                          PDF
                        </Typography>
                      </Box>
                    )}

                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.2 }}>
                        <Chip
                          label={badgeLabel}
                          size="small"
                          sx={{
                            backgroundColor: isVideo
                              ? "rgba(255,255,255,0.18)"
                              : "rgba(240,195,74,0.95)",
                            color: isVideo ? "rgba(255,255,255,0.92)" : "#1b0a3b",
                            fontWeight: 900,
                          }}
                        />
                      </Stack>

                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.92)",
                          fontWeight: 800,
                          fontSize: 16,
                          mb: 1,
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.7, mb: 2 }}>
                        {(item.description || "").slice(0, 120)}
                        {(item.description || "").length > 120 ? "..." : ""}
                      </Typography>

                      {!isVideo && (
                        <Button
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
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
                          Download PDF
                        </Button>
                      )}
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

export default Publications;