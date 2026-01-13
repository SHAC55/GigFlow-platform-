import { Routes, Route } from "react-router-dom";
import Gigs from "./pages/Gigs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostGig from "./pages/PostGig";
import GigDetails from "./pages/GigDetails";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import socket from "./socket";
import { useEffect } from "react";
import { useNotification } from "./context/NotificationContext";
import Notifications from "./pages/Notifications";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { addNotification } = useNotification();
  const { authLoading } = useAuth();

  useEffect(() => {
    socket.on("hired", (data) => {
      addNotification({
        id: Date.now(),
        message: ` You have been hired for "${data.gigTitle}"`,
        read: false,
        time: new Date().toLocaleTimeString(),
      });
    });

    return () => socket.off("hired");
  }, []);


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />

      <Routes>
        <Route path="/" element={<Gigs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/post"
          element={
            <ProtectedRoute>
              <PostGig />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gigs/:id"
          element={
            <ProtectedRoute>
              <GigDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
