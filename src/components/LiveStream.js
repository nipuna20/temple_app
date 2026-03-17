import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * LiveStream component implements a minimal WebRTC broadcast for event live
 * streaming. The server uses Socket.IO for signalling (see src/app.js in the
 * backend). When mounted, this component loads the Socket.IO client from
 * CDN (since socket.io-client is not bundled in this project) and then
 * connects to the backend. Users join a room identified by the eventId.
 *
 * If the current user is an admin they can start sharing their camera and
 * microphone. The media stream is sent via a RTCPeerConnection to all
 * connected viewers. Viewers will see the remote stream in the player.
 *
 * Note: This is a basic proof‑of‑concept implementation intended to show
 * developers how to integrate live audio/video streaming. In production you
 * should handle errors, renegotiation, multiple viewers, and clean up
 * resources more robustly.
 */
const LiveStream = ({ eventId }) => {
  const { user } = useContext(AuthContext);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const [started, setStarted] = useState(false);

  // Dynamically load Socket.IO client script. When loaded, connect to
  // `/` (same origin) and join the event room. We avoid importing
  // socket.io-client as a dependency to keep the bundle light.
  useEffect(() => {
    const script = document.createElement("script");
    // Use a specific version to avoid breaking changes. 4.x works with
    // backend's socket.io@4.
    script.src = "https://cdn.socket.io/4.5.4/socket.io.min.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      // eslint-disable-next-line no-undef
      const socket = window.io("/", {
        path: "/socket.io",
        transports: ["websocket"],
        withCredentials: true,
      });
      socketRef.current = socket;
      socket.emit("joinEventRoom", { eventId });

      // Handle incoming signalling messages
      socket.on("webrtc-offer", async ({ offer }) => {
        if (!pcRef.current) createPeerConnection();
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket.emit("webrtc-answer", { eventId, answer });
      });

      socket.on("webrtc-answer", async ({ answer }) => {
        if (!pcRef.current) return;
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("webrtc-ice-candidate", async ({ candidate }) => {
        if (!pcRef.current) return;
        try {
          await pcRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("Error adding received ice candidate", err);
        }
      });
    };
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveEventRoom", { eventId });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      document.body.removeChild(script);
    };
  }, [eventId]);

  // Create a new RTCPeerConnection and set up handlers. This function
  // encapsulates the logic for both broadcasters and viewers. When the
  // connection is negotiated by the broadcaster, the viewer will respond to
  // offers and display the incoming stream.
  function createPeerConnection() {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
      ],
    });
    pc.onicecandidate = ({ candidate }) => {
      if (candidate && socketRef.current) {
        socketRef.current.emit("webrtc-ice-candidate", { eventId, candidate });
      }
    };
    pc.ontrack = (event) => {
      // When we receive remote tracks, attach them to the remote video element
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    pcRef.current = pc;
    return pc;
  }

  // Start broadcasting: capture media and create a new peer connection.
  const startBroadcast = async () => {
    if (!socketRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      const pc = createPeerConnection();
      // Add all tracks to the peer connection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      // Create offer and send via socket
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current.emit("webrtc-offer", { eventId, offer });
      setStarted(true);
    } catch (err) {
      console.error("Failed to start broadcast", err);
      alert("Could not access camera/microphone. Please check permissions.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {/* The broadcaster sees their own camera feed here */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{ width: "320px", backgroundColor: "#000" }}
        />
        {/* All viewers (including broadcaster) see the remote feed here */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "320px", backgroundColor: "#000" }}
        />
      </div>
      {user?.role === "admin" && !started && (
        <button onClick={startBroadcast} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          Start Broadcasting
        </button>
      )}
    </div>
  );
};

export default LiveStream;