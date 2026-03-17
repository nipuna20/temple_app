import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Box,
  Typography,
  Container,
  Skeleton,
  Stack,
  Grid,
} from "@mui/material";

const BG = "#17003a";
const HEADING = "#b7a0e6";
const TEXT = "#ffffff";
const BODY = "rgba(255,255,255,0.88)";
const CARD_BG = "rgba(255,255,255,0.04)";
const CARD_BORDER = "1px solid rgba(255,255,255,0.08)";

const IMAGES = {
  guru:
    "https://cdn.create.vista.com/api/media/small/64541291/stock-photo-temple-of-the-sacred-tooth-relic-sri-lanka",
  history:
    "https://travellersisle.com/wp-content/uploads/2024/04/Buddhist-Temples-in-Sri-Lanka.jpg",
};

const FALLBACKS = {
  leadership:
    "I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I’m a great place for you to tell a story and let your users know a little more about you.",
  history:
    "I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I’m a great place for you to tell a story and let your users know a little more about you.",
  vision:
    "This is the vision content area. You can add your vision text here from the admin panel.",
  mission:
    "This is the mission content area. You can add your mission text here from the admin panel.",
};

const getParagraphs = (text, fallback = "") => {
  const finalText = text && text.trim() ? text.trim() : fallback;
  return finalText.split(/\n\s*\n/).filter(Boolean);
};

const ParagraphBlock = ({ text, fallback, center = false }) => {
  const paragraphs = getParagraphs(text, fallback);

  return (
    <Stack spacing={3}>
      {paragraphs.map((para, index) => (
        <Typography
          key={index}
          sx={{
            color: BODY,
            fontSize: { xs: "1rem", md: "1.08rem" },
            lineHeight: 1.9,
            textAlign: center ? "center" : "left",
            fontWeight: 400,
          }}
        >
          {para}
        </Typography>
      ))}
    </Stack>
  );
};

const PageHeader = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        pt: { xs: 7, md: 10 },
        pb: { xs: 5, md: 7 },
      }}
    >
      <Typography
        sx={{
          fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
          color: TEXT,
          fontSize: { xs: "2.7rem", md: "4.5rem" },
          lineHeight: 1,
          fontWeight: 500,
          mb: 2,
        }}
      >
        About Us
      </Typography>

      <Typography
        sx={{
          color: "rgba(255,255,255,0.82)",
          fontSize: { xs: "1rem", md: "1.1rem" },
          lineHeight: 1.8,
          maxWidth: 760,
          mx: "auto",
        }}
      >
        Learn more about our spiritual journey, our history, our vision, and our mission.
      </Typography>
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
}) => {
  return (
    <Container maxWidth="xl" sx={{ mb: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "stretch",
          borderRadius: 0,
          overflow: "hidden",
          backgroundColor: BG,
        }}
      >
        <Box
          sx={{
            order: { xs: 1, md: reverse ? 2 : 1 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 3, sm: 4, md: 6, lg: 8 },
            py: { xs: 5, md: 7, lg: 8 },
            minHeight: { xs: "auto", md: 680 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 600 }}>
            <Typography
              sx={{
                fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
                color: HEADING,
                fontSize: { xs: "2.8rem", md: "4rem", lg: "4.4rem" },
                lineHeight: 1,
                fontWeight: 500,
                mb: 4,
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                sx={{
                  color: TEXT,
                  fontSize: { xs: "1.25rem", md: "1.9rem" },
                  lineHeight: 1.35,
                  fontWeight: 400,
                  mb: 4,
                }}
              >
                {subtitle}
              </Typography>
            )}

            <ParagraphBlock text={text} fallback={fallback} />
          </Box>
        </Box>

        <Box
          sx={{
            order: { xs: 2, md: reverse ? 1 : 2 },
            minHeight: { xs: 360, md: 680 },
          }}
        >
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: "100%",
              height: "100%",
              minHeight: { xs: 360, md: 680 },
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

const VisionMissionSection = ({ vision, mission }) => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 4, md: 6 },
        mb: { xs: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          backgroundColor: BG,
          px: { xs: 3, md: 5, lg: 8 },
          py: { xs: 5, md: 7, lg: 8 },
        }}
      >
        <Typography
          sx={{
            fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
            color: HEADING,
            fontSize: { xs: "2.8rem", md: "4rem" },
            lineHeight: 1,
            textAlign: "center",
            fontWeight: 500,
            mb: 5,
          }}
        >
          Vision & Mission
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "100%",
                background: CARD_BG,
                border: CARD_BORDER,
                p: { xs: 3, md: 4 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
                  color: HEADING,
                  fontSize: { xs: "2rem", md: "2.6rem" },
                  lineHeight: 1,
                  mb: 3,
                }}
              >
                Our Vision
              </Typography>

              <ParagraphBlock
                text={vision}
                fallback={FALLBACKS.vision}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "100%",
                background: CARD_BG,
                border: CARD_BORDER,
                p: { xs: 3, md: 4 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
                  color: HEADING,
                  fontSize: { xs: "2rem", md: "2.6rem" },
                  lineHeight: 1,
                  mb: 3,
                }}
              >
                Our Mission
              </Typography>

              <ParagraphBlock
                text={mission}
                fallback={FALLBACKS.mission}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

const SectionSkeleton = ({ reverse = false }) => {
  return (
    <Container maxWidth="xl" sx={{ mb: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          backgroundColor: BG,
        }}
      >
        <Box
          sx={{
            order: { xs: 1, md: reverse ? 2 : 1 },
            px: { xs: 3, sm: 4, md: 6, lg: 8 },
            py: { xs: 5, md: 7, lg: 8 },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 600 }}>
            <Skeleton
              variant="text"
              sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                height: 70,
                width: "55%",
                mb: 2,
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                bgcolor: "rgba(255,255,255,0.10)",
                height: 42,
                width: "70%",
                mb: 3,
              }}
            />
            <Skeleton
              variant="rectangular"
              sx={{
                bgcolor: "rgba(255,255,255,0.10)",
                height: 220,
                width: "100%",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            order: { xs: 2, md: reverse ? 1 : 2 },
            minHeight: { xs: 360, md: 680 },
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              bgcolor: "rgba(255,255,255,0.10)",
              width: "100%",
              height: "100%",
              minHeight: { xs: 360, md: 680 },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

const About = () => {
  const [content, setContent] = useState({
    history: "",
    leadership: "",
    coreValues: "",
    vision: "",
    mission: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get("/content/about");
        setContent({
          history: res?.data?.history || "",
          leadership: res?.data?.leadership || "",
          coreValues: res?.data?.coreValues || "",
          vision: res?.data?.vision || "",
          mission: res?.data?.mission || "",
        });
      } catch (err) {
        console.error("Failed to fetch about content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: BG,
          minHeight: "100vh",
          pt: { xs: 3, md: 5 },
          pb: { xs: 5, md: 7 },
        }}
      >
        <Container maxWidth="xl">
          <PageHeader />
        </Container>

        <SectionSkeleton />
        <Container maxWidth="xl" sx={{ mb: { xs: 4, md: 6 } }}>
          <Skeleton
            variant="rectangular"
            sx={{
              bgcolor: "rgba(255,255,255,0.10)",
              height: 360,
              width: "100%",
            }}
          />
        </Container>
        <SectionSkeleton reverse />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: BG,
        minHeight: "100vh",
        pt: { xs: 3, md: 5 },
        pb: { xs: 5, md: 7 },
      }}
    >
      <Container maxWidth="xl">
        <PageHeader />
      </Container>

      <SplitSection
        title="Our Guru"
        subtitle="Living a Spiritually Awakened Life

"
        text={content.leadership}
        fallback={FALLBACKS.leadership}
        image={IMAGES.guru}
      />

      <VisionMissionSection
        vision={content.vision}
        mission={content.mission}
      />

      <SplitSection
        title="Our History"
        subtitle="It Is Better to Travel Well Than to Arrive"
        text={content.history}
        fallback={FALLBACKS.history}
        image={IMAGES.history}
        reverse
      />
    </Box>
  );
};

export default About;