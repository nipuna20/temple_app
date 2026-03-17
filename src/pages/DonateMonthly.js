import React, { useState, useContext } from "react";
import { Box, Typography, TextField, Button, MenuItem, Alert } from "@mui/material";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Monthly donation page
 *
 * Allows logged‑in users to set up a recurring donation. Users can choose
 * a donation amount and a frequency (daily, bi‑weekly, bi‑monthly,
 * monthly or yearly). After submission the plan is created in the backend
 * via POST /monthly. This page checks that a user is authenticated and
 * displays an informational message if not.
 */
const DonateMonthly = () => {
  const { user, token } = useContext(AuthContext);
  const [amount, setAmount] = useState(10);
  const [frequency, setFrequency] = useState("monthly");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!token || !user) {
    return (
      <Box sx={{ backgroundColor: "#0f0726", minHeight: "100vh", py: 6, px: 2, color: "white" }}>
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          <Typography sx={{ fontSize: { xs: 24, md: 32 }, mb: 2, fontFamily: `"Georgia","Times New Roman",serif` }}>
            Monthly Donation
          </Typography>
          <Alert severity="info">Please log in to set up a recurring donation.</Alert>
        </Box>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!amount || amount < 5) {
      setError("Amount must be at least $5.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/monthly", { amount, frequency });
      setMessage("Your recurring donation has been created. Thank you for your support!");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to create recurring donation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#0f0726", minHeight: "100vh", py: 6, px: 2 }}>
      <Box sx={{ maxWidth: 800, mx: "auto", color: "white" }}>
        <Typography sx={{ fontFamily: `"Georgia","Times New Roman",serif`, fontSize: { xs: 28, md: 42 }, mb: 2 }}>
          Monthly Donation
        </Typography>
        <Typography sx={{ mb: 3, color: "rgba(255,255,255,0.75)" }}>
          Set up a recurring donation to help sustain our programs year‑round. You can change or cancel your plan at any time.
        </Typography>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Donation amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            inputProps={{ min: 5 }}
            sx={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 1 }}
            InputProps={{ startAdornment: <span style={{ marginRight: 4 }}>$</span> }}
          />
          <TextField
            select
            label="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            required
            sx={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 1 }}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="bi-weekly">Bi‑Weekly</MenuItem>
            <MenuItem value="bi-monthly">Bi‑Monthly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </TextField>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ alignSelf: "flex-start", textTransform: "none", borderRadius: 999, px: 3, py: 1.2, fontWeight: 700, backgroundColor: "#f0c34a", color: "#1b0a3b", '&:hover': { backgroundColor: '#ffd36a' } }}
          >
            {submitting ? "Submitting…" : `Donate $${amount} ${frequency}`}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DonateMonthly;