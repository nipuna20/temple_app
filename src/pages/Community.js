import React, { useEffect, useMemo, useState, useContext } from "react";
import api from "../services/api";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack,
  TextField,
  Skeleton,
  Divider,
} from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import Chat from "../components/Chat";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/community");
        setPosts(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(query) ||
        (p.description || "").toLowerCase().includes(query)
    );
  }, [posts, q]);

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
              "url(https://buddho.org/wp-content/uploads/boeddha-museum-new-york.jpg)",
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
            Community & Gallery
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.72)", maxWidth: 780, lineHeight: 1.8 }}>
            Explore highlights from past events and connect with the community through discussions.
          </Typography>

          {/* Search */}
          <Box sx={{ mt: 3, maxWidth: 520 }}>
            <TextField
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search posts..."
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

      {/* Body */}
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
                No posts found.
              </Box>
            </Grid>
          ) : (
            filtered.map((post) => {
              const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
              const cover =
                (hasMedia && post.mediaUrls[0]) ||
                "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80";

              return (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
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
                    <CardMedia component="img" height="200" image={cover} alt={post.title} />

                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Chip
                          label={hasMedia ? "Gallery" : "Update"}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.18)",
                            color: "rgba(255,255,255,0.92)",
                            fontWeight: 800,
                          }}
                        />
                        {post.createdAt && (
                          <Typography sx={{ color: "rgba(255,255,255,0.70)", fontSize: 12 }}>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </Stack>

                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.92)",
                          fontWeight: 800,
                          fontSize: 16,
                          mb: 1,
                        }}
                      >
                        {post.title}
                      </Typography>

                      <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.7 }}>
                        {(post.description || "").slice(0, 120)}
                        {(post.description || "").length > 120 ? "..." : ""}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>

        {/* Chat panel */}
        <Box sx={{ mt: { xs: 5, md: 7 } }}>
          <Typography
            sx={{
              fontFamily: `"Georgia","Times New Roman",serif`,
              fontSize: { xs: 26, md: 34 },
              color: "rgba(255,255,255,0.92)",
              mb: 1,
            }}
          >
            Community Chat
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.72)", mb: 2, lineHeight: 1.8 }}>
            Ask questions, share updates, and connect with others. (Login required)
          </Typography>

          <Box
            sx={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 3,
              p: { xs: 2, md: 3 },
              backdropFilter: "blur(8px)",
            }}
          >
            {user && token ? (
              <Chat />
            ) : (
              <Box sx={{ color: "rgba(255,255,255,0.75)" }}>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2 }} />
                <Typography>
                  Log in to participate in the community chat.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Community;