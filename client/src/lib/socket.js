import { io } from "socket.io-client";

// Get root URL from API URL by stripping /api
const apiUrl = import.meta.env.VITE_API_URL || "";
const socketUrl = apiUrl.replace(/\/api$/, "") || (import.meta.env.PROD ? window.location.origin : "http://localhost:5000");

export const socket = io(socketUrl, {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Connected to WebSocket Server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket Server");
});
