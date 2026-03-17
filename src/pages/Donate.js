import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../services/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Divider,
  ToggleButton,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

const stripePromise = loadStripe(
  "pk_test_51T3wOsPVXGHQl4MRKayCb9j8bJ5O7BejEo4YBWHPsRJSvXVCAxkODQBh5ycdjnyc71tl4JI9iUX0L6ie8tzYddFw00xPzGb6kU"
);

const steps = ["Amount & Type", "Your Details", "Payment"];

const COLORS = {
  bg: "#f8f5f0",
  bgSoft: "#f1ebe2",
  panel: "linear-gradient(180deg, #ffffff 0%, #fbf8f4 100%)",
  accent: "#8f7f88",
  accentHover: "#7e6f77",
  accentSoft: "rgba(143,127,136,0.10)",
  gold: "#c8a96b",
  goldHover: "#b99452",
  border: "rgba(88,72,94,0.12)",
  text: "#2f2a34",
  muted: "rgba(47,42,52,0.68)",
  iconBg: "#f4ede5",
  fieldBg: "#fcfaf7",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: COLORS.fieldBg,
    color: COLORS.text,
    "& fieldset": {
      borderColor: COLORS.border,
    },
    "&:hover fieldset": {
      borderColor: "rgba(200,169,107,0.55)",
    },
    "&.Mui-focused fieldset": {
      borderColor: COLORS.gold,
    },
  },
  "& .MuiInputLabel-root": {
    color: COLORS.muted,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: COLORS.accent,
  },
  "& .MuiFormHelperText-root": {
    color: COLORS.muted,
  },
  "& input": {
    color: COLORS.text,
  },
  "& textarea": {
    color: COLORS.text,
  },
};

const sectionCardSx = {
  borderRadius: 3,
  border: `1px solid ${COLORS.border}`,
  background: "rgba(255,255,255,0.88)",
  p: { xs: 2, md: 2.5 },
};

const AmountChip = ({ value, selected, onClick }) => (
  <ToggleButton
    value={value}
    selected={selected}
    onClick={() => onClick(value)}
    sx={{
      borderRadius: 999,
      px: 2.5,
      py: 1,
      textTransform: "none",
      fontWeight: 700,
      color: selected ? "#ffffff" : COLORS.text,
      borderColor: selected ? COLORS.accent : COLORS.border,
      backgroundColor: selected ? COLORS.accent : "#ffffff",
      "&:hover": {
        backgroundColor: selected ? COLORS.accentHover : "#f7f1ea",
        borderColor: selected ? COLORS.accentHover : "rgba(88,72,94,0.22)",
      },
    }}
  >
    ${value}
  </ToggleButton>
);

const DonorOption = ({ icon, title, subtitle }) => (
  <Stack direction="row" spacing={1.25} alignItems="center">
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        display: "grid",
        placeItems: "center",
        backgroundColor: COLORS.iconBg,
        color: COLORS.accent,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontWeight: 800, fontSize: 14, color: COLORS.text }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 12, color: COLORS.muted }}>
        {subtitle}
      </Typography>
    </Box>
  </Stack>
);

const DonationFormInner = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState(0);
  const [type, setType] = useState("individual");
  const [amount, setAmount] = useState(25);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    companyName: "",
    companyAddress: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [submitting, setSubmitting] = useState(false);

  const presetAmounts = [5, 10, 25, 50, 100];

  const isEmailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

  const canGoStep1 = amount >= 5 && ["individual", "corporate", "anonymous"].includes(type);

  const canGoStep2 = (() => {
    if (type === "anonymous") return true;
    if (!isEmailValid(form.email)) return false;
    if (type === "individual") return form.firstName.trim() && form.lastName.trim();
    if (type === "corporate") return form.companyName.trim();
    return false;
  })();

  const setField = (name) => (e) =>
    setForm((prev) => ({ ...prev, [name]: e.target.value }));

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleDonate = async () => {
    if (!stripe || !elements) return;

    setSubmitting(true);
    setMessage("");

    try {
      const piRes = await api.post("/donations/create-payment-intent", { amount });
      const clientSecret = piRes.data?.clientSecret;

      if (!clientSecret) throw new Error("Unable to initiate payment");

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setMessageType("error");
        setMessage(error.message || "Payment failed.");
        setSubmitting(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        await api.post("/donations", { type, amount, ...form });
        setMessageType("success");
        setMessage("Thank you for your donation! A receipt will be emailed to you.");
      } else {
        setMessageType("info");
        setMessage("Payment processing. Please check again later.");
      }
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage(err?.response?.data?.message || err.message || "Payment failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
        background: COLORS.panel,
        boxShadow: "0 18px 50px rgba(60,42,72,0.08)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          px: { xs: 2.5, md: 4 },
          py: { xs: 3, md: 4 },
          borderBottom: `1px solid ${COLORS.border}`,
          background:
            "linear-gradient(135deg, rgba(200,169,107,0.10) 0%, rgba(143,127,136,0.10) 100%)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              color: COLORS.gold,
              backgroundColor: "#fffaf1",
              border: "1px solid rgba(200,169,107,0.18)",
            }}
          >
            <VolunteerActivismOutlinedIcon />
          </Box>

          <Box>
            <Typography
              sx={{
                fontFamily: `"Georgia","Times New Roman",serif`,
                fontSize: { xs: 26, md: 34 },
                lineHeight: 1.15,
                color: COLORS.text,
              }}
            >
              One-Time Donation
            </Typography>
            <Typography sx={{ color: COLORS.muted, mt: 0.5, fontSize: 14 }}>
              Secure card payment with a calm and simple donation process.
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            mt: 3,
            "& .MuiStepLabel-label": {
              color: "rgba(47,42,52,0.45)",
              fontWeight: 600,
              fontSize: 13,
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: COLORS.accent,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: COLORS.text,
            },
            "& .MuiStepIcon-root": {
              color: "rgba(143,127,136,0.18)",
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: COLORS.gold,
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: COLORS.accent,
            },
            "& .MuiStepConnector-line": {
              borderColor: "rgba(88,72,94,0.10)",
            },
          }}
        >
          <Stepper activeStep={step} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 3, md: 4 } }}>
        {message && (
          <Alert severity={messageType} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {step === 0 && (
          <Stack spacing={3}>
            <Box sx={sectionCardSx}>
              <Typography sx={{ color: COLORS.text, fontWeight: 800, fontSize: 18, mb: 1.5 }}>
                Choose donation amount
              </Typography>
              <Typography sx={{ color: COLORS.muted, mb: 2 }}>
                Select a quick amount or enter a custom value.
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {presetAmounts.map((v) => (
                  <AmountChip key={v} value={v} selected={amount === v} onClick={setAmount} />
                ))}
              </Stack>

              <TextField
                label="Custom amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                fullWidth
                required
                inputProps={{ min: 5 }}
                helperText="Minimum donation is $5"
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: COLORS.gold }}>
                      $
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={sectionCardSx}>
              <Typography sx={{ color: COLORS.text, fontWeight: 800, fontSize: 18, mb: 1.5 }}>
                Donor type
              </Typography>

              <RadioGroup value={type} onChange={(e) => setType(e.target.value)}>
                <FormControlLabel
                  value="individual"
                  control={
                    <Radio
                      sx={{
                        color: "rgba(47,42,52,0.28)",
                        "&.Mui-checked": { color: COLORS.gold },
                      }}
                    />
                  }
                  sx={{
                    m: 0,
                    px: 1.2,
                    py: 1.25,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: type === "individual" ? COLORS.accentSoft : "transparent",
                    mb: 1.25,
                  }}
                  label={
                    <DonorOption
                      icon={<PersonOutlineIcon fontSize="small" />}
                      title="Individual"
                      subtitle="Personal donation with receipt"
                    />
                  }
                />

                <FormControlLabel
                  value="corporate"
                  control={
                    <Radio
                      sx={{
                        color: "rgba(47,42,52,0.28)",
                        "&.Mui-checked": { color: COLORS.gold },
                      }}
                    />
                  }
                  sx={{
                    m: 0,
                    px: 1.2,
                    py: 1.25,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: type === "corporate" ? COLORS.accentSoft : "transparent",
                    mb: 1.25,
                  }}
                  label={
                    <DonorOption
                      icon={<BusinessOutlinedIcon fontSize="small" />}
                      title="Corporate"
                      subtitle="Company donation with company details"
                    />
                  }
                />

                <FormControlLabel
                  value="anonymous"
                  control={
                    <Radio
                      sx={{
                        color: "rgba(47,42,52,0.28)",
                        "&.Mui-checked": { color: COLORS.gold },
                      }}
                    />
                  }
                  sx={{
                    m: 0,
                    px: 1.2,
                    py: 1.25,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: type === "anonymous" ? COLORS.accentSoft : "transparent",
                  }}
                  label={
                    <DonorOption
                      icon={<VisibilityOffOutlinedIcon fontSize="small" />}
                      title="Anonymous"
                      subtitle="No tax receipt will be issued"
                    />
                  }
                />
              </RadioGroup>
            </Box>

            <Stack direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={next}
                disabled={!canGoStep1}
                sx={{
                  borderRadius: 999,
                  px: 3,
                  py: 1.15,
                  textTransform: "none",
                  fontWeight: 800,
                  backgroundColor: COLORS.gold,
                  color: COLORS.text,
                  "&:hover": { backgroundColor: COLORS.goldHover },
                }}
              >
                Continue
              </Button>
            </Stack>
          </Stack>
        )}

        {step === 1 && (
          <Stack spacing={3}>
            <Box sx={sectionCardSx}>
              <Typography sx={{ color: COLORS.text, fontWeight: 800, fontSize: 18, mb: 1.5 }}>
                Your details
              </Typography>

              {type === "anonymous" && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Anonymous donations will not receive a tax receipt.
                </Alert>
              )}

              {type === "individual" && (
                <Stack spacing={2}>
                  <TextField
                    label="First name"
                    value={form.firstName}
                    onChange={setField("firstName")}
                    required
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: COLORS.accent }}>
                          <BadgeOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Last name"
                    value={form.lastName}
                    onChange={setField("lastName")}
                    required
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: COLORS.accent }}>
                          <PersonOutlineIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Email"
                    value={form.email}
                    onChange={setField("email")}
                    required
                    type="email"
                    error={form.email && !isEmailValid(form.email)}
                    helperText={
                      form.email && !isEmailValid(form.email)
                        ? "Enter a valid email address"
                        : "Receipt will be sent to this email"
                    }
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: COLORS.accent }}>
                          <EmailOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Address (optional)"
                    value={form.address}
                    onChange={setField("address")}
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: COLORS.accent }}>
                          <LocationOnOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              )}

              {type === "corporate" && (
                <Stack spacing={2}>
                  <TextField
                    label="Registered company name"
                    value={form.companyName}
                    onChange={setField("companyName")}
                    required
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: COLORS.accent }}>
                          <BusinessOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Email"
                    value={form.email}
                    onChange={setField("email")}
                    required
                    type="email"
                    error={form.email && !isEmailValid(form.email)}
                    helperText={
                      form.email && !isEmailValid(form.email)
                        ? "Enter a valid email address"
                        : "Receipt will be sent to this email"
                    }
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: COLORS.accent }}>
                          <EmailOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Registered address (optional)"
                    value={form.companyAddress}
                    onChange={setField("companyAddress")}
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: COLORS.accent }}>
                          <LocationOnOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              )}
            </Box>

            <Stack direction="row" justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={back}
                sx={{
                  borderRadius: 999,
                  px: 3,
                  py: 1.1,
                  textTransform: "none",
                  fontWeight: 800,
                  borderColor: COLORS.border,
                  color: COLORS.text,
                  "&:hover": {
                    borderColor: COLORS.accent,
                    backgroundColor: "rgba(143,127,136,0.06)",
                  },
                }}
              >
                Back
              </Button>

              <Button
                variant="contained"
                onClick={next}
                disabled={!canGoStep2}
                sx={{
                  borderRadius: 999,
                  px: 3,
                  py: 1.15,
                  textTransform: "none",
                  fontWeight: 800,
                  backgroundColor: COLORS.gold,
                  color: COLORS.text,
                  "&:hover": { backgroundColor: COLORS.goldHover },
                }}
              >
                Continue
              </Button>
            </Stack>
          </Stack>
        )}

        {step === 2 && (
          <Stack spacing={3}>
            <Box sx={sectionCardSx}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <LockOutlinedIcon sx={{ color: COLORS.gold }} fontSize="small" />
                <Typography sx={{ color: COLORS.text, fontWeight: 800, fontSize: 18 }}>
                  Secure payment
                </Typography>
              </Stack>

              <Typography sx={{ color: COLORS.muted, fontSize: 14, mb: 2 }}>
                Enter your card details below. Payment is processed securely by Stripe.
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  border: `1px solid ${COLORS.border}`,
                  backgroundColor: COLORS.fieldBg,
                }}
              >
                <CardElement
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: {
                        color: COLORS.text,
                        fontSize: "16px",
                        fontFamily: "Arial, sans-serif",
                        "::placeholder": {
                          color: "rgba(47,42,52,0.45)",
                        },
                      },
                      invalid: {
                        color: "#d32f2f",
                      },
                    },
                  }}
                />
              </Paper>

              <Divider sx={{ my: 2, borderColor: COLORS.border }} />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Button
                  variant="outlined"
                  onClick={back}
                  disabled={submitting}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    py: 1.1,
                    textTransform: "none",
                    fontWeight: 800,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                    "&:hover": {
                      borderColor: COLORS.accent,
                      backgroundColor: "rgba(143,127,136,0.06)",
                    },
                  }}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  onClick={handleDonate}
                  disabled={!stripe || !elements || submitting || amount < 5}
                  sx={{
                    borderRadius: 999,
                    px: 3.2,
                    py: 1.15,
                    textTransform: "none",
                    fontWeight: 900,
                    backgroundColor: COLORS.gold,
                    color: COLORS.text,
                    "&:hover": { backgroundColor: COLORS.goldHover },
                  }}
                >
                  {submitting ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} sx={{ color: COLORS.text }} />
                      <span>Processing...</span>
                    </Stack>
                  ) : (
                    `Donate $${amount}`
                  )}
                </Button>
              </Stack>

              <Typography sx={{ mt: 2, fontSize: 12, color: COLORS.muted }}>
                Your donation supports temple activities, community programs, and spiritual services.
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

const Donate = () => {
  return (
    <Elements stripe={stripePromise}>
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          py: { xs: 5, md: 7 },
          px: 2,
          background: `
            radial-gradient(circle at 15% 10%, rgba(200,169,107,0.08) 0%, rgba(200,169,107,0) 30%),
            radial-gradient(circle at 85% 12%, rgba(143,127,136,0.08) 0%, rgba(143,127,136,0) 30%),
            linear-gradient(180deg, #faf7f2 0%, #f3eee7 100%)
          `,
        }}
      >
        <Box sx={{ maxWidth: 980, mx: "auto" }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              sx={{
                fontFamily: `"Georgia","Times New Roman",serif`,
                fontSize: { xs: 34, md: 52 },
                color: COLORS.text,
                lineHeight: 1.12,
                mb: 1.2,
              }}
            >
              Support Our Mission
            </Typography>

            <Typography
              sx={{
                color: COLORS.muted,
                maxWidth: 720,
                mx: "auto",
                lineHeight: 1.8,
                fontSize: { xs: 15, md: 16 },
              }}
            >
              Your generosity helps us continue teachings, events, and community support.
              Make a one-time donation securely and help sustain the work of the temple.
            </Typography>
          </Box>

          <DonationFormInner />
        </Box>
      </Box>
    </Elements>
  );
};

export default Donate;