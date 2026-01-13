import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import bidRoutes from "./routes/bid.routes.js";

dotenv.config();
connectDB();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://gigflow-phi.vercel.app"
  ],
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

app.get("/", (req, res) => {
  res.send("GigFlow API running...");
});

/* ---------------- SOCKET.IO SETUP ---------------- */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://gigflow-phi.vercel.app"
    ],
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId); // user-specific room
    console.log("User joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


export { io };

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
