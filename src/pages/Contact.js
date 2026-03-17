import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Stack,
  Skeleton,
} from "@mui/material";

const BG = "#17003a";
const HEADING = "#f2ebff";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.76)";
const LINE = "rgba(255,255,255,0.88)";

const IMAGES = {
  volunteer:
    "https://overatours.com/wp-content/uploads/2024/05/Must-see-Buddhist-Temples-in-Sri-Lanka.jpg",
  member:
    "https://i.pinimg.com/736x/ca/cb/28/cacb28d8091cc51118c0fbc426b34c1b.jpg",
};

const FALLBACKS = {
  volunteerTitle: "Become a Volunteer",
  volunteerSubtitle: "Kindness and Compassion",
  volunteerText:
    "I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you.",
  donationTitle: "Make a Donation",
  donationText:
    "I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I'm a great place for you to tell a story and let your users know a little more about you.",
  memberTitle: "Become a Temple Member",
  memberSubtitle: "Blessed with Community",
  memberText:
    "I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you.",
};

const splitParagraphs = (text, fallback = "") => {
  const finalText = text && text.trim() ? text.trim() : fallback;
  return finalText.split(/\n\s*\n/).filter(Boolean);
};

const Paragraphs = ({ text, fallback, align = "left" }) => {
  const paragraphs = splitParagraphs(text, fallback);

  return (
    <Stack spacing={3}>
      {paragraphs.map((para, index) => (
        <Typography
          key={index}
          sx={{
            color: TEXT,
            fontSize: { xs: "1rem", md: "1.08rem" },
            lineHeight: 1.95,
            textAlign: align,
          }}
        >
          {para}
        </Typography>
      ))}
    </Stack>
  );
};

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 7, md: 10 },
        mb: { xs: 4, md: 6 },
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
            fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
            color: "rgba(255,255,255,0.96)",
            fontSize: { xs: 38, md: 58 },
            lineHeight: 1.05,
            mb: 1,
          }}
        >
          Contact & Support
        </Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.76)",
            maxWidth: 760,
            lineHeight: 1.9,
            fontSize: { xs: 15, md: 17 },
          }}
        >
          We’re here to help. Reach us for temple visits, donations, volunteering, membership,
          and general inquiries.
        </Typography>
      </Container>
    </Box>
  );
};

const SplitSection = ({
  title,
  subtitle,
  text,
  fallback,
  image,
  reverse = false,
  minHeight = 620,
}) => {
  return (
    <Container maxWidth="xl" sx={{ mb: { xs: 5, md: 8 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          backgroundColor: BG,
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            order: { xs: 2, md: reverse ? 2 : 1 },
            display: "flex",
            alignItems: "center",
            px: { xs: 3, sm: 4, md: 8, lg: 10 },
            py: { xs: 5, md: 7 },
            minHeight: { xs: "auto", md: minHeight },
          }}
        >
          <Box sx={{ maxWidth: 620 }}>
            <Typography
              sx={{
                fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
                color: HEADING,
                fontSize: { xs: "2.6rem", md: "4.1rem" },
                lineHeight: 1,
                mb: 4,
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>

            {subtitle ? (
              <Typography
                sx={{
                  color: "#ffffff",
                  fontSize: { xs: "1.25rem", md: "1.95rem" },
                  lineHeight: 1.35,
                  mb: 4,
                }}
              >
                {subtitle}
              </Typography>
            ) : null}

            <Paragraphs text={text} fallback={fallback} />
          </Box>
        </Box>

        <Box
          sx={{
            order: { xs: 1, md: reverse ? 1 : 2 },
            minHeight: { xs: 360, md: minHeight },
          }}
        >
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: "100%",
              height: "100%",
              minHeight: { xs: 360, md: minHeight },
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

const BrushCircle = () => {
  return (
    <Box
      sx={{
        width: { xs: 110, md: 140 },
        height: { xs: 110, md: 140 },
        borderRadius: "50%",
        border: "12px solid rgba(215,203,241,0.92)",
        borderLeftColor: "transparent",
        borderBottomColor: "transparent",
        transform: "rotate(35deg)",
        mx: "auto",
        mb: { xs: 4, md: 5 },
      }}
    />
  );
};

const DonateSection = ({ title, text }) => {
  return (
    <Container maxWidth="xl" sx={{ mb: { xs: 5, md: 8 } }}>
      <Box
        sx={{
          backgroundColor: BG,
          textAlign: "center",
          py: { xs: 7, md: 10 },
          px: { xs: 3, md: 6 },
        }}
      >
        <BrushCircle />

        <Typography
          sx={{
            fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
            color: HEADING,
            fontSize: { xs: "2.7rem", md: "4rem" },
            lineHeight: 1,
            mb: 4,
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ maxWidth: 980, mx: "auto", mb: 5 }}>
          <Paragraphs text={text} fallback={FALLBACKS.donationText} align="center" />
        </Box>

        <Button
          variant="contained"
          href="#contact-form"
          sx={{
            backgroundColor: "#ece9ef",
            color: BG,
            borderRadius: 0,
            px: 4,
            py: 1.2,
            textTransform: "none",
            fontSize: { xs: 18, md: 20 },
            fontWeight: 400,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#ffffff",
              boxShadow: "none",
            },
          }}
        >
          Donate
        </Button>
      </Box>
    </Container>
  );
};

const ContactHoursSection = ({ info }) => {
  const hours =
    Array.isArray(info?.openingHours) && info.openingHours.length
      ? info.openingHours
      : [
        "Daily: 9:00 AM - 4:00 PM",
        "Weekends: 7:00 AM - 6:00 PM",
        "Lunch Service: 11:00 AM - 3:00 PM",
      ];

  return (
    <Container maxWidth="xl" sx={{ mb: { xs: 5, md: 8 } }}>
      <Box
        sx={{
          backgroundColor: BG,
          textAlign: "center",
          px: { xs: 3, md: 6 },
          py: { xs: 7, md: 9 },
        }}
      >
        <Typography
          sx={{
            fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
            color: HEADING,
            fontSize: { xs: "2.7rem", md: "4rem" },
            lineHeight: 1,
            mb: 5,
            fontWeight: 500,
          }}
        >
          Contact & Opening Hours
        </Typography>

        <Stack spacing={1} sx={{ mb: 6 }}>
          {hours.map((item, index) => (
            <Typography
              key={index}
              sx={{
                color: "#ffffff",
                fontSize: { xs: "1.1rem", md: "1.65rem" },
                lineHeight: 1.5,
              }}
            >
              {item}
            </Typography>
          ))}
        </Stack>

        <Stack spacing={1}>
          <Typography
            sx={{
              color: "#ffffff",
              fontSize: { xs: "1.1rem", md: "1.6rem" },
              lineHeight: 1.5,
            }}
          >
            Phone: {info?.phone || "123-456-7890"}
          </Typography>

          <Typography
            sx={{
              color: "#ffffff",
              fontSize: { xs: "1.1rem", md: "1.6rem" },
              lineHeight: 1.5,
            }}
          >
            Email: {info?.email || "info@mysite.com"}
          </Typography>

          <Typography
            sx={{
              color: "#ffffff",
              fontSize: { xs: "1.1rem", md: "1.6rem" },
              lineHeight: 1.5,
            }}
          >
            Address: {info?.address || "500 Terry Francine Street"}
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
};

const MapSection = ({ mapUrl }) => {
  if (!mapUrl) return null;

  return (
    <Container maxWidth="xl" sx={{ mb: { xs: 5, md: 8 } }}>
      <Box sx={{ backgroundColor: BG, p: { xs: 2, md: 3 } }}>
        <Typography
          sx={{
            fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
            fontSize: { xs: 28, md: 40 },
            color: HEADING,
            mb: 2.5,
          }}
        >
          Find Us
        </Typography>

        <Box
          sx={{
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <iframe
            title="Temple Location"
            src={mapUrl}
            width="100%"
            height="420"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </Box>
      </Box>
    </Container>
  );
};

const ContactFormSection = ({
  form,
  handleChange,
  handleSubmit,
  submitted,
  submitting,
}) => {
  return (
    <Container maxWidth="xl" sx={{ pb: { xs: 6, md: 9 } }}>
      <Box
        id="contact-form"
        sx={{
          backgroundColor: BG,
          px: { xs: 3, md: 8 },
          py: { xs: 4, md: 5 },
        }}
      >
        {submitted ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography
              sx={{
                color: HEADING,
                fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
                fontSize: { xs: "2rem", md: "3rem" },
                mb: 2,
              }}
            >
              Thank You
            </Typography>
            <Typography sx={{ color: TEXT, fontSize: { xs: 16, md: 18 } }}>
              We received your message and will get back to you soon.
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container columnSpacing={2} rowSpacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="standard"
                  label="First name *"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  InputLabelProps={labelSx}
                  InputProps={underlineFieldSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="standard"
                  label="Last name *"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  InputLabelProps={labelSx}
                  InputProps={underlineFieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="standard"
                  label="Email *"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  InputLabelProps={labelSx}
                  InputProps={underlineFieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="standard"
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  InputLabelProps={labelSx}
                  InputProps={underlineFieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="standard"
                  label="Type your message here..."
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  multiline
                  rows={5}
                  required
                  InputLabelProps={labelSx}
                  InputProps={underlineFieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={submitting}
                  variant="contained"
                  sx={{
                    mt: 1,
                    backgroundColor: "#ece9ef",
                    color: BG,
                    borderRadius: 0,
                    py: 1.4,
                    textTransform: "none",
                    fontSize: { xs: 20, md: 22 },
                    fontWeight: 400,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      boxShadow: "none",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#d6d1db",
                      color: BG,
                    },
                  }}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

const SectionSkeleton = ({ reverse = false }) => {
  return (
    <Container maxWidth="xl" sx={{ mb: { xs: 5, md: 8 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          backgroundColor: BG,
        }}
      >
        <Box
          sx={{
            order: { xs: 2, md: reverse ? 2 : 1 },
            px: { xs: 3, md: 8 },
            py: { xs: 5, md: 7 },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 620 }}>
            <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.12)", height: 70, width: "70%", mb: 2 }} />
            <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.10)", height: 45, width: "55%", mb: 4 }} />
            <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.10)", height: 180, width: "100%" }} />
          </Box>
        </Box>

        <Box
          sx={{
            order: { xs: 1, md: reverse ? 1 : 2 },
            minHeight: { xs: 320, md: 620 },
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              bgcolor: "rgba(255,255,255,0.10)",
              width: "100%",
              height: "100%",
              minHeight: { xs: 320, md: 620 },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

const Contact = () => {
  const [info, setInfo] = useState({
    address: "",
    phone: "",
    email: "",
    faq: [],
    googleMapEmbed: "",
    openingHours: [],
    volunteerTitle: "",
    volunteerSubtitle: "",
    volunteerText: "",
    donationTitle: "",
    donationText: "",
    memberTitle: "",
    memberSubtitle: "",
    memberText: "",
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await api.get("/content/contact");
        setInfo(res.data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const fullName = `${form.firstName} ${form.lastName}`.trim();
      const finalMessage = form.subject
        ? `Subject: ${form.subject}\n\n${form.message}`
        : form.message;

      await api.post("/contact/messages", {
        name: fullName,
        email: form.email,
        message: finalMessage,
      });

      setSubmitted(true);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ backgroundColor: BG, minHeight: "100vh" }}>
        <HeroSection />
        <SectionSkeleton />
        <Container maxWidth="xl" sx={{ mb: { xs: 5, md: 8 } }}>
          <Box sx={{ backgroundColor: BG, py: { xs: 7, md: 10 }, px: 3, textAlign: "center" }}>
            <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.12)", height: 120, width: 120, mx: "auto", mb: 3 }} />
            <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.12)", height: 70, width: 340, mx: "auto", mb: 3 }} />
            <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.10)", height: 120, width: "70%", mx: "auto", mb: 4 }} />
            <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.10)", height: 52, width: 160, mx: "auto" }} />
          </Box>
        </Container>
        <SectionSkeleton reverse />
        <Container maxWidth="xl" sx={{ mb: { xs: 5, md: 8 } }}>
          <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.10)", height: 340, width: "100%" }} />
        </Container>
        <Container maxWidth="xl" sx={{ mb: { xs: 5, md: 8 } }}>
          <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.10)", height: 420, width: "100%" }} />
        </Container>
        <Container maxWidth="xl" sx={{ pb: { xs: 6, md: 9 } }}>
          <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.10)", height: 420, width: "100%" }} />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: BG, minHeight: "100vh" }}>
      <HeroSection />

      <SplitSection
        title={info.volunteerTitle || FALLBACKS.volunteerTitle}
        subtitle={info.volunteerSubtitle || FALLBACKS.volunteerSubtitle}
        text={info.volunteerText}
        fallback={FALLBACKS.volunteerText}
        image={IMAGES.volunteer}
      />

      <DonateSection
        title={info.donationTitle || FALLBACKS.donationTitle}
        text={info.donationText}
      />

      <SplitSection
        title={info.memberTitle || FALLBACKS.memberTitle}
        subtitle={info.memberSubtitle || FALLBACKS.memberSubtitle}
        text={info.memberText}
        fallback={FALLBACKS.memberText}
        image={IMAGES.member}
        reverse
      />

      <ContactHoursSection info={info} />

      <MapSection mapUrl={info.googleMapEmbed} />

      <ContactFormSection
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitted={submitted}
        submitting={submitting}
      />
    </Box>
  );
};

const labelSx = {
  sx: {
    color: "rgba(255,255,255,0.95)",
    fontSize: { xs: 18, md: 20 },
    "&.Mui-focused": {
      color: "rgba(255,255,255,0.95)",
    },
  },
};

const underlineFieldSx = {
  disableUnderline: false,
  sx: {
    color: "#ffffff",
    fontSize: { xs: 18, md: 20 },
    pb: 1.5,
    "&:before": {
      borderBottom: `1px solid ${LINE}`,
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottom: `1px solid ${LINE}`,
    },
    "&:after": {
      borderBottom: `1px solid ${LINE}`,
    },
  },
};

export default Contact;