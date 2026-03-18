import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const STORAGE_KEY = "site_access_granted";

const SiteAccessGate = ({ children }) => {
  const expectedCode = useMemo(() => {
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_ACCESS_CODE) {
      return import.meta.env.VITE_SITE_ACCESS_CODE;
    }

    if (typeof process !== "undefined" && process.env?.REACT_APP_SITE_ACCESS_CODE) {
      return process.env.REACT_APP_SITE_ACCESS_CODE;
    }

    return "9084eec0d300e3ebbd6b596aba9a0e7cda3ac988";
  }, []);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(
    localStorage.getItem(STORAGE_KEY) === "true"
  );

  const handleUnlock = (e) => {
    e.preventDefault();

    if (code.trim() === expectedCode) {
      localStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect access code");
    }
  };

  if (unlocked) {
    return children;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, #1b0a3b 0%, #12082c 100%)",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Typography
            sx={{
              fontFamily: `"Georgia","Times New Roman",serif`,
              fontSize: { xs: 30, md: 42 },
              mb: 2,
              color: "rgba(255,255,255,0.96)",
            }}
          >
            Private Access
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.76)",
              fontSize: 16,
              mb: 4,
              lineHeight: 1.8,
            }}
          >
            This website is currently under development.
            Please enter the access code to continue.
          </Typography>

          <Box
            component="form"
            onSubmit={handleUnlock}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter access code"
              error={Boolean(error)}
              helperText={error || " "}
              InputProps={{
                sx: {
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: 2,
                },
              }}
              FormHelperTextProps={{
                sx: {
                  color: error ? "#ffb3b3" : "rgba(255,255,255,0.55)",
                  textAlign: "left",
                  ml: 0,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.18)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.28)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f0c34a",
                  },
                },
                "& input::placeholder": {
                  color: "rgba(255,255,255,0.55)",
                  opacity: 1,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 999,
                py: 1.3,
                backgroundColor: "#f0c34a",
                color: "#1b0a3b",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#ffd36a",
                  boxShadow: "none",
                },
              }}
            >
              Unlock Website
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SiteAccessGate;