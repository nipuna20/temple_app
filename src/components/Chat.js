import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const Chat = ({ eventId }) => {
  const { token, user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const endpoint = useMemo(() => {
    return eventId ? `/chat/${eventId}` : "/chat";
  }, [eventId]);

  const getUserId = (u) => {
    if (!u) return null;
    return u.id || u._id || u.userId || null;
  };

  const isOwnMessage = (msg) => {
    const currentUserId = getUserId(user);
    const msgUserId = getUserId(msg?.User);
    return currentUserId && msgUserId && String(currentUserId) === String(msgUserId);
  };

  const getDisplayName = (msg) => {
    const firstName = msg?.User?.firstName || "";
    const lastName = msg?.User?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || "Unknown User";
  };

  const getInitials = (msg) => {
    const firstName = msg?.User?.firstName?.[0] || "";
    const lastName = msg?.User?.lastName?.[0] || "";
    return `${firstName}${lastName}`.toUpperCase() || "U";
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async (showLoader = false) => {
    if (!token) return;

    try {
      if (showLoader) setLoading(true);
      setError("");

      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching chat messages", err);
      setError("Failed to load messages.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(true);

    pollingRef.current = setInterval(() => {
      fetchMessages(false);
    }, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [endpoint, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !token || sending) return;

    try {
      setSending(true);
      setError("");

      const res = await api.post(
        endpoint,
        { message: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message", err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #E7E7E7",
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        height: { xs: "70vh", md: 620 },
        maxHeight: 700,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: "1px solid #F0F0F0",
          background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 18,
            color: "#1A1A1A",
          }}
        >
          {eventId ? "Event Chat" : "General Chat"}
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: 13,
            color: "#666",
          }}
        >
          {eventId
            ? "Discuss this event with other participants"
            : "Talk with the community in real time"}
        </Typography>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 1.5, md: 2 },
          py: 2,
          backgroundColor: "#FAFAFC",
        }}
      >
        {loading ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <CircularProgress size={28} />
            <Typography sx={{ color: "#666", fontSize: 14 }}>
              Loading messages...
            </Typography>
          </Box>
        ) : messages.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 18,
                  color: "#1A1A1A",
                  mb: 1,
                }}
              >
                No messages yet
              </Typography>
              <Typography sx={{ color: "#777", fontSize: 14 }}>
                Start the conversation by sending the first message.
              </Typography>
            </Box>
          </Box>
        ) : (
          messages.map((msg) => {
            const own = isOwnMessage(msg);

            return (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent: own ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: own ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    gap: 1,
                    maxWidth: { xs: "92%", sm: "80%", md: "72%" },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      fontSize: 13,
                      bgcolor: own ? "#3f51b5" : "#7b1fa2",
                    }}
                  >
                    {getInitials(msg)}
                  </Avatar>

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: own ? "flex-end" : "flex-start",
                        mb: 0.5,
                        px: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#666",
                          fontWeight: 600,
                        }}
                      >
                        {getDisplayName(msg)}
                        {msg?.User?.role === "admin" ? " • Admin" : ""}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        px: 1.6,
                        py: 1.25,
                        borderRadius: 3,
                        backgroundColor: own ? "#3f51b5" : "#FFFFFF",
                        color: own ? "#FFFFFF" : "#1A1A1A",
                        border: own ? "none" : "1px solid #E8E8E8",
                        boxShadow: own
                          ? "0 8px 20px rgba(63,81,181,0.20)"
                          : "0 4px 14px rgba(0,0,0,0.04)",
                        wordBreak: "break-word",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,
                          lineHeight: 1.7,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {msg.message}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: own ? "flex-end" : "flex-start",
                        mt: 0.5,
                        px: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: "#8A8A8A",
                        }}
                      >
                        {formatTime(msg.createdAt || msg.updatedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Error */}
      {error ? (
        <Box sx={{ px: 2, pt: 1 }}>
          <Typography sx={{ color: "error.main", fontSize: 13 }}>
            {error}
          </Typography>
        </Box>
      ) : null}

      {/* Input */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "#FFFFFF",
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          disabled={sending}
          InputProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: "#FAFAFC",
              alignItems: "flex-end",
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  sx={{
                    mb: 0.4,
                    bgcolor: newMessage.trim() ? "#3f51b5" : "#d9d9d9",
                    color: "#fff",
                    "&:hover": {
                      bgcolor: newMessage.trim() ? "#334296" : "#d9d9d9",
                    },
                    "&.Mui-disabled": {
                      color: "#fff",
                    },
                  }}
                >
                  {sending ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <SendIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 12, color: "#888" }}>
            Press Enter to send
          </Typography>

          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderRadius: 999,
              px: 2.5,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Chat;