import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setError('');
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setLoading(false);
    }
  }, [user]);

  const handleRespond = async (notifId, bookingId, responseStatus) => {
    try {
      await api.put(`/dana/${bookingId}/respond`, { status: responseStatus });
      await api.put(`/notifications/${notifId}/read`);
      await fetchNotifications();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit your response');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      await fetchNotifications();
    } catch (err) {
      console.error(err);
      setError('Failed to mark as read');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f0726', py: 6, px: 2 }}>
      <Box sx={{ maxWidth: 900, mx: 'auto', color: 'white' }}>
        <Typography sx={{ fontFamily: '"Georgia","Times New Roman",serif', fontSize: { xs: 28, md: 42 }, mb: 3 }}>
          Notifications
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Typography>Loading...</Typography>
        ) : notifications.length === 0 ? (
          <Typography>No notifications.</Typography>
        ) : (
          notifications.map((notif) => {
            const booking = notif.DanaBooking;
            const canRespond =
              booking &&
              booking.requestStatus === 'pending' &&
              booking.userId === user?.id;

            return (
              <Card
                key={notif.id}
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: 'white',
                }}
              >
                <CardContent>
                  <Typography sx={{ fontSize: 16 }}>{notif.message}</Typography>
                  {booking && (
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
                      {booking.mealType} - {new Date(booking.date).toLocaleDateString()} - request status: {booking.requestStatus}
                    </Typography>
                  )}
                  {booking?.requestMessage && (
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 1 }}>
                      Request message: {booking.requestMessage}
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  {canRespond && (
                    <>
                      <Button
                        size="small"
                        onClick={() => handleRespond(notif.id, booking.id, 'approved')}
                        sx={{ color: '#f0c34a' }}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleRespond(notif.id, booking.id, 'declined')}
                        sx={{ color: '#f0c34a' }}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {!notif.isRead && (
                    <Button size="small" onClick={() => handleMarkRead(notif.id)} sx={{ color: '#8c5aff' }}>
                      Mark as read
                    </Button>
                  )}
                </CardActions>
              </Card>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default Notifications;
