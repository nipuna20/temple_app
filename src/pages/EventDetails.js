import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Box, Typography, Button, Divider, Alert, CircularProgress } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import Chat from "../components/Chat";
import LiveStream from "../components/LiveStream";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [stream, setStream] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [accessReason, setAccessReason] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState({
    registered: false,
    paid: false,
    registration: null,
  });
  const [loading, setLoading] = useState(true);

  const isPaidEvent = Number(event?.amount || 0) > 0;

  const fetchEvent = useCallback(async () => {
    const res = await api.get(`/events/${id}`);
    setEvent(res.data);
  }, [id]);

  const fetchStream = useCallback(async () => {
    try {
      const s = await api.get(`/streams/${id}`);
      setStream(s.data);
    } catch (err) {
      setStream(null);
    }
  }, [id]);

  const fetchMyRegistration = useCallback(async () => {
    if (!token) {
      setRegistrationStatus({
        registered: false,
        paid: false,
        registration: null,
      });
      return;
    }

    try {
      const res = await api.get(`/events/${id}/my-registration`);
      setRegistrationStatus({
        registered: !!res.data.registered,
        paid: !!res.data.paid,
        registration: res.data.registration || null,
      });
    } catch (err) {
      console.error("Failed to fetch registration status", err);
      setRegistrationStatus({
        registered: false,
        paid: false,
        registration: null,
      });
    }
  }, [id, token]);

  const fetchAccess = useCallback(async () => {
    try {
      const a = await api.get(`/streams/${id}/access`);
      setAllowed(!!a.data.allowed);
      setAccessReason("");
    } catch (err) {
      setAllowed(false);
      setAccessReason(err.response?.data?.reason || "NOT_ALLOWED");
    }
  }, [id]);

  const getOrdinalDay = (day) => {
    if (day > 3 && day < 21) return `${day}th`;

    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return `${months[date.getMonth()]}/${getOrdinalDay(date.getDate())}/${date.getFullYear()}`;
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        await fetchEvent();
        await fetchStream();
        await fetchMyRegistration();
        await fetchAccess();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAll();
    }
  }, [id, fetchEvent, fetchStream, fetchMyRegistration, fetchAccess]);

  useEffect(() => {
    if (!id) return;
    fetchMyRegistration();
    fetchAccess();
  }, [id, token, fetchMyRegistration, fetchAccess]);

  if (loading) {
    return (
      <Box p={4} sx={{ textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return <Box p={3}>Event not found.</Box>;
  }

  const canAccessChat = !!user && !!token && (!isPaidEvent || registrationStatus.paid);

  const renderAccessMessage = () => {
    if (accessReason === "LOGIN_REQUIRED") {
      return <Typography>Please log in to access this paid live event.</Typography>;
    }

    if (accessReason === "NOT_REGISTERED") {
      return <Typography>Please register first to access this live stream.</Typography>;
    }

    if (accessReason === "PAYMENT_REQUIRED") {
      return <Typography>Please complete payment to access this live stream.</Typography>;
    }

    return <Typography>You do not have access to this live stream.</Typography>;
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h3" color="primary" gutterBottom>
        {event.title}
      </Typography>

      <img
        src={event.image || "https://images.unsplash.com/photo-1499083097717-a156f48c1c9d"}
        alt={event.title}
        style={{
          width: "100%",
          maxHeight: "320px",
          objectFit: "cover",
          borderRadius: 10,
        }}
      />

      <Typography variant="body1" sx={{ mt: 2 }}>
        Event Date: {formatEventDate(event.registrationDeadline)}
      </Typography>
      {isPaidEvent ? (
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Fee:</strong> ${event.amount}
        </Typography>
      ) : (
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Free event</strong>
        </Typography>
      )}

      <Typography variant="body1" sx={{ mt: 2 }}>
        {event.description}
      </Typography>

      {user && registrationStatus.registered && (
        <Box sx={{ mt: 3 }}>
          <Alert severity={registrationStatus.paid ? "success" : isPaidEvent ? "warning" : "success"}>
            {registrationStatus.paid
              ? "You are already registered and authorized for this event."
              : isPaidEvent
                ? "You are registered, but payment is still required."
                : "You are registered for this event."}
          </Alert>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Live Stream
        </Typography>

        {!stream?.isLive && <Typography>Not live yet.</Typography>}

        {stream?.isLive && stream?.streamUrl && (
          <>
            {allowed ? (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.15)",
                  mt: 1,
                }}
              >
                <iframe
                  title="Live Stream"
                  src={stream.streamUrl}
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Box>
            ) : (
              <Box sx={{ mt: 1 }}>{renderAccessMessage()}</Box>
            )}
          </>
        )}

        {stream?.isLive && !stream?.streamUrl && allowed && <LiveStream eventId={event.id} />}

        {stream?.isLive && !stream?.streamUrl && !allowed && (
          <Box sx={{ mt: 1 }}>{renderAccessMessage()}</Box>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        {!user ? (
          <Button variant="contained" color="secondary" onClick={() => navigate("/login")}>
            Log in to Register
          </Button>
        ) : registrationStatus.paid ? (
          <Button variant="contained" color="success" disabled>
            Already Paid
          </Button>
        ) : registrationStatus.registered && isPaidEvent ? (
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate(`/events/${event.id}/register`)}
          >
            Complete Payment
          </Button>
        ) : registrationStatus.registered && !isPaidEvent ? (
          <Button variant="contained" color="success" disabled>
            Already Registered
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/events/${event.id}/register`)}
          >
            Register
          </Button>
        )}
      </Box>

      {canAccessChat ? (
        <Box sx={{ mt: 4 }}>
          <Chat eventId={event.id} />
        </Box>
      ) : (
        <Typography sx={{ mt: 4 }}>
          {!user
            ? "Log in to participate in the chat."
            : isPaidEvent
              ? "Register and complete payment to join the chat for this paid event."
              : "Register to participate in the chat."}
        </Typography>
      )}
    </Box>
  );
};

export default EventDetails;