import express from "express";
import { getGigs, createGig } from "../controllers/gig.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const gigRoutes = express.Router();

gigRoutes.get("/", getGigs);
gigRoutes.post("/", authMiddleware, createGig);

export default gigRoutes;
