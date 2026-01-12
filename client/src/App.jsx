import { Routes, Route } from "react-router-dom";
import Gigs from "./pages/Gigs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostGig from "./pages/PostGig";
import GigDetails from "./pages/GigDetails";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar/>
      <Routes>
        <Route path="/" element={<Gigs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post" element={<PostGig />} />
        <Route path="/gigs/:id" element={<GigDetails />} />
      </Routes>
    </>
  );
}
