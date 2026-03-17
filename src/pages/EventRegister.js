import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Divider,
    CircularProgress,
    Stack,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { AuthContext } from "../contexts/AuthContext";

const stripePromise = loadStripe(
    "pk_test_51T3wOsPVXGHQl4MRKayCb9j8bJ5O7BejEo4YBWHPsRJSvXVCAxkODQBh5ycdjnyc71tl4JI9iUX0L6ie8tzYddFw00xPzGb6kU"
);

const EventRegisterInner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [registrationStatus, setRegistrationStatus] = useState({
        registered: false,
        paid: false,
        registration: null,
    });

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        address: "",
        additionalInfo: "",
    });

    const [registrationSaved, setRegistrationSaved] = useState(false);
    const [submittingRegistration, setSubmittingRegistration] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const isPaidEvent = useMemo(() => Number(event?.amount || 0) > 0, [event]);

    const loadEvent = async () => {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
    };

    const loadMyRegistration = async () => {
        try {
            const res = await api.get(`/events/${id}/my-registration`);
            const data = {
                registered: !!res.data.registered,
                paid: !!res.data.paid,
                registration: res.data.registration || null,
            };

            setRegistrationStatus(data);

            if (data.registration) {
                setForm({
                    firstName: data.registration.firstName || "",
                    lastName: data.registration.lastName || "",
                    email: data.registration.email || "",
                    telephone: data.registration.telephone || "",
                    address: data.registration.address || "",
                    additionalInfo: data.registration.additionalInfo || "",
                });
                setRegistrationSaved(!!data.registered);
            } else if (user) {
                setForm((prev) => ({
                    ...prev,
                    firstName: user.firstName || prev.firstName || "",
                    lastName: user.lastName || prev.lastName || "",
                    email: user.email || prev.email || "",
                }));
            }
        } catch (err) {
            console.error("Failed to load registration status", err);
            if (user) {
                setForm((prev) => ({
                    ...prev,
                    firstName: user.firstName || prev.firstName || "",
                    lastName: user.lastName || prev.lastName || "",
                    email: user.email || prev.email || "",
                }));
            }
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                setCheckingStatus(true);
                await loadEvent();
                await loadMyRegistration();
            } catch (err) {
                console.error(err);
            } finally {
                setCheckingStatus(false);
            }
        };

        init();
    }, [id]);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const refreshStatus = async () => {
        await loadMyRegistration();
    };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        setSubmittingRegistration(true);
        setMessage("");

        try {
            const res = await api.post(`/events/${id}/register`, form);

            setRegistrationSaved(true);
            await refreshStatus();

            if (res.data?.requiresPayment) {
                setMessageType("info");
                setMessage("Registration saved. Please complete payment below.");
            } else {
                setMessageType("success");
                setMessage("Registration successful.");
            }
        } catch (err) {
            console.error(err);
            setMessageType("error");
            setMessage(err.response?.data?.message || "Failed to register for event.");
        } finally {
            setSubmittingRegistration(false);
        }
    };

    const handlePayment = async () => {
        if (!stripe || !elements) return;

        setProcessingPayment(true);
        setMessage("");

        try {
            const piRes = await api.post(`/events/${id}/create-payment-intent`);
            const clientSecret = piRes.data?.clientSecret;

            if (!clientSecret) {
                throw new Error("Unable to start payment.");
            }

            const cardElement = elements.getElement(CardElement);

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: `${form.firstName} ${form.lastName}`.trim(),
                        email: form.email,
                    },
                },
            });

            if (error) {
                setMessageType("error");
                setMessage(error.message || "Payment failed.");
                setProcessingPayment(false);
                return;
            }

            if (paymentIntent?.status === "succeeded") {
                await api.post(`/events/${id}/confirm-payment`, {
                    paymentIntentId: paymentIntent.id,
                });

                await refreshStatus();

                setMessageType("success");
                setMessage("Payment successful. You are now authorized for this event.");
            } else {
                setMessageType("warning");
                setMessage("Payment is not completed yet.");
            }
        } catch (err) {
            console.error(err);
            setMessageType("error");
            setMessage(err.response?.data?.message || err.message || "Payment failed.");
        } finally {
            setProcessingPayment(false);
        }
    };

    if (checkingStatus || !event) {
        return (
            <Box p={4} sx={{ textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (registrationStatus.paid) {
        return (
            <Box sx={{ maxWidth: 720, mx: "auto", p: 3 }}>
                <Paper sx={{ p: 3 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                        You already paid for this event.
                    </Alert>

                    <Typography variant="h5" gutterBottom>
                        {event.title}
                    </Typography>

                    <Typography sx={{ mb: 3 }}>
                        Your payment is already confirmed. You can go back to the event page.
                    </Typography>

                    <Button variant="contained" onClick={() => navigate(`/events/${id}`)}>
                        Back to Event
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 720, mx: "auto", p: 3 }}>
            <Typography variant="h4" color="primary" gutterBottom>
                Register for {event.title}
            </Typography>

            {isPaidEvent ? (
                <Typography sx={{ mb: 2 }}>
                    This is a paid event. Fee: <strong>${event.amount}</strong>
                </Typography>
            ) : (
                <Typography sx={{ mb: 2 }}>
                    This is a free event.
                </Typography>
            )}

            {message && (
                <Alert severity={messageType} sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Registration Details
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleRegistrationSubmit}
                    sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        label="Telephone"
                        name="telephone"
                        value={form.telephone}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Additional Info"
                        name="additionalInfo"
                        value={form.additionalInfo}
                        onChange={handleChange}
                        multiline
                        rows={3}
                    />

                    <Stack direction="row" spacing={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            disabled={submittingRegistration}
                        >
                            {submittingRegistration ? "Saving..." : registrationSaved ? "Update Registration" : "Submit Registration"}
                        </Button>

                        <Button variant="outlined" onClick={() => navigate(`/events/${id}`)}>
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {isPaidEvent && registrationSaved && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Payment
                    </Typography>

                    <Typography sx={{ mb: 2 }}>
                        Complete the payment to unlock this event.
                    </Typography>

                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid rgba(0,0,0,0.15)",
                            borderRadius: 2,
                            mb: 2,
                            backgroundColor: "#fff",
                        }}
                    >
                        <CardElement options={{ hidePostalCode: true }} />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handlePayment}
                            disabled={!stripe || !elements || processingPayment}
                        >
                            {processingPayment ? "Processing..." : `Pay $${event.amount}`}
                        </Button>

                        <Button variant="outlined" onClick={() => navigate(`/events/${id}`)}>
                            Back to Event
                        </Button>
                    </Stack>
                </Paper>
            )}

            {!isPaidEvent && registrationSaved && (
                <Paper sx={{ p: 3 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Registration complete.
                    </Alert>

                    <Button variant="contained" onClick={() => navigate(`/events/${id}`)}>
                        Back to Event
                    </Button>
                </Paper>
            )}
        </Box>
    );
};

const EventRegister = () => {
    return (
        <Elements stripe={stripePromise}>
            <EventRegisterInner />
        </Elements>
    );
};

export default EventRegister;