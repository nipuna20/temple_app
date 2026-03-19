import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import SiteAccessGate from "./components/SiteAccessGate";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Community from "./pages/Community";
import Publications from "./pages/Publications";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import DonateMonthly from "./pages/DonateMonthly";
import Dana from "./pages/Dana";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EventRegister from "./pages/EventRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Notifications from "./pages/Notifications";
import CommunityPostDetails from "./pages/CommunityPostDetails";

const App = () => {
  return (
    <SiteAccessGate>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NavBar />

        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/:id/register" element={<EventRegister />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/community" element={<Community />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/dana" element={<Dana />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/donate-monthly"
              element={
                <PrivateRoute>
                  <DonateMonthly />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route path="/community/:id" element={<CommunityPostDetails />} />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </SiteAccessGate>
  );
};

export default App;