import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Divider,
} from "@mui/material";

function TabPanel({ value, index, children }) {
  return value === index && <Box sx={{ p: 3 }}>{children}</Box>;
}

// ✅ allow admin to paste embed URL OR full iframe HTML
const extractEmbedUrl = (value) => {
  if (!value) return "";
  const v = value.trim();
  const match = v.match(/src\s*=\s*"([^"]+)"/i);
  if (match?.[1]) return match[1];
  return v;
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState(0);

  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [about, setAbout] = useState({ history: "", leadership: "", coreValues: "", vision: "", mission: "" });

  const [contactInfo, setContactInfo] = useState({
    address: "",
    phone: "",
    email: "",
    faq: [],
    googleMapEmbed: "",
  });

  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    registrationDeadline: "",
    description: "",
    image: "",
    agenda: "",
    amount: "",
  });

  const [blogPosts, setBlogPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    body: "",
    authorName: "",
    authorImage: "",
    status: "published",
  });

  const [communityPosts, setCommunityPosts] = useState([]);
  const [newCommunity, setNewCommunity] = useState({ title: "", description: "", mediaUrls: "" });

  const [publications, setPublications] = useState([]);
  const [newPublication, setNewPublication] = useState({ title: "", description: "", url: "", type: "pdf" });

  const [danaBookings, setDanaBookings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [monthlyPlans, setMonthlyPlans] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const aboutRes = await api.get("/content/about");
        setAbout(aboutRes.data);
        setVision(aboutRes.data.vision || "");
        setMission(aboutRes.data.mission || "");

        const contactRes = await api.get("/content/contact");
        setContactInfo(contactRes.data);

        const eventsRes = await api.get("/events");
        // Add local editable fields if not existing
        setEvents((eventsRes.data || []).map((e) => ({ ...e, streamUrl: e.streamUrl || "" })));

        const postsRes = await api.get("/blog");
        setBlogPosts(postsRes.data || []);

        const commRes = await api.get("/community");
        setCommunityPosts(commRes.data || []);

        const pubsRes = await api.get("/publications");
        setPublications(pubsRes.data || []);

        const danaRes = await api.get("/dana");
        setDanaBookings(danaRes.data || []);

        const donationsRes = await api.get("/donations");
        setDonations(donationsRes.data || []);

        const monthlyRes = await api.get("/monthly");
        setMonthlyPlans(monthlyRes.data || []);

        const contactsRes = await api.get("/contact/messages");
        setContactMessages(contactsRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  const handleTabChange = (event, newValue) => setTab(newValue);

  // ---------------- Content Updates ----------------
  const updateVisionMission = async () => {
    try {
      // When updating vision and mission, include the existing about fields
      await api.post("/content/about", { ...about, vision, mission });
      // Sync the local state so subsequent about updates don't overwrite
      setAbout((prev) => ({ ...prev, vision, mission }));
      alert("Vision & Mission updated");
    } catch (err) {
      console.error(err);
    }
  };

  const updateAbout = async () => {
    try {
      // Ensure we also persist the current vision and mission when updating other about fields
      await api.post("/content/about", { ...about, vision, mission });
      // Update local about state
      setAbout((prev) => ({ ...prev, vision, mission }));
      alert("About updated");
    } catch (err) {
      console.error(err);
    }
  };

  const updateContact = async () => {
    try {
      await api.post("/content/contact", {
        address: contactInfo.address,
        phone: contactInfo.phone,
        email: contactInfo.email,
        faq: contactInfo.faq,
        googleMapEmbed: contactInfo.googleMapEmbed,
      });
      alert("Contact info updated");
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- Event CRUD ----------------
  const createEvent = async () => {
    try {
      const res = await api.post("/events", newEvent);
      setEvents([...events, { ...res.data, streamUrl: res.data.streamUrl || "" }]);
      setNewEvent({ title: "", registrationDeadline: "", description: "", image: "", agenda: "", amount: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Stream: Save URL
  const saveStreamUrl = async (eventId, streamUrl) => {
    try {
      await api.post(`/streams/${eventId}/url`, { streamUrl: extractEmbedUrl(streamUrl) });
      alert("Stream URL saved");
    } catch (err) {
      console.error(err);
      alert("Failed to save stream URL");
    }
  };

  // ✅ Stream: Start Live
  const startLive = async (eventId) => {
    try {
      await api.post(`/streams/${eventId}/start`);
      alert("Stream started");
    } catch (err) {
      console.error(err);
      alert("Failed to start");
    }
  };

  // ✅ Stream: Stop Live
  const stopLive = async (eventId) => {
    try {
      await api.post(`/streams/${eventId}/stop`);
      alert("Stream stopped");
    } catch (err) {
      console.error(err);
      alert("Failed to stop");
    }
  };

  // ---------------- Blog CRUD ----------------
  const createBlogPost = async () => {
    try {
      const res = await api.post("/blog", newPost);
      setBlogPosts([...blogPosts, res.data]);
      setNewPost({ title: "", description: "", body: "", authorName: "", authorImage: "", status: "draft" });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBlogPost = async (id) => {
    try {
      await api.delete(`/blog/${id}`);
      setBlogPosts(blogPosts.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- Community CRUD ----------------
  const createCommunityPost = async () => {
    try {
      const mediaUrlsArray = newCommunity.mediaUrls.split(",").map((u) => u.trim()).filter(Boolean);
      const res = await api.post("/community", {
        title: newCommunity.title,
        description: newCommunity.description,
        mediaUrls: mediaUrlsArray,
      });
      setCommunityPosts([...communityPosts, res.data]);
      setNewCommunity({ title: "", description: "", mediaUrls: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCommunityPost = async (id) => {
    try {
      await api.delete(`/community/${id}`);
      setCommunityPosts(communityPosts.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- Publications CRUD ----------------
  const createPublication = async () => {
    try {
      const res = await api.post("/publications", newPublication);
      setPublications([...publications, res.data]);
      setNewPublication({ title: "", description: "", url: "", type: "pdf" });
    } catch (err) {
      console.error(err);
    }
  };

  const deletePublication = async (id) => {
    try {
      await api.delete(`/publications/${id}`);
      setPublications(publications.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- Dana ----------------
  const updateDanaStatus = async (id, status) => {
    try {
      const res = await api.put(`/dana/${id}/status`, { status });
      setDanaBookings(danaBookings.map((b) => (b.id === id ? { ...b, ...res.data } : b)));
    } catch (err) {
      console.error(err);
    }
  };

  const respondDanaRequest = async (id, responseStatus) => {
    try {
      const res = await api.put(`/dana/${id}/respond`, { status: responseStatus });
      setDanaBookings(danaBookings.map((b) => (b.id === id ? res.data : b)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to respond to Dana request');
    }
  };

  // ---------------- Contact messages ----------------
  const markResponded = async (id) => {
    try {
      const res = await api.put(`/contact/messages/${id}`, { responded: true });
      setContactMessages(contactMessages.map((m) => (m.id === id ? res.data : m)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h3" color="primary" gutterBottom>
        Admin Dashboard
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        <Tab label="Vision & Mission" />
        <Tab label="About" />
        <Tab label="Contact Info" />
        <Tab label="Events" />
        <Tab label="Blog Posts" />
        <Tab label="Community Posts" />
        <Tab label="Publications" />
        <Tab label="Dana Bookings" />
        <Tab label="Donations" />
        <Tab label="Monthly Donations" />
        <Tab label="Contact Messages" />
      </Tabs>

      {/* Vision & Mission */}
      <TabPanel value={tab} index={0}>
        <Typography variant="h5">Edit Vision & Mission</Typography>
        <TextField label="Vision" value={vision} onChange={(e) => setVision(e.target.value)} fullWidth multiline rows={2} sx={{ my: 1 }} />
        <TextField label="Mission" value={mission} onChange={(e) => setMission(e.target.value)} fullWidth multiline rows={2} sx={{ my: 1 }} />
        <Button variant="contained" onClick={updateVisionMission}>
          Save
        </Button>
      </TabPanel>

      {/* About */}
      <TabPanel value={tab} index={1}>
        <Typography variant="h5">Edit About</Typography>
        <TextField label="History" value={about.history} onChange={(e) => setAbout({ ...about, history: e.target.value })} fullWidth multiline rows={3} sx={{ my: 1 }} />
        <TextField label="Leadership" value={about.leadership} onChange={(e) => setAbout({ ...about, leadership: e.target.value })} fullWidth multiline rows={3} sx={{ my: 1 }} />
        <TextField label="Core Values" value={about.coreValues} onChange={(e) => setAbout({ ...about, coreValues: e.target.value })} fullWidth multiline rows={3} sx={{ my: 1 }} />
        <Button variant="contained" onClick={updateAbout}>
          Save
        </Button>
      </TabPanel>

      {/* Contact Info */}
      <TabPanel value={tab} index={2}>
        <Typography variant="h5">Edit Contact Info</Typography>
        <TextField label="Address" value={contactInfo.address} onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })} fullWidth sx={{ my: 1 }} />
        <TextField label="Phone" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} fullWidth sx={{ my: 1 }} />
        <TextField label="Email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} fullWidth sx={{ my: 1 }} />

        <TextField
          label="FAQ (JSON)"
          value={JSON.stringify(contactInfo.faq || [])}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setContactInfo({ ...contactInfo, faq: parsed });
            } catch { }
          }}
          fullWidth
          multiline
          rows={3}
          sx={{ my: 1 }}
        />

        <TextField
          label="Google Map Embed URL (paste URL or iframe)"
          value={contactInfo.googleMapEmbed || ""}
          onChange={(e) =>
            setContactInfo({
              ...contactInfo,
              googleMapEmbed: extractEmbedUrl(e.target.value),
            })
          }
          fullWidth
          multiline
          rows={2}
          sx={{ my: 1 }}
          helperText="Paste Google Maps embed URL (https://www.google.com/maps/embed?pb=...) or paste full iframe code"
        />

        <Button variant="contained" onClick={updateContact}>
          Save
        </Button>
      </TabPanel>

      {/* Events */}
      <TabPanel value={tab} index={3}>
        <Typography variant="h5">Create Event</Typography>
        <Grid container spacing={2} sx={{ my: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Registration Deadline"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newEvent.registrationDeadline}
              onChange={(e) => setNewEvent({ ...newEvent, registrationDeadline: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} fullWidth multiline rows={3} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Image URL" value={newEvent.image} onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Agenda" value={newEvent.agenda} onChange={(e) => setNewEvent({ ...newEvent, agenda: e.target.value })} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Amount (0 for free)" type="number" value={newEvent.amount} onChange={(e) => setNewEvent({ ...newEvent, amount: e.target.value })} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={createEvent}>
              Create Event
            </Button>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mt: 4 }}>
          Existing Events (Live Stream Settings)
        </Typography>

        {events.map((event) => (
          <Card key={event.id} sx={{ my: 2 }}>
            <CardContent>
              <Typography variant="h6">{event.title}</Typography>
              <Typography variant="body2">
                Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">Amount: {event.amount || 0}</Typography>

              <Divider sx={{ my: 2 }} />

              {/* ✅ STREAM URL FIELD */}
              <TextField
                label="Live Stream Embed URL (YouTube/Cloudflare)"
                value={event.streamUrl || ""}
                onChange={(e) => {
                  const updated = events.map((ev) =>
                    ev.id === event.id ? { ...ev, streamUrl: extractEmbedUrl(e.target.value) } : ev
                  );
                  setEvents(updated);
                }}
                fullWidth
                sx={{ mt: 1 }}
                helperText='Example: https://www.youtube.com/embed/VIDEO_ID'
              />

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                <Button variant="contained" onClick={() => saveStreamUrl(event.id, event.streamUrl)}>
                  Save Stream URL
                </Button>
                <Button variant="outlined" onClick={() => startLive(event.id)}>
                  Start Live
                </Button>
                <Button variant="outlined" onClick={() => stopLive(event.id)}>
                  Stop Live
                </Button>
                <Button color="error" variant="outlined" onClick={() => deleteEvent(event.id)}>
                  Delete Event
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </TabPanel>

      {/* Blog Posts */}
      <TabPanel value={tab} index={4}>
        <Typography variant="h5">Create Blog Post</Typography>
        <TextField label="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} fullWidth sx={{ my: 1 }} />
        <TextField label="Description" value={newPost.description} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} fullWidth multiline rows={2} sx={{ my: 1 }} />
        <TextField label="Body (HTML)" value={newPost.body} onChange={(e) => setNewPost({ ...newPost, body: e.target.value })} fullWidth multiline rows={4} sx={{ my: 1 }} />
        <TextField label="Author Name" value={newPost.authorName} onChange={(e) => setNewPost({ ...newPost, authorName: e.target.value })} fullWidth sx={{ my: 1 }} />
        <TextField label="Author Image URL" value={newPost.authorImage} onChange={(e) => setNewPost({ ...newPost, authorImage: e.target.value })} fullWidth sx={{ my: 1 }} />

        <TextField label="Status" select value={newPost.status} onChange={(e) => setNewPost({ ...newPost, status: e.target.value })} fullWidth sx={{ my: 1 }}>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="published">Published</MenuItem>
        </TextField>

        <Button variant="contained" onClick={createBlogPost}>
          Create Post
        </Button>

        <Typography variant="h5" sx={{ mt: 4 }}>
          Existing Posts
        </Typography>
        {blogPosts.map((post) => (
          <Card key={post.id} sx={{ my: 1 }}>
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2">Status: {post.status}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => deleteBlogPost(post.id)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </TabPanel>

      {/* Community Posts */}
      <TabPanel value={tab} index={5}>
        <Typography variant="h5">Create Community Post</Typography>
        <TextField label="Title" value={newCommunity.title} onChange={(e) => setNewCommunity({ ...newCommunity, title: e.target.value })} fullWidth sx={{ my: 1 }} />
        <TextField label="Description" value={newCommunity.description} onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })} fullWidth multiline rows={3} sx={{ my: 1 }} />
        <TextField label="Media URLs (comma separated)" value={newCommunity.mediaUrls} onChange={(e) => setNewCommunity({ ...newCommunity, mediaUrls: e.target.value })} fullWidth sx={{ my: 1 }} />
        <Button variant="contained" onClick={createCommunityPost}>
          Create Post
        </Button>

        <Typography variant="h5" sx={{ mt: 4 }}>
          Existing Posts
        </Typography>
        {communityPosts.map((post) => (
          <Card key={post.id} sx={{ my: 1 }}>
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2">{post.description?.slice(0, 60)}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => deleteCommunityPost(post.id)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </TabPanel>

      {/* Publications */}
      <TabPanel value={tab} index={6}>
        <Typography variant="h5">Create Publication</Typography>
        <TextField label="Title" value={newPublication.title} onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })} fullWidth sx={{ my: 1 }} />
        <TextField label="Description" value={newPublication.description} onChange={(e) => setNewPublication({ ...newPublication, description: e.target.value })} fullWidth multiline rows={2} sx={{ my: 1 }} />
        <TextField label="URL" value={newPublication.url} onChange={(e) => setNewPublication({ ...newPublication, url: e.target.value })} fullWidth sx={{ my: 1 }} />
        <TextField label="Type (pdf|video)" value={newPublication.type} onChange={(e) => setNewPublication({ ...newPublication, type: e.target.value })} fullWidth sx={{ my: 1 }} />
        <Button variant="contained" onClick={createPublication}>
          Create Publication
        </Button>

        <Typography variant="h5" sx={{ mt: 4 }}>
          Existing Publications
        </Typography>
        {publications.map((pub) => (
          <Card key={pub.id} sx={{ my: 1 }}>
            <CardContent>
              <Typography variant="h6">{pub.title}</Typography>
              <Typography variant="body2">Type: {pub.type}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => deletePublication(pub.id)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </TabPanel>

      {/* Dana Bookings */}
      <TabPanel value={tab} index={7}>
        <Typography variant="h5">Dana Bookings</Typography>
        {danaBookings.map((booking) => (
          <Card key={booking.id} sx={{ my: 1 }}>
            <CardContent>
              <Typography variant="h6">
                Owner: {booking.User?.firstName || 'Unknown'} {booking.User?.lastName || ''}
              </Typography>
              <Typography variant="body2">
                Owner Email: {booking.User?.email || '-'}
              </Typography>
              <Typography variant="body2">
                Date: {new Date(booking.date).toLocaleDateString()} | Meal: {booking.mealType}
              </Typography>
              <Typography variant="body2">Admin status: {booking.status}</Typography>
              <Typography variant="body2">Request status: {booking.requestStatus}</Typography>
              {booking.requestMessage && (
                <Typography variant="body2">Request message: {booking.requestMessage}</Typography>
              )}

              {booking.requestUser && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    Request User: {booking.requestUser.firstName || 'Unknown'} {booking.requestUser.lastName || ''}
                  </Typography>
                  <Typography variant="body2">
                    Request User Email: {booking.requestUser.email || '-'}
                  </Typography>
                </>
              )}
            </CardContent>
            <CardActions sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button size="small" onClick={() => updateDanaStatus(booking.id, 'approved')}>
                Approve Booking
              </Button>
              <Button size="small" onClick={() => updateDanaStatus(booking.id, 'declined')}>
                Decline Booking
              </Button>
              {booking.requestStatus === 'pending' && (
                <>
                  <Button size="small" color="success" onClick={() => respondDanaRequest(booking.id, 'approved')}>
                    Accept Request
                  </Button>
                  <Button size="small" color="error" onClick={() => respondDanaRequest(booking.id, 'declined')}>
                    Reject Request
                  </Button>
                </>
              )}
            </CardActions>
          </Card>
        ))}
      </TabPanel>

      {/* Donations */}
      <TabPanel value={tab} index={8}>
        <Typography variant="h5">Donations</Typography>
        {donations.map((don) => (
          <Card key={don.id} sx={{ my: 1 }}>
            <CardContent>
              <Typography variant="body2">
                {don.type} donation of ${don.amount} on {new Date(don.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </TabPanel>

      {/* Monthly Donations */}
      <TabPanel value={tab} index={9}>
        <Typography variant="h5">Monthly Donations</Typography>
        {monthlyPlans.map((plan) => (
          <Card key={plan.id} sx={{ my: 1 }}>
            <CardContent>
              <Typography variant="body2">
                User ID: {plan.userId} | Amount: ${plan.amount} | Frequency: {plan.frequency} | Status: {plan.status}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </TabPanel>

      {/* Contact Messages */}
      <TabPanel value={tab} index={10}>
        <Typography variant="h5">Contact Messages</Typography>
        <List>
          {contactMessages.map((msg) => (
            <ListItem
              key={msg.id}
              alignItems="flex-start"
              secondaryAction={
                !msg.responded && (
                  <Button size="small" onClick={() => markResponded(msg.id)}>
                    Mark Responded
                  </Button>
                )
              }
            >
              <ListItemText
                primary={`${msg.name} (${msg.email})`}
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      {msg.message}
                    </Typography>
                    <Typography component="span" variant="caption" sx={{ display: "block" }}>
                      Responded: {msg.responded ? "Yes" : "No"}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </TabPanel>
    </Box>
  );
};

export default AdminDashboard;