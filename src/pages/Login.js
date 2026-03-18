import React, { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Alert, Paper } from "@mui/material";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: { xs: 4, md: 6 },
        backgroundColor: "#f7f7fb",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: "1px solid rgba(27,10,59,0.10)",
          boxShadow: "0 10px 30px rgba(27,10,59,0.08)",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#1b0a3b",
            fontFamily: `"Georgia","Times New Roman",serif`,
            mb: 2,
          }}
        >
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 1,
              textTransform: "none",
              backgroundColor: "#1b0a3b",
              color: "#fff",
              py: 1.2,
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#2a0a63",
                boxShadow: "none",
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;