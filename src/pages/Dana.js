import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

const Dana = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [mealType, setMealType] = useState("breakfast");
  const [requestMessage, setRequestMessage] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const { user } = useContext(AuthContext);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/dana/calendar");
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const buildCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const weeks = [];
    const current = new Date(firstDayOfMonth);

    current.setDate(current.getDate() - current.getDay());

    while (current <= lastDayOfMonth || current.getDay() !== 0) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
      if (current > lastDayOfMonth && current.getDay() === 0) break;
    }

    return weeks;
  };

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const weeks = buildCalendar();

  const getBookingsForDate = (dateObj) => {
    const yyyyMmDd = dateObj.toISOString().substring(0, 10);
    return bookings.filter((b) => b.date.substring(0, 10) === yyyyMmDd);
  };

  const selectedBooking = useMemo(() => {
    if (!selectedDate) return null;

    return (
      bookings.find(
        (b) =>
          b.date.substring(0, 10) === selectedDate &&
          b.mealType === mealType
      ) || null
    );
  }, [bookings, selectedDate, mealType]);

  const handleDateClick = (dateObj) => {
    if (dateObj.getMonth() !== currentMonth.getMonth()) return;

    const yyyyMmDd = dateObj.toISOString().substring(0, 10);

    setSelectedDate(yyyyMmDd);
    setMealType("breakfast");
    setRequestMessage("");
    setAddress("");
    setPhone("");
    setRecurring(false);
    setRecurrenceType("");
    setError("");
    setMessage("");
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedDate(null);
    setMealType("breakfast");
    setRequestMessage("");
    setAddress("");
    setPhone("");
    setRecurring(false);
    setRecurrenceType("");
    setError("");
  };

  const getBookingRelation = (booking) => {
    if (!booking) return "free";
    if (!user) return "other-booked";

    if (booking.userId === user.id && booking.requestStatus === "pending") {
      return "my-booking-request-pending";
    }

    if (booking.userId === user.id) {
      return "my-booking";
    }

    if (booking.requestUserId === user.id && booking.requestStatus === "pending") {
      return "my-request-pending";
    }

    return "other-booked";
  };

  const getChipStyle = (booking) => {
    const relation = getBookingRelation(booking);

    if (relation === "my-booking") {
      return { backgroundColor: "rgba(76, 175, 80, 0.9)", color: "#08120a" };
    }

    if (relation === "my-booking-request-pending") {
      return { backgroundColor: "rgba(255, 152, 0, 0.95)", color: "#1f1200" };
    }

    if (relation === "my-request-pending") {
      return { backgroundColor: "rgba(33, 150, 243, 0.95)", color: "#05101a" };
    }

    return booking?.mealType === "breakfast"
      ? { backgroundColor: "rgba(240,195,74,0.85)", color: "#1b0a3b" }
      : { backgroundColor: "rgba(140,90,255,0.85)", color: "#ffffff" };
  };

  const getActionText = () => {
    const booking = selectedBooking;
    const relation = getBookingRelation(booking);

    if (!booking) return "This slot is free. You can book it.";
    if (relation === "my-booking") return "This is your booked Dana slot.";
    if (relation === "my-booking-request-pending") {
      return "Another user requested this slot from you. Check Notifications.";
    }
    if (relation === "my-request-pending") {
      return "You already requested this slot. Wait for the booked user to accept or reject.";
    }

    return "This slot is already booked by another user. You can send a request to that user.";
  };

  const canSubmit = () => {
    if (!selectedDate || !user) return false;

    const relation = getBookingRelation(selectedBooking);

    if (relation === "my-booking") return false;
    if (relation === "my-request-pending") return false;
    if (relation === "my-booking-request-pending") return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setError("Please select a date from the calendar.");
      return;
    }

    if (!user) {
      setError("Please log in first.");
      return;
    }

    const booking = selectedBooking;
    const relation = getBookingRelation(booking);

    if (relation === "my-booking") {
      setError("This date is already booked by you.");
      return;
    }

    if (relation === "my-request-pending") {
      setError("You already requested this date.");
      return;
    }

    if (relation === "my-booking-request-pending") {
      setError("There is already a pending request on your booking. Check Notifications.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter your physical address.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    if (relation === "other-booked" && !requestMessage.trim()) {
      setError("Please write a request message to the booked user.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await api.post("/dana", {
        date: selectedDate,
        mealType,
        recurring,
        recurrenceType: recurring ? recurrenceType : null,
        requestMessage,
        address,
        phone,
      });

      setMessage(res.data?.message || "Done successfully.");
      await fetchBookings();
      closeModal();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#0f0726", minHeight: "100vh", py: 6, px: 2 }}>
      <Box sx={{ maxWidth: 960, mx: "auto", color: "white" }}>
        <Typography
          sx={{
            fontFamily: `"Georgia","Times New Roman",serif`,
            fontSize: { xs: 28, md: 42 },
            mb: 2,
          }}
        >
          Dana Booking Calendar
        </Typography>

        <Typography sx={{ mb: 3, color: "rgba(255,255,255,0.75)" }}>
          Green means your booking. Blue means your request is pending. Orange means someone requested your booked date. Yellow/purple means booked by another user.
        </Typography>

        {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}
        {error && !openModal && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
              )
            }
            sx={{ color: "#f0c34a" }}
          >
            Prev
          </Button>

          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>{monthName}</Typography>

          <Button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
              )
            }
            sx={{ color: "#f0c34a" }}
          >
            Next
          </Button>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            borderTop: "1px solid rgba(255,255,255,0.2)",
            borderLeft: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Box
              key={day}
              sx={{
                textAlign: "center",
                py: 1,
                fontWeight: 600,
                borderRight: "1px solid rgba(255,255,255,0.2)",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {day}
            </Box>
          ))}

          {weeks.map((week, wi) => (
            <React.Fragment key={wi}>
              {week.map((dateObj, di) => {
                const inCurrentMonth = dateObj.getMonth() === currentMonth.getMonth();
                const dayBookings = getBookingsForDate(dateObj);

                return (
                  <Box
                    key={di}
                    onClick={() => handleDateClick(dateObj)}
                    sx={{
                      minHeight: 95,
                      borderRight: "1px solid rgba(255,255,255,0.2)",
                      borderBottom: "1px solid rgba(255,255,255,0.2)",
                      p: 0.5,
                      cursor: inCurrentMonth ? "pointer" : "default",
                      backgroundColor: !inCurrentMonth
                        ? "rgba(255,255,255,0.05)"
                        : "transparent",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: inCurrentMonth ? "#ffffff" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {dateObj.getDate()}
                    </Typography>

                    {dayBookings.map((b) => (
                      <Box
                        key={b.id}
                        sx={{
                          mt: 0.5,
                          px: 0.7,
                          py: 0.25,
                          borderRadius: 0.75,
                          fontSize: 10,
                          fontWeight: 700,
                          ...getChipStyle(b),
                        }}
                      >
                        {b.mealType === "breakfast" ? "Breakfast" : "Lunch"}
                      </Box>
                    ))}
                  </Box>
                );
              })}
            </React.Fragment>
          ))}
        </Box>

        <Dialog
          open={openModal}
          onClose={closeModal}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              backgroundColor: "#1b0a3b",
              color: "white",
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle sx={{ fontFamily: `"Georgia","Times New Roman",serif` }}>
            Dana action for {selectedDate}
          </DialogTitle>

          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {error && <Alert severity="error">{error}</Alert>}

              <FormControl fullWidth>
                <InputLabel id="meal-type-label" sx={{ color: "rgba(255,255,255,0.75)" }}>
                  Meal
                </InputLabel>
                <Select
                  labelId="meal-type-label"
                  value={mealType}
                  label="Meal"
                  onChange={(e) => setMealType(e.target.value)}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.92)",
                    borderRadius: 1,
                  }}
                >
                  <MenuItem value="breakfast">Breakfast</MenuItem>
                  <MenuItem value="lunch">Lunch</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Physical Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                required
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "rgba(255,255,255,0.92)",
                  },
                }}
              />

              <TextField
                label="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                required
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "rgba(255,255,255,0.92)",
                  },
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                    sx={{ color: "#f0c34a" }}
                  />
                }
                label="Recurring booking"
              />

              {recurring && (
                <FormControl fullWidth>
                  <InputLabel
                    id="recurrence-type-label"
                    sx={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    Recurrence Type
                  </InputLabel>
                  <Select
                    labelId="recurrence-type-label"
                    value={recurrenceType}
                    label="Recurrence Type"
                    onChange={(e) => setRecurrenceType(e.target.value)}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.92)",
                      borderRadius: 1,
                    }}
                  >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              )}

              <Typography sx={{ color: "rgba(255,255,255,0.82)", fontSize: 15 }}>
                {getActionText()}
              </Typography>

              {selectedBooking &&
                getBookingRelation(selectedBooking) === "other-booked" && (
                  <TextField
                    label="Request message to booked user"
                    multiline
                    minRows={3}
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Example: Can I take this date and meal? You can book another date."
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: "rgba(255,255,255,0.92)",
                      },
                    }}
                  />
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={closeModal}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: 999,
                  px: 3,
                  py: 1.1,
                  fontWeight: 700,
                  borderColor: "#f0c34a",
                  color: "#f0c34a",
                  "&:hover": { borderColor: "#ffd36a", color: "#ffd36a" },
                }}
              >
                Cancel
              </Button>

              {user ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || !canSubmit()}
                  sx={{
                    textTransform: "none",
                    borderRadius: 999,
                    px: 3,
                    py: 1.1,
                    fontWeight: 700,
                    backgroundColor: "#f0c34a",
                    color: "#1b0a3b",
                    "&:hover": { backgroundColor: "#ffd36a" },
                  }}
                >
                  {submitting
                    ? "Submitting..."
                    : selectedBooking
                      ? getBookingRelation(selectedBooking) === "other-booked"
                        ? "Send Request"
                        : "Unavailable"
                      : "Book Dana"}
                </Button>
              ) : null}
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Dana;