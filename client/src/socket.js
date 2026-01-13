import { io } from "socket.io-client";

const socket = io("https://gigflow-platform-2n2e.onrender.com", {
  withCredentials: true,
});

export default socket;

// http://localhost:3000