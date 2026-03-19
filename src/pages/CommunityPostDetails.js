import React, { useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
    Box,
    Typography,
    Container,
    Chip,
    Stack,
    Grid,
    Divider,
    Button,
    Skeleton,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AuthContext } from "../contexts/AuthContext";
import Chat from "../components/Chat";

const CommunityPostDetails = () => {
    const { id } = useParams();
    const { user, token } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);

            try {
                const singleRes = await api.get(`/community/${id}`);
                if (singleRes.data) {
                    setPost(singleRes.data);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                // ignore and try fallback
            }

            try {
                const listRes = await api.get("/community");
                const allPosts = listRes.data || [];
                const found = allPosts.find(
                    (item) => String(item.id || item._id) === String(id)
                );
                setPost(found || null);
            } catch (err) {
                console.error(err);
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const mediaUrls = useMemo(() => {
        if (!post?.mediaUrls) return [];
        if (Array.isArray(post.mediaUrls)) return post.mediaUrls;
        if (typeof post.mediaUrls === "string") {
            return post.mediaUrls
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }
        return [];
    }, [post]);

    if (loading) {
        return (
            <Box sx={{ backgroundColor: "#0f0726", minHeight: "100vh", py: 6 }}>
                <Container maxWidth="lg">
                    <Skeleton
                        variant="rounded"
                        height={360}
                        sx={{ borderRadius: 4, bgcolor: "rgba(255,255,255,0.08)", mb: 4 }}
                    />
                    <Skeleton
                        variant="text"
                        width="50%"
                        height={60}
                        sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
                    />
                    <Skeleton
                        variant="text"
                        width="100%"
                        height={40}
                        sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
                    />
                    <Skeleton
                        variant="text"
                        width="90%"
                        height={40}
                        sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
                    />
                </Container>
            </Box>
        );
    }

    if (!post) {
        return (
            <Box sx={{ backgroundColor: "#0f0726", minHeight: "100vh", py: 6 }}>
                <Container maxWidth="lg">
                    <Button
                        component={RouterLink}
                        to="/community"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            textTransform: "none",
                            color: "rgba(255,255,255,0.88)",
                            mb: 3,
                        }}
                    >
                        Back to Community
                    </Button>

                    <Box
                        sx={{
                            border: "1px dashed rgba(255,255,255,0.20)",
                            borderRadius: 3,
                            p: 4,
                            color: "rgba(255,255,255,0.75)",
                        }}
                    >
                        Post not found.
                    </Box>
                </Container>
            </Box>
        );
    }

    const cover =
        mediaUrls[0] ||
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80";

    return (
        <Box sx={{ backgroundColor: "#0f0726", minHeight: "100vh" }}>
            <Box
                sx={{
                    position: "relative",
                    minHeight: { xs: 320, md: 460 },
                    overflow: "hidden",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url(${cover})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transform: "scale(1.03)",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.70) 65%, rgba(0,0,0,0.88) 100%)",
                    }}
                />

                <Container
                    maxWidth="lg"
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        minHeight: { xs: 320, md: 460 },
                        display: "flex",
                        alignItems: "flex-end",
                        pb: { xs: 4, md: 6 },
                    }}
                >
                    <Box sx={{ width: "100%" }}>
                        <Button
                            component={RouterLink}
                            to="/community"
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                textTransform: "none",
                                color: "rgba(255,255,255,0.88)",
                                mb: 3,
                            }}
                        >
                            Back to Community
                        </Button>

                        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
                            <Chip
                                label={mediaUrls.length > 0 ? "Gallery Post" : "Community Update"}
                                size="small"
                                sx={{
                                    backgroundColor: "rgba(255,255,255,0.16)",
                                    color: "rgba(255,255,255,0.95)",
                                    fontWeight: 800,
                                }}
                            />
                            {post.createdAt && (
                                <Typography sx={{ color: "rgba(255,255,255,0.74)", fontSize: 13 }}>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </Typography>
                            )}
                        </Stack>

                        <Typography
                            sx={{
                                fontFamily: `"Georgia","Times New Roman",serif`,
                                color: "rgba(255,255,255,0.95)",
                                fontSize: { xs: 34, md: 56 },
                                lineHeight: 1.08,
                                mb: 1,
                                textShadow: "0 10px 40px rgba(0,0,0,0.45)",
                            }}
                        >
                            {post.title}
                        </Typography>
                    </Box>
                </Container>
            </Box>

            

                {mediaUrls.length > 0 && (
                    <Box sx={{ mb: { xs: 5, md: 7 } }}>
                        {/* <Typography
                            sx={{
                                fontFamily: `"Georgia","Times New Roman",serif`,
                                fontSize: { xs: 28, md: 38 },
                                color: "rgba(255,255,255,0.92)",
                                mb: 3,
                            }}
                        >
                            Gallery
                        </Typography> */}

                        {/* <Grid container spacing={3}>
                            {mediaUrls.map((url, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Box
                                        component="img"
                                        src={url}
                                        alt={`${post.title} ${index + 1}`}
                                        sx={{
                                            width: "100%",
                                            height: { xs: 240, md: 280 },
                                            objectFit: "cover",
                                            borderRadius: 3,
                                            display: "block",
                                            border: "1px solid rgba(255,255,255,0.10)",
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid> */}
                        
                    </Box>
                )}

            <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
                <Box
                    sx={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: 3,
                        p: { xs: 2.5, md: 4 },
                        backdropFilter: "blur(8px)",
                        mb: 5,
                    }}
                >
                    <Typography
                        sx={{
                            color: "rgba(255,255,255,0.82)",
                            fontSize: { xs: 15, md: 17 },
                            lineHeight: 2,
                            whiteSpace: "pre-line",
                        }}
                    >
                        {post.description || "No description available."}
                    </Typography>
                </Box>

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
                        Share your thoughts and connect with others about this post. (Login required)
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
                                <Typography>Log in to participate in the community chat.</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CommunityPostDetails;