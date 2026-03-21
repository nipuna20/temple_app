import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Box,
  Typography,
  Container,
  Button,
  Chip,
  Stack,
  keyframes,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const truncateWords = (text, count = 15) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= count) return text;
  return `${words.slice(0, count).join(" ")}...`;
};

const heroSectionHeightSx = {
  position: "relative",
  width: "100%",
  overflow: "hidden",
  height: "calc(100vh - 72px)",
  minHeight: "calc(100vh - 72px)",
  "@media (min-width:900px)": {
    height: "calc(100vh - 80px)",
    minHeight: "calc(100vh - 80px)",
  },
  "@supports (height: 100svh)": {
    height: "calc(100svh - 72px)",
    minHeight: "calc(100svh - 72px)",
    "@media (min-width:900px)": {
      height: "calc(100svh - 80px)",
      minHeight: "calc(100svh - 80px)",
    },
  },
  "@supports (height: 100dvh)": {
    height: "calc(100dvh - 72px)",
    minHeight: "calc(100dvh - 72px)",
    "@media (min-width:900px)": {
      height: "calc(100dvh - 80px)",
      minHeight: "calc(100dvh - 80px)",
    },
  },
};

const heroInnerHeightSx = {
  position: "relative",
  zIndex: 1,
  height: "calc(100vh - 72px)",
  minHeight: "calc(100vh - 72px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  px: { xs: 2, md: 4 },
  "@media (min-width:900px)": {
    height: "calc(100vh - 80px)",
    minHeight: "calc(100vh - 80px)",
  },
  "@supports (height: 100svh)": {
    height: "calc(100svh - 72px)",
    minHeight: "calc(100svh - 72px)",
    "@media (min-width:900px)": {
      height: "calc(100svh - 80px)",
      minHeight: "calc(100svh - 80px)",
    },
  },
  "@supports (height: 100dvh)": {
    height: "calc(100dvh - 72px)",
    minHeight: "calc(100dvh - 72px)",
    "@media (min-width:900px)": {
      height: "calc(100dvh - 80px)",
      minHeight: "calc(100dvh - 80px)",
    },
  },
};

const SplitInfoSection = ({
  title,
  subtitle,
  text,
  image,
  reverse = false,
}) => {
  return (
    <Container maxWidth="lg" sx={{ mb: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: reverse ? "1.05fr 0.95fr" : "0.95fr 1.05fr",
          },
          gap: 0,
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            order: { xs: 2, md: reverse ? 2 : 1 },
            px: { xs: 3, sm: 4, md: 8 },
            py: { xs: 4, md: 7 },
            display: "flex",
            alignItems: "center",
            minHeight: { xs: 260, md: 520 },
          }}
        >
          <Box sx={{ maxWidth: 520 }}>
            <Typography
              sx={{
                fontFamily: `"Georgia","Times New Roman",serif`,
                fontSize: { xs: 28, md: 42 },
                color: "rgba(255,255,255,0.96)",
                mb: 3,
                lineHeight: 1.15,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.96)",
                fontSize: { xs: 18, md: 22 },
                mb: 4,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.92)",
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.9,
                mb: 4,
                maxWidth: 560,
              }}
            >
              {text}
            </Typography>

            <Button
              component={RouterLink}
              to="/about"
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#ffffff",
                color: "#1a0046",
                borderRadius: 0,
                px: 3.5,
                py: 1.4,
                fontSize: 16,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#f3f3f3",
                  boxShadow: "none",
                },
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            order: { xs: 1, md: reverse ? 1 : 2 },
            minHeight: { xs: 280, md: 520 },
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Box>
    </Container>
  );
};

const EventRow = ({ event }) => {
  const isPaid = Number(event.amount || 0) > 0;

  const formatEventDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const getOrdinal = (num) => {
      if (num > 3 && num < 21) return `${num}th`;
      switch (num % 10) {
        case 1:
          return `${num}st`;
        case 2:
          return `${num}nd`;
        case 3:
          return `${num}rd`;
        default:
          return `${num}th`;
      }
    };

    return `${month}/${getOrdinal(day)}/${year}`;
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.12fr 0.88fr" },
        gap: { xs: 3, md: 8 },
        alignItems: "center",
        mb: { xs: 5, md: 7 },
      }}
    >
      <Box>
        <Box
          component="img"
          src={
            event.image ||
            "https://www.360view.lk/wp-content/uploads/2020/04/IMG_2354-1-scaled-1.jpg"
          }
          alt={event.title}
          sx={{
            width: "100%",
            height: { xs: 260, md: 360 },
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>

      <Box sx={{ pr: { md: 3 } }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Chip
            label={isPaid ? `Paid • $${event.amount}` : "Free"}
            size="small"
            sx={{
              backgroundColor: isPaid ? "#f0c34a" : "rgba(29,9,79,0.10)",
              color: "#1b0a3b",
              fontWeight: 700,
              borderRadius: 999,
            }}
          />
          <Typography>
            {formatEventDate(event.registrationDeadline)}
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontFamily: `"Georgia","Times New Roman",serif`,
            color: "#1a0046",
            fontSize: { xs: 28, md: 40 },
            lineHeight: 1.25,
            mb: 3,
          }}
        >
          {event.title}
        </Typography>

        <Typography
          sx={{
            color: "#1a0046",
            fontSize: { xs: 16, md: 18 },
            lineHeight: 1.9,
            mb: 4,
            maxWidth: 500,
          }}
        >
          {(event.description || "").slice(0, 140)}
          {(event.description || "").length > 140 ? "..." : ""}
        </Typography>

        <Button
          component={RouterLink}
          to={`/events/${event.id}`}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#ffffff",
            color: "#1a0046",
            borderRadius: 0,
            px: 3.5,
            py: 1.3,
            fontSize: 16,
            boxShadow: "none",
            border: "1px solid rgba(26,0,70,0.12)",
            "&:hover": {
              backgroundColor: "#f6f6f6",
              boxShadow: "none",
            },
          }}
        >
          Learn More
        </Button>
      </Box>
    </Box>
  );
};

const BottomSlideshow = () => {
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=80",
      title: "Meditation & Mindfulness",
      subtitle: "Find calm in the present moment.",
    },
    {
      image:
        "https://media.licdn.com/dms/image/v2/D5612AQF2-pX5C_iB-Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1699642272539?e=2147483647&v=beta&t=rfMt-Aby7lgQi2dP5LCfgUtZ5fAYLEPAdiKiBDZGeGQ",
      title: "Community & Harmony",
      subtitle: "Grow together with compassion.",
    },
    {
      image:
        "https://travellersisle.com/wp-content/uploads/2024/04/Buddhist-Temples-in-Sri-Lanka.jpg",
      title: "Teachings & Guidance",
      subtitle: "Wisdom that lights the path.",
    },
    {
      image:
        "https://media.istockphoto.com/id/853316874/photo/buddha-statue-in-sri-lanka.jpg?s=612x612&w=0&k=20&c=iqyU2uDqFhLvF9HIsX43CO3ipyFfXeTlCoz6PqcXJQs=",
      title: "Teachings & Guidance",
      subtitle: "Wisdom that lights the path.",
    },
  ];

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <Box sx={{ mt: { xs: 6, md: 9 } }}>
      <Box
        sx={{
          position: "relative",
          height: { xs: 320, md: 420 },
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.10)",
          backgroundColor: "rgba(255,255,255,0.04)",
        }}
      >
        {slides.map((s, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${s.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === index ? 1 : 0,
              transform: i === index ? "scale(1.02)" : "scale(1.06)",
              transition: "opacity 900ms ease, transform 1200ms ease",
            }}
          />
        ))}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.20) 55%, rgba(0,0,0,0.62) 100%)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Box sx={{ maxWidth: 900 }}>
            <Typography
              sx={{
                fontFamily: `"Georgia","Times New Roman",serif`,
                fontSize: { xs: 28, sm: 36, md: 46 },
                color: "rgba(255,255,255,0.92)",
                textShadow: "0 10px 40px rgba(0,0,0,0.45)",
              }}
            >
              {slides[index].title}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: 14, md: 16 },
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.03em",
              }}
            >
              {slides[index].subtitle}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 14,
            left: 0,
            right: 0,
            display: "flex",
            gap: 1,
            justifyContent: "center",
          }}
        >
          {slides.map((_, i) => (
            <Box
              key={i}
              onClick={() => setIndex(i)}
              sx={{
                width: i === index ? 18 : 8,
                height: 8,
                borderRadius: 999,
                cursor: "pointer",
                backgroundColor:
                  i === index
                    ? "rgba(240,195,74,0.95)"
                    : "rgba(255,255,255,0.35)",
                transition: "all 250ms ease",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const TempleHoursSection = () => {
  const hours = [
    { title: "Daily", time: "9:00 AM - 4:00 PM" },
    { title: "Weekends", time: "7:00 AM - 6:00 PM" },
    { title: "Lunch Service", time: "11:00 AM - 3:00 PM" },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#190c2f",
        py: { xs: 7, md: 10 },
        mt: { xs: 6, md: 8 },
      }}
    >
      <Box sx={{ textAlign: "center", px: { xs: 3, md: 6 } }}>
        <Box
          component="img"
          src="https://static.wixstatic.com/media/d99169_d2940fdee4824010818a27f8c2b5a61a~mv2.png/v1/fill/w_400,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/d99169_d2940fdee4824010818a27f8c2b5a61a~mv2.png"
          alt="Temple Hours"
          sx={{
            width: { xs: 90, md: 140 },
            height: { xs: 90, md: 140 },
            objectFit: "contain",
            opacity: 0.7,
            mb: 4,
          }}
        />

        <Typography
          sx={{
            fontFamily: `"Georgia","Times New Roman",serif`,
            fontSize: { xs: 34, md: 56 },
            color: "rgba(255,255,255,0.95)",
            mb: { xs: 6, md: 8 },
            lineHeight: 1.1,
          }}
        >
          Temple Hours
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: { xs: 4, md: 6 },
          textAlign: "center",
          width: "100%",
          px: { xs: 3, md: 6 },
        }}
      >
        {hours.map((item) => (
          <Box key={item.title}>
            <Typography
              sx={{
                fontFamily: `"Georgia","Times New Roman",serif`,
                fontSize: { xs: 28, md: 36 },
                color: "rgba(255,255,255,0.96)",
                mb: 3,
              }}
            >
              {item.title}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 20, md: 24 },
                color: "rgba(255,255,255,0.96)",
                lineHeight: 1.6,
              }}
            >
              {item.time}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const HeroSlideshow = () => {
  const heroSlides = [
    "https://seedevirestaurant.com/wp-content/uploads/2023/09/Ruwanweli-Maha-Seya.webp",
    "https://www.360view.lk/wp-content/uploads/2020/04/IMG_2354-1-scaled-1.jpg",
    "https://media.istockphoto.com/id/521090024/photo/dambulla-cave-temple-buddha-statues-sri-lanka.jpg?s=612x612&w=0&k=20&c=-NwR2hhlFnxdUX9LUoFiM4T2ZHHUb3dCnlRTM4MKk4s=",
    "https://media.istockphoto.com/id/471107172/photo/seema-malaka-temple-in-colombo-sri-lanka.jpg?s=612x612&w=0&k=20&c=mBl_NgiZL2Xk9eWqC4tUr5Th5whTCZcCg3YVgqwerO0=",
  ];

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <>
      {heroSlides.map((image, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            opacity: i === index ? 1 : 0,
            transform: i === index ? "scale(1.02)" : "scale(1.06)",
            transition: "opacity 1000ms ease, transform 1400ms ease",
            willChange: "opacity, transform",
          }}
        />
      ))}
    </>
  );
};

const heroTextFloat = keyframes`
  0% {
    opacity: 0;
    transform: translateY(18px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Home = () => {
  const [visionMission, setVisionMission] = useState({
    vision: "",
    mission: "",
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const vmRes = await api.get("/content/about");
        setVisionMission({
          vision: vmRes.data.vision || "",
          mission: vmRes.data.mission || "",
        });

        const evRes = await api.get("/events");
        setEvents((evRes.data || []).slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#0f0726" }}>
      {/* HERO */}
      <Box sx={heroSectionHeightSx}>
        <HeroSlideshow />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(80% 70% at 50% 55%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.60) 65%, rgba(0,0,0,0.78) 100%)",
          }}
        />

        <Container maxWidth="lg" sx={heroInnerHeightSx}>
          <Box sx={{ maxWidth: 920 }}>
            <Typography
              sx={{
                fontFamily: `"Georgia","Times New Roman",serif`,
                fontWeight: 500,
                color: "rgba(255,255,255,0.92)",
                fontSize: { xs: 34, sm: 44, md: 64 },
                lineHeight: { xs: 1.15, md: 1.08 },
                letterSpacing: "0.01em",
                textShadow: "0 10px 40px rgba(0,0,0,0.45)",
                animation: `${heroTextFloat} 1.2s ease-out`,
                willChange: "transform, opacity",
              }}
            >
              “With Our Thoughts We
              <br />
              Make the World”
            </Typography>

            <Typography
              sx={{
                mt: 2,
                color: "rgba(255,255,255,0.70)",
                fontSize: { xs: 14, md: 16 },
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Gautama Buddha
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* CONTENT */}
      <Box sx={{ py: { xs: 5, md: 7 } }}>
        <SplitInfoSection
          title="Vision"
          subtitle="Come in Peace, Leave in Harmony"
          text={truncateWords(
            visionMission.vision || "Our vision statement goes here.",
            25
          )}
          image="https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1400&q=80"
          reverse={false}
        />

        <SplitInfoSection
          title="Mission"
          subtitle="Serve with compassion and wisdom"
          text={truncateWords(
            visionMission.mission || "Our mission statement goes here.",
            25
          )}
          image="https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1400&q=80"
          reverse
        />

        <Box sx={{ backgroundColor: "#f2f2f2", py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            <Typography
              sx={{
                fontFamily: `"Georgia","Times New Roman",serif`,
                fontSize: { xs: 34, md: 56 },
                color: "#1a0046",
                textAlign: "center",
                mb: 3,
                lineHeight: 1.1,
              }}
            >
              Upcoming Events
            </Typography>

            <Typography
              sx={{
                color: "#1a0046",
                textAlign: "center",
                fontSize: { xs: 16, md: 18 },
                lineHeight: 2,
                maxWidth: 980,
                mx: "auto",
                mb: { xs: 6, md: 10 },
              }}
            >
              Discover our upcoming gatherings, teachings, and community events.
              Join us to experience mindfulness, compassion, and shared spiritual
              growth.
            </Typography>

            {events.length === 0 ? (
              <Box
                sx={{
                  border: "1px dashed rgba(26,0,70,0.20)",
                  p: 3,
                  color: "#1a0046",
                  textAlign: "center",
                }}
              >
                No events found.
              </Box>
            ) : (
              <>
                {events.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}

                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/events"
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#1a0046",
                      color: "#fff",
                      borderRadius: 0,
                      px: 4,
                      py: 1.4,
                      fontSize: 16,
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#2a0a63",
                        boxShadow: "none",
                      },
                    }}
                  >
                    View All Events
                  </Button>
                </Box>
              </>
            )}

            <BottomSlideshow />
          </Container>

          <TempleHoursSection />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;